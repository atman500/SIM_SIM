import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Details() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const country = state?.selectedCountry;

  // 1. حالات إدارة البيانات والفوترة
  const [billingInfo, setBillingInfo] = useState({
    name: "",
    email: "",
    residenceCountry: "Algeria",
    phone: ""
  });
  const [paymentMethod, setPaymentMethod] = useState("edahabia");

  // 2. حالات نظام التحقق (OTP)
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  // قائمة دول الإقامة المقترحة
  const worldCountries = ["Algeria", "Tunisia", "Morocco", "France", "Saudi Arabia", "Turkey", "USA", "Spain"];

  // في حال الوصول للصفحة بدون اختيار دولة
  if (!country) {
    return (
      <div style={{ textAlign: "center", padding: "100px 20px", direction: "rtl" }}>
        <h3>عذراً، لم يتم اختيار وجهة.</h3>
        <button onClick={() => navigate("/")} style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}>العودة للرئيسية</button>
      </div>
    );
  }

  // الحسابات المالية (خصم 5% تلقائياً)
  const subTotal = country.price || 350;
  const discount = Math.round(subTotal * 0.05);
  const total = subTotal - discount;

  // وظائف نظام التحقق
  const handleSendCode = () => {
    if (!billingInfo.email || !billingInfo.name) {
      alert("يرجى إدخال الاسم الكامل والبريد الإلكتروني أولاً.");
      return;
    }
    setIsCodeSent(true);
    console.log("تم إرسال الكود الافتراضي (123456) إلى:", billingInfo.email);
  };

  const handleVerifyCode = () => {
    if (enteredOtp === "123456") {
      setIsVerified(true);
    } else {
      alert("رمز التحقق غير صحيح، يرجى تجربة الكود التجريبي: 123456");
    }
  };

  const handleFinalPayment = () => {
    alert(`شكراً لك يا ${billingInfo.name}. تم تأكيد طلبك بنجاح! سيتم إرسال eSIM الخاص بـ ${country.name} إلى بريدك الإلكتروني.`);
    // هنا يتم الربط المستقبلي مع بوابة الدفع
  };

  return (
    <div style={{ backgroundColor: "#f3f4f6", minHeight: "100vh", direction: "rtl", fontFamily: "Arial, sans-serif", paddingBottom: "50px" }}>

      {/* الهيدر العلوي لشعار SoufSim */}
      <div style={{ padding: "15px 5%", backgroundColor: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e5e7eb", sticky: "top" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "35px", height: "35px", backgroundColor: "#e11d48", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "900", fontSize: "18px" }}>S</div>
          <span style={{ fontWeight: "900", color: "#e11d48", fontSize: "18px", letterSpacing: "1px" }}>SOUFSIM</span>
        </div>
        <button onClick={() => navigate("/")} style={{ backgroundColor: "transparent", color: "#666", border: "none", fontSize: "14px", cursor: "pointer" }}>العودة للرئيسية</button>
      </div>

      <div style={{ maxWidth: "800px", margin: "30px auto", padding: "0 15px" }}>

        {/* أولاً: معلومات الفوترة */}
        <div style={{ backgroundColor: "#fff", borderRadius: "15px", padding: "25px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "17px", fontWeight: "bold", marginBottom: "20px", borderRight: "4px solid #e11d48", paddingRight: "10px" }}>معلومات الفوترة</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", color: "#64748b", marginBottom: "8px" }}>البريد الإلكتروني (لتلقي رمز التفعيل)</label>
              <input
                type="email"
                placeholder="email@gmail.com"
                value={billingInfo.email}
                onChange={(e) => setBillingInfo({ ...billingInfo, email: e.target.value })}
                disabled={isVerified}
                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", backgroundColor: isVerified ? "#f8fafc" : "#fff" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", color: "#64748b", marginBottom: "8px" }}>الاسم الكامل</label>
              <input
                type="text"
                placeholder="اسمك بالكامل"
                value={billingInfo.name}
                onChange={(e) => setBillingInfo({ ...billingInfo, name: e.target.value })}
                disabled={isVerified}
                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", backgroundColor: isVerified ? "#f8fafc" : "#fff" }}
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#64748b", marginBottom: "8px" }}>بلد الإقامة</label>
                <select
                  value={billingInfo.residenceCountry}
                  onChange={(e) => setBillingInfo({ ...billingInfo, residenceCountry: e.target.value })}
                  disabled={isVerified}
                  style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                >
                  {worldCountries.map((c, i) => <option key={i} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#64748b", marginBottom: "8px" }}>رقم الهاتف</label>
                <input type="text" placeholder="06XXXXXXXX" style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }} />
              </div>
            </div>
          </div>
        </div>

        {/* ثانياً: ملخص الطلب المالي */}
        <div style={{ backgroundColor: "#fff", borderRadius: "15px", padding: "25px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "17px", fontWeight: "bold", marginBottom: "20px" }}>ملخص الطلب</h3>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 0", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <img src={`https://flagcdn.com/w40/${country.code || country.flag}.png`} width="35" style={{ borderRadius: "4px" }} alt="flag" />
              <span style={{ fontSize: "14px", fontWeight: "bold" }}>{country.name} x1 eSIM</span>
            </div>
            <span style={{ fontWeight: "900", fontSize: "14px" }}>{subTotal} د.ج</span>
          </div>
          <div style={{ marginTop: "15px", display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b" }}><span>المجموع الفرعي</span><span>{subTotal} د.ج</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#10b981", fontWeight: "bold" }}><span>Goubba Pay الخصم (-5%)</span><span>-{discount} د.ج</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "900", borderTop: "2px solid #f1f5f9", paddingTop: "15px", fontSize: "18px", marginTop: "10px" }}>
              <span>الإجمالي للدفع</span><span style={{ color: "#e11d48" }}>{total} د.ج</span>
            </div>
          </div>
        </div>

        {/* ثالثاً: طرق الدفع ونظام التحقق */}
        <div style={{ backgroundColor: "#fff", borderRadius: "15px", padding: "25px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "20px" }}>اختر طريقة الدفع</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "25px" }}>
            <label style={{ display: "flex", justifyContent: "space-between", padding: "15px", border: paymentMethod === "edahabia" ? "2px solid #e11d48" : "1px solid #f1f5f9", borderRadius: "12px", cursor: "pointer", backgroundColor: paymentMethod === "edahabia" ? "#fff1f2" : "#fff" }}>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <input type="radio" checked={paymentMethod === "edahabia"} onChange={() => setPaymentMethod("edahabia")} />
                <span style={{ fontWeight: "bold" }}>Edahabia / CIB</span>
              </div>
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" width="30" alt="visa" />
            </label>
            <label style={{ display: "flex", justifyContent: "space-between", padding: "15px", border: paymentMethod === "paypal" ? "2px solid #e11d48" : "1px solid #f1f5f9", borderRadius: "12px", cursor: "pointer", backgroundColor: paymentMethod === "paypal" ? "#fff1f2" : "#fff" }}>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <input type="radio" checked={paymentMethod === "paypal"} onChange={() => setPaymentMethod("paypal")} />
                <span style={{ fontWeight: "bold" }}>PayPal</span>
              </div>
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg.png" width="40" alt="paypal" />
            </label>
          </div>

          {/* منطق زر الدفع والتحقق */}
          <div style={{ borderTop: "2px dashed #e2e8f0", paddingTop: "25px" }}>
            {!isVerified ? (
              <div style={{ textAlign: "center" }}>
                {!isCodeSent ? (
                  <button
                    onClick={handleSendCode}
                    style={{ width: "100%", padding: "18px", backgroundColor: "#1e293b", color: "white", border: "none", borderRadius: "30px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}
                  >
                    تأكيد الإيميل للمتابعة
                  </button>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "15px", alignItems: "center" }}>
                    <p style={{ fontSize: "13px", color: "#10b981", margin: 0, fontWeight: "bold" }}>تم إرسال رمز التحقق إلى بريدك الإلكتروني</p>
                    <input
                      type="text"
                      placeholder="أدخل الرمز المكون من 6 أرقام"
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                      maxLength="6"
                      style={{ width: "100%", padding: "15px", borderRadius: "12px", border: "2px solid #e11d48", textAlign: "center", fontSize: "22px", letterSpacing: "5px", outline: "none" }}
                    />
                    <button
                      onClick={handleVerifyCode}
                      style={{ width: "100%", padding: "18px", backgroundColor: "#10b981", color: "white", border: "none", borderRadius: "30px", fontSize: "16px", fontWeight: "bold", cursor: "pointer" }}
                    >
                      تفعيل خاصية الدفع
                    </button>
                    <button onClick={() => setIsCodeSent(false)} style={{ background: "none", border: "none", color: "#64748b", fontSize: "12px", cursor: "pointer", textDecoration: "underline" }}>تغيير البريد الإلكتروني؟</button>
                  </div>
                )}
              </div>
            ) : (
              /* يظهر زر الدفع الأحمر النهائي فقط بعد النجاح في التحقق */
              <button
                onClick={handleFinalPayment}
                style={{ width: "100%", padding: "20px", backgroundColor: "#e11d48", color: "white", border: "none", borderRadius: "35px", fontSize: "18px", fontWeight: "900", cursor: "pointer", boxShadow: "0 10px 20px rgba(225, 29, 72, 0.3)", animation: "fadeIn 0.5s" }}
              >
                ادفع {total} د.ج الآن
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}