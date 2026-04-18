import React, { useState } from "react";
// لاحظ: قمنا باستدعاء Routes و Route فقط
import { Routes, Route } from "react-router-dom";

// استيراد جميع الصفحات
import Home from "./pages/Home";
import Details from "./pages/Details";
import Login from "./pages/Login";
import Checkout from "./pages/Checkout";

export default function App() {
  const [userRole, setUserRole] = useState("customer");

  return (
    // أزلنا <BrowserRouter> من هنا لتجنب التضارب
    <Routes>
      <Route path="/" element={<Home userRole={userRole} setUserRole={setUserRole} />} />
      <Route path="/details" element={<Details />} />
      <Route path="/login" element={<Login />} />
      <Route path="/checkout" element={<Checkout />} />
    </Routes>
  );
}