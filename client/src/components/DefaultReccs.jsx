import React, { useState } from "react";
import { getDefaultRecommendations } from "../services/api";
import BookList from "./BookList";

const DefaultRecommendations = () => {
  const [bookInput, setBookInput] = useState("");
  const [books, setBooks] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);



  const addBook = () => {
    if (bookInput.trim()) {
      const newBook = {
        id: Date.now(),
        title: bookInput.trim(),
      };
      setBooks([...books, newBook]);
      setBookInput("");
    }
  };

  const removeBook = (id) => {
    setBooks(books.filter((book) => book.id !== id));
  };

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      // Extract the book titles/ISBNs for the API call
      const bookIds = books.map((book) => book.title);
      const data = await getDefaultRecommendations(bookIds);
      setRecommendations(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Book Recommendations</h2>
      <p className="mb-4">
        Get recommendations based on books. Enter ISBNs. If no books are
        entered, we'll provide popular recommendations.
      </p>

      <div className="mb-4">
        <div className="flex mb-2">
          <input
            type="text"
            value={bookInput}
            onChange={(e) => {
              const numericValue = e.target.value.replace(/[^0-9]/g, "");
              setBookInput(numericValue);
            }}
            className="flex-grow p-2 border rounded-l"
            placeholder="Enter a book ISBN"
            onKeyPress={(e) => e.key === "Enter" && addBook()}
          />
          <button
            onClick={addBook}
            className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
          >
            Add
          </button>
        </div>

        {books.length > 0 && (
          <div className="mt-3">
            <h3 className="font-medium mb-2">Books you've entered:</h3>
            <ul className="border rounded divide-y">
              {books.map((book) => (
                <li
                  key={book.id}
                  className="p-3 flex justify-between items-center"
                >
                  <span>{book.title}</span>
                  <button
                    onClick={() => removeBook(book.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <button
        onClick={fetchRecommendations}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
      >
        Get Recommendations
      </button>

      {loading && <p>Loading recommendations...</p>}

      {recommendations.length > 0 && (
        <div className="mt-4">
          <h3 className="font-medium mb-2">Your Recommendations:</h3>
          <BookList books={recommendations} />
        </div>
      )}
    </div>
  );
};

export default DefaultRecommendations;
