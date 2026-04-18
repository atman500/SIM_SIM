import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Details() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // استرجاع بيانات الدولة من الصفحة الرئيسية
  const country = state?.selectedCountry;
  const userRole = state?.userRole || "customer";

  // حالة النماذج
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("dahabia");

  // العودة للرئيسية إذا تم الدخول للصفحة بدون اختيار دولة
  useEffect(() => {
    if (!country) {
      navigate("/");
    }
  }, [country, navigate]);

  if (!country) return null;

  // الدالة التي تنقلك لصفحة إدخال البطاقة الذهبية (Checkout)
  const handleProceedToCheckout = () => {
    if (!email || !name) {
      alert("يرجى إدخال البريد الإلكتروني والاسم للمتابعة");
      return;
    }

    // الانتقال لصفحة Checkout وتمرير البيانات إليها
    navigate("/checkout", {
      state: {
        selectedCountry: country,
        customer: { name, email },
        method: paymentMethod
      }
    });
  };

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh", padding: "40px 20px", fontFamily: "Arial, sans-serif", direction: "rtl" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>

        {/* الهيدر وزر العودة */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "40px", height: "40px", backgroundColor: "#e11d48", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "900", fontSize: "20px" }}>S</div>
            <h1 style={{ fontSize: "20px", fontWeight: "900", margin: 0, color: "#1e293b" }}>SoufSim</h1>
          </div>
          <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "#64748b", fontWeight: "bold", cursor: "pointer", fontSize: "14px" }}>
            العودة للرئيسية
          </button>
        </div>

        {/* معلومات الفوترة */}
        <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "20px", boxShadow: "0 5px 15px rgba(0,0,0,0.05)", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "20px", color: "#1e293b", borderRight: "4px solid #e11d48", paddingRight: "10px" }}>معلومات الفوترة</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", color: "#64748b" }}>البريد الإلكتروني (لتلقي شريحة eSIM)</label>
              <input type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", outlineColor: "#e11d48", textAlign: "right", direction: "ltr" }} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", color: "#64748b" }}>الاسم الكامل</label>
              <input type="text" placeholder="اسمك الكامل" value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", outlineColor: "#e11d48", textAlign: "right" }} />
            </div>
          </div>
        </div>

        {/* ملخص الطلب */}
        <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "20px", boxShadow: "0 5px 15px rgba(0,0,0,0.05)", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "20px", color: "#1e293b", borderRight: "4px solid #e11d48", paddingRight: "10px" }}>ملخص الطلب</h2>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img src={`https://flagcdn.com/w40/${country.flag}.png`} alt={country.name} style={{ borderRadius: "5px", border: "1px solid #f1f5f9" }} />
              <span style={{ fontWeight: "bold", fontSize: "15px" }}>{country.name} eSIM</span>
            </div>
            <strong style={{ fontSize: "16px" }}>{country.price} د.ج</strong>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "15px", borderTop: "1px solid #e2e8f0" }}>
            <span style={{ fontWeight: "bold", fontSize: "16px" }}>الإجمالي للدفع</span>
            <strong style={{ fontSize: "18px", color: "#e11d48" }}>{country.price} د.ج</strong>
          </div>
        </div>

        {/* طريقة الدفع والانتقال */}
        <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "20px", boxShadow: "0 5px 15px rgba(0,0,0,0.05)" }}>
          <h2 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "20px", color: "#1e293b", borderRight: "4px solid #e11d48", paddingRight: "10px" }}>اختر طريقة الدفع</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "25px" }}>
            <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px", border: paymentMethod === "dahabia" ? "2px solid #e11d48" : "1px solid #e2e8f0", borderRadius: "10px", cursor: "pointer", backgroundColor: paymentMethod === "dahabia" ? "#fff1f2" : "white" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input type="radio" name="payment" checked={paymentMethod === "dahabia"} onChange={() => setPaymentMethod("dahabia")} />
                <span style={{ fontWeight: "bold", fontSize: "14px" }}>Edahabia / CIB</span>
              </div>
              <span style={{ fontSize: "20px" }}>💳</span>
            </label>

            <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px", border: paymentMethod === "visa" ? "2px solid #e11d48" : "1px solid #e2e8f0", borderRadius: "10px", cursor: "pointer", backgroundColor: paymentMethod === "visa" ? "#fff1f2" : "white" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input type="radio" name="payment" checked={paymentMethod === "visa"} onChange={() => setPaymentMethod("visa")} />
                <span style={{ fontWeight: "bold", fontSize: "14px" }}>Visa / MasterCard</span>
              </div>
              <span style={{ fontSize: "20px" }}>🌐</span>
            </label>
          </div>

          <button
            onClick={handleProceedToCheckout}
            style={{ width: "100%", padding: "16px", backgroundColor: "#1e293b", color: "white", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", transition: "0.3s" }}
          >
            المتابعة لإدخال بيانات البطاقة
          </button>
        </div>

      </div>
    </div>
  );
}