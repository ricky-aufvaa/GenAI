import React from "react";

export function Card({ className = '', children }) {
  return (
    <div
      className={`bg-white rounded-3xl shadow-2xl border border-gray-100
        max-w-xl mx-auto ${className}`}
    >
      {children}
    </div>
  );
}

export function CardContent({ className = '', children }) {
  return (
    <div className={`p-8 ${className}`}>
      {children}
    </div>
  );
}
