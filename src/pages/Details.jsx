import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Details() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const country = state?.selectedCountry;

  // الحالات الأساسية فقط لضمان واجهة نظيفة كما طلبت
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("dahabia");

  useEffect(() => {
    if (!country) {
      navigate("/");
    }
  }, [country, navigate]);

  if (!country) return null;

  const handleProceedToCheckout = () => {
    if (!email || !name) {
      alert("يرجى إدخال البريد الإلكتروني والاسم للمتابعة");
      return;
    }

    // نرسل فقط الاسم والايميل، والبيانات الاخرى ستطلب في صفحة Checkout
    navigate("/checkout", {
      state: {
        selectedCountry: country,
        customer: { name, email },
        method: paymentMethod
      }
    });
  };

  const inputStyle = { width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", outlineColor: "#e11d48", textAlign: "right" };

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh", padding: "40px 20px", fontFamily: "Arial, sans-serif", direction: "rtl" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "40px", height: "40px", backgroundColor: "#e11d48", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "900", fontSize: "20px" }}>S</div>
            <h1 style={{ fontSize: "20px", fontWeight: "900", margin: 0, color: "#1e293b" }}>SoufSim</h1>
          </div>
          <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "#64748b", fontWeight: "bold", cursor: "pointer", fontSize: "14px" }}>العودة للرئيسية</button>
        </div>

        {/* نموذج معلومات الفوترة المختصر والاحترافي */}
        <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "20px", boxShadow: "0 5px 15px rgba(0,0,0,0.05)", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "20px", color: "#1e293b", borderRight: "4px solid #e11d48", paddingRight: "10px" }}>معلومات الفوترة</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", color: "#64748b" }}>البريد الإلكتروني</label>
              <input type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} style={{ ...inputStyle, direction: "ltr" }} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", color: "#64748b" }}>الاسم الكامل</label>
              <input type="text" placeholder="اسمك الكامل" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
            </div>
          </div>
        </div>

        <button
          onClick={handleProceedToCheckout}
          style={{ width: "100%", padding: "16px", backgroundColor: "#1e293b", color: "white", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "bold", cursor: "pointer" }}
        >
          المتابعة لإدخال بيانات البطاقة
        </button>

      </div>
    </div>
  );
}