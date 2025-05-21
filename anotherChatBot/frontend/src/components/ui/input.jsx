import React from "react";

export function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full rounded-xl border border-gray-300 bg-white px-5 py-3 text-lg text-gray-800 placeholder-gray-400 shadow-sm
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition
        disabled:bg-gray-100 disabled:text-gray-400 ${className}`}
      {...props}
    />
  );
}