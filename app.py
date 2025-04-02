import torch
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
from model import LightGCN  # Import your trained model class

# Initialize Flask App
app = Flask(__name__)
CORS(app)

# Load Data
books_df = pd.read_csv("./data/books.csv", dtype={'ISBN': 'string', 'Book-Title': 'string', 'Book-Author': 'string', 'Year-Of-Publication': 'string', 'Image-URL-M':'string'})
ratings_df = pd.read_csv("./data/ratings.csv", dtype={'User-ID': 'int32', 'ISBN': 'string', 'Book-Rating': 'int8'})
users_df = pd.read_csv("./data/users.csv", dtype={'User-ID': 'int32', 'Location': 'string', 'Age': 'float64'})

# Load Mappings
user_id_map = torch.load("./model/user_id_map.pth")  # Mapping from User-ID to unique integer
book_id_map = torch.load("./model/book_id_map.pth")  # Mapping from ISBN to unique integer
id_to_book = {v: k for k, v in book_id_map.items()}  # Reverse mapping



# Load Model on CPU
device = torch.device("cpu")
model = LightGCN(num_nodes=len(user_id_map)+len(book_id_map), embedding_dim=64, num_layers=3)
model.load_state_dict(torch.load("./model/lightgcn_model.pt", map_location=device))
model.to(device)
model.eval()

### 📌 Helper Functions
def recommend_popular_books(ratings_df, books_df, top_k=5):
    """Recommend top-K popular books based on ratings count."""
    if ratings_df.empty or books_df.empty:
        return books_df.sample(n=top_k, random_state=42).to_dict(orient="records")

    popular_books = ratings_df['ISBN'].value_counts().index[:top_k]
    recommended_books = books_df[books_df['ISBN'].isin(popular_books)][['Book-Title', 'Book-Author', 'Year-Of-Publication', 'Image-URL-M']]
    
    return recommended_books.to_dict(orient="records")

def recommend_by_demographics(users_df, user_id_map, book_id_map, books_df, model, country=None, age_range=None, top_k=5):
    """Recommend books using LightGCN for users matching demographic filters."""
    users_df = users_df.dropna(subset=['Age'])
    users_df = users_df[users_df['Age'].between(5, 100)]
    users_df['Country'] = users_df['Location'].apply(lambda x: str(x).split(',')[-1].strip())

    # Filter users by country and age
    filtered_users = users_df.copy()
    if country:
        filtered_users = filtered_users[filtered_users['Country'].str.lower() == country.lower()]
    if age_range:
        min_age, max_age = age_range
        filtered_users = filtered_users[(filtered_users['Age'] >= min_age) & (filtered_users['Age'] <= max_age)]

    if filtered_users.empty:
        return {"error": "No matching users found"}, 400

    # Map User-ID to model indices
    filtered_user_ids = [user_id_map[uid] for uid in filtered_users["User-ID"] if uid in user_id_map]

    if not filtered_user_ids:
        return {"error": "No users found in user_id_map"}, 400

    # Convert to tensor for model input
    user_tensor = torch.tensor(filtered_user_ids, dtype=torch.long, device=device)

    with torch.no_grad():
        scores = model.recommend_by_users(user_tensor, top_k)  # Model should support batch inference

    recommended_isbns = [id_to_book[idx] for idx in scores if idx in id_to_book]


    # Retrieve book details
    recommended_books = books_df[books_df["ISBN"].isin(recommended_isbns)][["Book-Title", "Book-Author", "Year-Of-Publication", "Image-URL-M"]]

    return recommended_books.to_dict(orient="records")


def recommend_new_user(isbn_list, top_k=5):
    """Generate recommendations for a new user based on given book interactions."""
    interacted_book_ids = [book_id_map[isbn] for isbn in isbn_list if isbn in book_id_map]

    if not interacted_book_ids:
        return {"error": "No valid ISBNs found in database"}, 400

    interacted_tensor = torch.tensor(interacted_book_ids, dtype=torch.long, device=device)

    with torch.no_grad():
        scores = model.recommend_by_books(interacted_tensor, top_k)  # Implement this in LightGCN model

    recommended_isbns = [id_to_book[idx] for idx in scores if idx in id_to_book]
    recommended_books = books_df[books_df["ISBN"].isin(recommended_isbns)][["Book-Title", "Book-Author", "Year-Of-Publication", "Image-URL-M"]]

    return recommended_books.to_dict(orient="records")

### 📌 API Endpoints
@app.route("/recommend", methods=["POST"])
def recommend():
    """Recommend books based on a new user's interactions with ISBNs."""
    data = request.json
    isbn_list = data.get("books", [])
    top_k = data.get("top_k", 5)

    if not isbn_list:
        popular_books = recommend_popular_books(ratings_df, books_df, top_k)
        return jsonify({
            "message": "Showing popular books since none were specified.", 
            "recommendations": popular_books
        })

    recommendations = recommend_new_user(isbn_list, top_k)
    return jsonify({"recommendations": recommendations})

@app.route("/recommend_by_demographics", methods=["POST"])
def recommend_by_demographics_api():
    """Recommend books using LightGCN for filtered users."""
    data = request.json
    country = data.get("country", None)
    age_range = data.get("age_range", None)
    top_k = data.get("top_k", 5)

    recommendations = recommend_by_demographics(
        users_df, user_id_map, book_id_map, books_df, model, country, age_range, top_k
    )
    return jsonify({"recommendations": recommendations})


@app.route("/recommend_new_user", methods=["POST"])
def recommend_for_new_user():
    """Recommend books for a new user based on provided ISBNs."""
    data = request.json
    isbn_list = data.get("books", [])
    top_k = data.get("top_k", 5)

    if not isbn_list:
        return jsonify({"error": "No books provided"}), 400

    recommendations = recommend_new_user(isbn_list, top_k)
    return jsonify({"recommendations": recommendations})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
