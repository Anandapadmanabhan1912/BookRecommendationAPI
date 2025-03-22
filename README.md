# LightGCN Book Recommendation API

This API provides book recommendations using a LightGCN model trained on user-book interaction data. The model supports recommendations based on user demographics and previous book interactions.
The model has been trained based on Arashnic dataset from Kaggle [link](https://www.kaggle.com/datasets/arashnic/book-recommendation-dataset)


The data and model have been zipped and save to my drive [link](https://drive.google.com/file/d/1umc7vSvN9tkrQsxNRMUCw9ZSDzwuJOMW/view?usp=sharing)

## 🚀 Features

- **Recommend Books Based on Demographics** (Age & Country)
- **Recommend Books for a New User** based on previously interacted books
- **Popular Book Recommendations** as a fallback
- **Pre-trained LightGCN Model** for collaborative filtering

---

## 📂 Project Structure

```
.
├── app.py                 # Flask API implementation
├── model.py               # LightGCN model definition
├── data/
│   ├── books.csv          # Book dataset
│   ├── ratings.csv        # User ratings dataset
│   ├── users.csv          # User demographic dataset
├── model/
│   ├── lightgcn_model.pt  # Trained LightGCN model
│   ├── user_id_map.pth    # Mapping for User IDs
│   ├── book_id_map.pth    # Mapping for Book ISBNs
├── README.md              # Documentation
├── requirements.txt       # Python dependencies
```

---

## 🛠 Setup Instructions

### 1️⃣ Install Dependencies

Ensure you have Python 3.8+ installed. Then, run:

```bash
pip install -r requirements.txt
```

### 2️⃣ Run the API

Start the Flask server with:

```bash
python app.py
```

The API will be available at: `http://127.0.0.1:5000/`

---

## 📡 API Endpoints

### **1️⃣ Recommend Books by Demographics**

#### **POST** `/recommend_by_demographics`

**Request Body:**

```json
{
  "country": "USA",
  "age_range": [25, 40],
  "top_k": 5
}
```

**Response:**

```json
{
    "recommendations": [
        {"Book-Title": "The Catcher in the Rye", "Book-Author": "J.D. Salinger", "Year-Of-Publication": "1951"},
        ...
    ]
}
```

### **2️⃣ Recommend Books for a New User (Based on ISBNs)**

#### **POST** `/recommend_new_user`

**Request Body:**

```json
{
  "books": ["0316769487", "0679783261"],
  "top_k": 5
}
```

**Response:**

```json
{
    "recommendations": [
        {"Book-Title": "To Kill a Mockingbird", "Book-Author": "Harper Lee", "Year-Of-Publication": "1960"},
        ...
    ]
}
```

### **3️⃣ General Book Recommendations**

#### **POST** `/recommend`

**Request Body:**

```json
{
  "books": ["059035342X", "0439064872"],
  "top_k": 5
}
```

**Response:** Same as above.

---

## 🎯 How It Works

1. **Data Preprocessing**
   - Users, books, and ratings are loaded from CSV files.
   - `User-ID` and `ISBN` values are mapped to integer IDs for LightGCN.
2. **Model Inference**
   - LightGCN computes user embeddings based on graph propagation.
   - Recommendations are generated using cosine similarity.
3. **API Response**
   - ISBNs are mapped back to book titles before returning results.

---

## 📌 Notes

- The trained LightGCN model is optimized for collaborative filtering.
- Ensure that `user_id_map.pth` and `book_id_map.pth` are present in the `model/` directory.

---

## 🤝 Contributing

Feel free to fork this repo and submit PRs!

---

## 📝 License

MIT License. Free to use and modify!
