// src/components/ARButton.jsx
import React from "react";

export default function ARButton({ supported, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
    >
      {supported ? "View in AR" : "Try AR (Fallback)"}
    </button>
  );
}
