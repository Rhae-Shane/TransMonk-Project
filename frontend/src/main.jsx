import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Admin from "./pages/Admin.jsx";
import Sales from "./pages/Sales.jsx";
import "./index.css";

function AppWrapper() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <>
      {/* Top Bar */}
      <div className="topbar">
        <h2 className="app-title">TransMonk Inventory</h2>

        <button
          className="dark-btn"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/sales" replace />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/sales" element={<Sales />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

createRoot(document.getElementById("root")).render(<AppWrapper />);
