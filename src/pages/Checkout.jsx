import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const country = state?.selectedCountry;
  const customer = state?.customer;
  const paymentMethod = state?.method || "dahabia";

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardHolderName: customer?.name || ""
  });

  useEffect(() => {
    if (!country) {
      navigate("/");
    }
  }, [country, navigate]);

  if (!country) return null;

  const handlePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 3000);
  };

  if (isSuccess) {
    return (
      <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", direction: "rtl", fontFamily: "Arial, sans-serif", padding: "20px" }}>
        <div style={{ backgroundColor: "white", padding: "40px", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", maxWidth: "500px", width: "100%", textAlign: "center" }}>
          <div style={{ width: "80px", height: "80px", backgroundColor: "#10b981", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "40px", margin: "0 auto 20px", boxShadow: "0 4px 15px rgba(16,185,129,0.3)" }}>✓</div>
          <h2 style={{ fontSize: "24px", fontWeight: "900", color: "#1e293b", marginBottom: "10px" }}>تم الدفع بنجاح!</h2>
          <p style={{ color: "#64748b", fontSize: "15px", marginBottom: "30px", lineHeight: "1.6" }}>
            شكراً لك يا <strong>{customer?.name || 'زبوننا الكريم'}</strong>. تم تأكيد طلبك لشريحة eSIM الخاصة بـ <strong>{country.name}</strong>.
          </p>
          <div style={{ backgroundColor: "#f1f5f9", padding: "20px", borderRadius: "15px", marginBottom: "30px" }}>
            <p style={{ margin: "0 0 10px 0", fontWeight: "bold", color: "#1e293b" }}>رمز التفعيل (QR Code)</p>
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=SoufSim-Demo" alt="QR Code" style={{ borderRadius: "10px", border: "1px solid #cbd5e1" }} />
            <p style={{ margin: "10px 0 0 0", fontSize: "12px", color: "#64748b" }}>تم إرسال التفاصيل إلى: {customer?.email || 'بريدك الإلكتروني'}</p>
          </div>
          <button onClick={() => navigate("/")} style={{ width: "100%", padding: "15px", backgroundColor: "#e11d48", color: "white", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", transition: "0.3s" }}>العودة للرئيسية</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh", direction: "rtl", fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto 30px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
          <div style={{ width: "40px", height: "40px", backgroundColor: "#e11d48", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "900", fontSize: "20px" }}>S</div>
          <h1 style={{ fontSize: "20px", fontWeight: "900", margin: 0, color: "#1e293b" }}>دفع آمن</h1>
        </div>
        <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "#64748b", fontWeight: "bold", cursor: "pointer" }}>إلغاء والعودة</button>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap-reverse", gap: "20px", maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ flex: "1 1 400px", backgroundColor: "white", padding: "30px", borderRadius: "20px", boxShadow: "0 5px 15px rgba(0,0,0,0.05)" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "20px", color: "#1e293b" }}>{paymentMethod === "dahabia" ? "الدفع بالبطاقة الذهبية / CIB" : "الدفع ببطاقة Visa / MasterCard"}</h2>
          <form onSubmit={handlePayment} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "bold", color: "#475569" }}>اسم حامل البطاقة</label>
              <input type="text" required placeholder="الاسم الكامل" value={cardInfo.cardHolderName} onChange={(e) => setCardInfo({ ...cardInfo, cardHolderName: e.target.value })} style={{ width: "100%", padding: "15px", borderRadius: "10px", border: "1px solid #e2e8f0", outlineColor: "#e11d48", fontSize: "15px" }} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "bold", color: "#475569" }}>رقم البطاقة</label>
              <input type="text" required maxLength="19" placeholder="0000 0000 0000 0000" value={cardInfo.cardNumber} onChange={(e) => setCardInfo({ ...cardInfo, cardNumber: e.target.value })} style={{ width: "100%", padding: "15px", borderRadius: "10px", border: "1px solid #e2e8f0", outlineColor: "#e11d48", fontSize: "15px", direction: "ltr", textAlign: "left" }} />
            </div>
            <div style={{ display: "flex", gap: "15px" }}>
              <div style={{ flex: "1" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "bold", color: "#475569" }}>الانتهاء (MM/YY)</label>
                <input type="text" required placeholder="12/26" maxLength="5" value={cardInfo.expiryDate} onChange={(e) => setCardInfo({ ...cardInfo, expiryDate: e.target.value })} style={{ width: "100%", padding: "15px", borderRadius: "10px", border: "1px solid #e2e8f0", outlineColor: "#e11d48", fontSize: "15px", direction: "ltr", textAlign: "left" }} />
              </div>
              <div style={{ flex: "1" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "bold", color: "#475569" }}>رمز الأمان</label>
                <input type="password" required maxLength="4" placeholder="CVC" value={cardInfo.cvv} onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value })} style={{ width: "100%", padding: "15px", borderRadius: "10px", border: "1px solid #e2e8f0", outlineColor: "#e11d48", fontSize: "15px", direction: "ltr", textAlign: "left" }} />
              </div>
            </div>
            <button type="submit" disabled={isProcessing} style={{ width: "100%", padding: "16px", backgroundColor: isProcessing ? "#cbd5e1" : "#e11d48", color: "white", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "bold", cursor: isProcessing ? "not-allowed" : "pointer", marginTop: "10px" }}>
              {isProcessing ? "جاري معالجة الدفع..." : `ادفع الآن (${country.price} د.ج)`}
            </button>
          </form>
        </div>
        <div style={{ flex: "1 1 300px", backgroundColor: "white", padding: "30px", borderRadius: "20px", boxShadow: "0 5px 15px rgba(0,0,0,0.05)", height: "fit-content" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "20px", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px" }}>ملخص الطلب</h3>
          <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
            <img src={`https://flagcdn.com/w80/${country.flag}.png`} style={{ width: "50px", height: "35px", borderRadius: "5px", objectFit: "cover", border: "1px solid #f1f5f9" }} alt={country.name} />
            <div>
              <div style={{ fontWeight: "bold", color: "#1e293b" }}>eSIM {country.name}</div>
              <div style={{ fontSize: "12px", color: "#64748b" }}>باقة بيانات - 30 يوم</div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "15px", borderTop: "2px dashed #e2e8f0", marginTop: "10px" }}>
            <span style={{ fontWeight: "bold", fontSize: "18px" }}>الإجمالي:</span>
            <strong style={{ fontSize: "20px", color: "#e11d48" }}>{country.price} د.ج</strong>
          </div>
        </div>
      </div>
    </div>
  );
}