import React from "react";

const TabButton = ({ id, active, onClick, children }) => {
  return (
    <button
      className={`px-4 py-2 font-medium ${
        active
          ? "border-b-2 border-blue-500 text-blue-600"
          : "text-gray-600 hover:text-blue-500"
      }`}
      onClick={() => onClick(id)}
    >
      {children}
    </button>
  );
};

export default TabButton;
