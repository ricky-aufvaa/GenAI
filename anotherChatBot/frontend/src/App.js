import React, { useState, useRef, useEffect } from "react";

const apiOptions = [
  {
    label: "Node.js (Express)",
    value: "express",
    url: "http://localhost:8000/queryendpoint",
    description: "This will send API call to Node.js server",
  },
  {
    label: "FastAPI",
    value: "fastapi",
    url: "http://localhost:8001/queryendpoint",
    description: "This will send API call to FastAPI server",
  },
  {
    label: "Fastify",
    value: "fastify",
    url: "http://localhost:8002/queryendpoint",
    description: "This will send API call to Fastify server",
  },
  {
    label: "Flask",
    value: "flask",
    url: "http://localhost:8003/queryendpoint",
    description: "This will send API call to Flask server",
  },
  {
    label: "Django",
    value: "django",
    url: "http://localhost:8004/queryendpoint",
    description: "This will send API call to Django server",
  },
];

export default function App() {
  const [selectedAPI, setSelectedAPI] = useState(apiOptions[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hoveredOption, setHoveredOption] = useState(null);
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
        setHoveredOption(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle submit with streaming response
  const handleSubmit = async () => {
    if (!query.trim()) return;
    setAnswer("");
    try {
      const response = await fetch(selectedAPI.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        setAnswer("Error contacting server");
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setAnswer((prev) => prev + chunk);
      }
    } catch (err) {
      setAnswer("Error streaming response");
      console.error(err);
    }
  };

  // Handle Enter key inside input
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        backgroundColor: "#f9fafb",
        display: "flex",
        flexDirection: "column",
        padding: 20,
        fontFamily:
          "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        position: "relative",
      }}
    >
      {/* Dropdown top left */}
      <div
        ref={dropdownRef}
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          width: 220,
          backgroundColor: "#e0e0e0",
          borderRadius: 12,
          border: "1.5px solid #bbb",
          cursor: "pointer",
          userSelect: "none",
          color: "#000",
          fontWeight: "600",
          fontSize: 16,
          padding: "10px 14px",
          zIndex: 200,
        }}
        onClick={() => setDropdownOpen((open) => !open)}
        aria-haspopup="listbox"
        aria-expanded={dropdownOpen}
        role="combobox"
      >
        {selectedAPI.label}

        {dropdownOpen && (
          <ul
            role="listbox"
            tabIndex={-1}
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              borderRadius: 12,
              marginTop: 6,
              maxHeight: 150,
              overflowY: "auto",
              boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
              padding: 0,
              listStyle: "none",
              zIndex: 300,
            }}
          >
            {apiOptions.map((option) => (
              <li
                key={option.value}
                role="option"
                aria-selected={selectedAPI.value === option.value}
                onMouseEnter={() => setHoveredOption(option.value)}
                onMouseLeave={() => setHoveredOption(null)}
                onClick={() => {
                  setSelectedAPI(option);
                  setDropdownOpen(false);
                  setHoveredOption(null);
                }}
                style={{
                  padding: "10px 14px",
                  backgroundColor:
                    selectedAPI.value === option.value ? "#d0d0d0" : "transparent",
                  cursor: "pointer",
                }}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}

        {/* Tooltip */}
        {dropdownOpen && hoveredOption && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: "105%",
              width: 220,
              backgroundColor: "#222",
              color: "#fff",
              padding: "8px 12px",
              borderRadius: 8,
              fontSize: 13,
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
              whiteSpace: "normal",
              zIndex: 400,
              marginTop: 6,
            }}
          >
            {apiOptions.find((opt) => opt.value === hoveredOption)?.description}
          </div>
        )}
      </div>

      {/* Answer display */}
      <div
        style={{
          flexGrow: 1,
          marginTop: 60,
          marginBottom: 100,
          padding: 20,
          backgroundColor: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          overflowY: "auto",
          whiteSpace: "pre-wrap",
          fontSize: 16,
          color: "#333",
          lineHeight: 1.5,
        }}
      >
        {answer || "Your answer will appear here..."}
      </div>

      {/* Input box fixed bottom */}
      <div
        style={{
          position: "fixed",
          bottom: 20,
          left: 20,
          right: 20,
          backgroundColor: "#e0e0e0",
          borderRadius: 30,
          display: "flex",
          alignItems: "center",
          padding: "8px 16px",
          maxWidth: 900,
          margin: "0 auto",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <input
          type="text"
          placeholder="Enter your query..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            flexGrow: 1,
            border: "none",
            outline: "none",
            fontSize: 16,
            backgroundColor: "transparent",
            color: "#222",
            borderRadius: 30,
            padding: "10px 16px",
          }}
        />
        <button
          onClick={handleSubmit}
          style={{
            marginLeft: 12,
            backgroundColor: "#4f46e5",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: 30,
            fontWeight: "600",
            cursor: "pointer",
            userSelect: "none",
            transition: "background-color 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#4338ca")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#4f46e5")}
        >
          Enter
        </button>
      </div>
    </div>
  );
}
