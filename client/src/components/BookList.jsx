import React from "react";

const BookList = ({ books }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
      {books.map((book, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          {/* Book Cover */}
          <div className="aspect-[2/3] bg-gray-100">
            <img
              src={book["Image-URL-M"]}
              alt={`Cover of ${book["Book-Title"]}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/200x300?text=No+Cover";
              }}
            />
          </div>

          {/* Book Info */}
          <div className="p-3">
            <h3 className="font-medium text-sm line-clamp-2">
              {book["Book-Title"]}
            </h3>
            {book["Book-Author"] && (
              <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                {book["Book-Author"]}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
export default BookList;
