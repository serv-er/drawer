import React from "react";

export default function BackgroundSelectorUI({ bg, setBg }) {
  return (
    <div className="flex space-x-2">
      {["black", "white"].map((b) => (
        <button
          key={b}
          className={`px-3 py-1 rounded ${
            bg === b ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setBg(b)}
        >
          {b}
        </button>
      ))}
    </div>
  );
}
