import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Admin from "./pages/Admin";
import Sales from "./pages/Sales";
import "./index.css";

function AppWrapper() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) document.body.classList.add("dark");
    else document.body.classList.remove("dark");
  }, [dark]);

  return (
    <>
      <div className="topbar">
        <h2>TransMonk Inventory</h2>
        <button className="dark-btn" onClick={() => setDark(!dark)}>
          {dark ? "Light Mode ☀️" : "Dark Mode 🌙"}
        </button>
      </div>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/sales" element={<Sales />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

createRoot(document.getElementById("root")).render(<AppWrapper />);
