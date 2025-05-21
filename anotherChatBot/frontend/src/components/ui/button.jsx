import React from "react";

export function Button({ children, className = '', ...props }) {
  return (
    <button
      className={`w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600
        px-6 py-3 text-lg font-semibold text-white shadow-lg hover:from-indigo-700 hover:to-purple-700
        focus:outline-none focus:ring-4 focus:ring-indigo-300 transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
