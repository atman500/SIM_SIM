import React, { useState, useEffect } from "react"; // إضافة useState و useEffect هنا
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Details from "./pages/Details";
import Checkout from "./pages/Checkout"; // تأكد من إضافة هذا السطر لاستيراد صفحة الدفع

export default function App() {
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem("userRole") || "customer";
  });

  useEffect(() => {
    localStorage.setItem("userRole", userRole);
  }, [userRole]);

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={<Home userRole={userRole} setUserRole={setUserRole} />}
        />
        <Route
          path="/details"
          element={<Details userRole={userRole} />}
        />
        <Route
          path="/checkout"
          element={<Checkout userRole={userRole} />}
        />
      </Routes>
    </div>
  );
}