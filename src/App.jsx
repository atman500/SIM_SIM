import React, { useState } from "react";
// لاحظ أننا أزلنا BrowserRouter من سطر الاستيراد
import { Routes, Route } from "react-router-dom";

// استيراد الصفحات
import Home from "./pages/Home";
import Details from "./pages/Details";
import Login from "./pages/Login";

export default function App() {
  const [userRole, setUserRole] = useState("customer");

  return (
    // أزلنا وسم <BrowserRouter> من هنا وتركنا <Routes> فقط
    <Routes>
      <Route path="/" element={<Home userRole={userRole} setUserRole={setUserRole} />} />
      <Route path="/details" element={<Details />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}