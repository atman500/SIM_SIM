// src/App.jsx
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Details from "./pages/Details.jsx";
import Support from "./pages/Support.jsx"; // استوردنا الصفحة الجديدة

export default function App() {
  const [userRole, setUserRole] = useState("customer");

  return (
    <Routes>
      <Route path="/" element={<Home userRole={userRole} setUserRole={setUserRole} />} />
      <Route path="/details" element={<Details />} />
      <Route path="/support" element={<Support />} /> {/* سجلنا المسار هنا */}
    </Routes>
  );
}