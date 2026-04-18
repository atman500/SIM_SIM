import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

// استيراد الصفحات
import Home from "./pages/Home";
import Details from "./pages/Details";
import Login from "./pages/Login";
import Checkout from "./pages/Checkout";
import AdminDashboard from "./pages/AdminDashboard"; // الصفحة الجديدة للمدير

export default function App() {
  const [userRole, setUserRole] = useState("customer");

  return (
    <Routes>
      {/* صفحة المستخدم الرئيسية */}
      <Route path="/" element={<Home userRole={userRole} setUserRole={setUserRole} />} />

      {/* صفحة تفاصيل الباقة والفوترة */}
      <Route path="/details" element={<Details />} />

      {/* صفحة تسجيل الدخول / إنشاء حساب */}
      <Route path="/login" element={<Login />} />

      {/* صفحة الدفع النهائية */}
      <Route path="/checkout" element={<Checkout />} />

      {/* صفحة لوحة تحكم المدير (مخفية عن الزبائن حالياً) */}
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}