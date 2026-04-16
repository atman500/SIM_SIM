import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { colors } from "../data/mockData";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      width: "100%",
      maxWidth: "480px", // ليتوافق مع أبعاد الموبايل
      backgroundColor: "white",
      boxShadow: "0 -4px 20px rgba(0,0,0,0.05)",
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
      padding: "15px 0",
      zIndex: 1000
    }}>

      {/* --- أزرار التنقل الأساسية فقط --- */}
      <div onClick={() => navigate("/")} style={{ cursor: "pointer", color: location.pathname === "/" ? colors.primary : "#9ca3af", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        <span style={{ fontSize: "11px", marginTop: "4px", fontWeight: "500" }}>الرئيسية</span>
      </div>

      <div onClick={() => navigate("/checkout")} style={{ cursor: "pointer", color: location.pathname === "/checkout" ? colors.primary : "#9ca3af", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
        <span style={{ fontSize: "11px", marginTop: "4px", fontWeight: "500" }}>السلة</span>
      </div>

      <div onClick={() => navigate("/admin")} style={{ cursor: "pointer", color: location.pathname === "/admin" ? colors.primary : "#9ca3af", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="21"></line></svg>
        <span style={{ fontSize: "11px", marginTop: "4px", fontWeight: "500" }}>الإدارة</span>
      </div>
    </div>
  );
}