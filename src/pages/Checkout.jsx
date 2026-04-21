import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import emailjs from '@emailjs/browser';

export default function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // حالات جديدة لإدارة عملية التحقق (State Management)
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [userEnteredOtp, setUserEnteredOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");

  const country = state?.selectedCountry;
  const customer = state?.customer;

  if (!country || !customer) {
    return <div style={{ textAlign: "center", padding: "50px", direction: "rtl", fontFamily: "Arial" }}>جاري العودة للمتجر... {window.location.href = "/"}</div>;
  }

  // الدالة الأولى: توليد الرمز وإرساله (المرحلة الأولى)
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp); // حفظ الرمز في حالة المكون للمقارنة لاحقاً

    try {
      const templateParams = {
        to_email: customer.email,
        name: customer.name,
        email: customer.email,
        title: "رمز التحقق من متجر SoufSim",
        message: "يرجى استخدام الرمز أدناه لتأكيد عملية الدفع الخاصة بك.",
        otp: otp,
      };

      await emailjs.send(
        'service_2ltqsh8',
        'template_cjak4yq',
        templateParams,
        'RUX4eLBq--cXiEtqh'
      );

      setShowOtpInput(true); // تغيير الواجهة لإظهار خانة الرمز
      alert("تم إرسال رمز التحقق إلى بريدك الإلكتروني بنجاح.");
    } catch (err) {
      console.error("خطأ في إرسال الرمز:", err);
      alert("فشل إرسال الرمز، يرجى التأكد من اتصال الإنترنت.");
    } finally {
      setLoading(false);
    }
  };

  // الدالة الثانية: مقارنة الرموز ثم الحفظ النهائي (المرحلة الثانية)
  const handleVerifyAndConfirm = async () => {
    if (userEnteredOtp !== generatedOtp) {
      alert("❌ الرمز الذي أدخلته غير صحيح. يرجى التأكد من الرسالة الواردة.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('bookings').insert([{
        user_name: customer.name + " (" + customer.email + ")",
        destination_name: country.name,
        price: country.price || country.Price,
        status: 'قيد الانتظار'
      }]);

      if (error) throw error;

      alert("✅ تم التحقق بنجاح! تم تسجيل طلبك في النظام.");
      navigate("/");
    } catch (err) {
      alert("حدث خطأ أثناء حفظ الطلب: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#f0f2f5", minHeight: "100vh", padding: "40px 20px", direction: "rtl", fontFamily: "Arial, sans-serif" }}>
      <div style={{ maxWidth: "450px", margin: "0 auto", background: "white", borderRadius: "15px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", overflow: "hidden" }}>

        <div style={{ background: "#ffcc00", padding: "15px", textAlign: "center", fontWeight: "bold", fontSize: "18px", color: "#333" }}>
          بوابة الدفع - {showOtpInput ? "تأكيد الرمز" : "البطاقة الذهبية / CIB"}
        </div>

        <div style={{ padding: "30px" }}>
          {!showOtpInput ? (
            /* نموذج معلومات البطاقة */
            <form onSubmit={handleRequestOtp}>
              <div style={{ marginBottom: "25px", textAlign: "center", backgroundColor: "#f8fafc", padding: "15px", borderRadius: "10px" }}>
                <div style={{ fontSize: "14px", color: "#64748b", marginBottom: "5px" }}>المبلغ المطلوب للدفع</div>
                <strong style={{ color: "#e11d48", fontSize: "22px" }}>{country.price || country.Price} د.ج</strong>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", fontSize: "13px", color: "#475569", marginBottom: "8px", fontWeight: "bold" }}>رقم البطاقة (16 رقم)</label>
                <input required type="text" placeholder="6280 0000 0000 0000" style={{ width: "100%", padding: "14px", borderRadius: "8px", border: "1px solid #cbd5e1", boxSizing: "border-box", textAlign: "center", direction: "ltr" }} />
              </div>

              <div style={{ display: "flex", gap: "15px", marginBottom: "25px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "13px", color: "#475569", marginBottom: "8px", fontWeight: "bold" }}>تاريخ الانتهاء</label>
                  <input required type="text" placeholder="MM/YY" style={{ width: "100%", padding: "14px", borderRadius: "8px", border: "1px solid #cbd5e1", boxSizing: "border-box", textAlign: "center" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "13px", color: "#475569", marginBottom: "8px", fontWeight: "bold" }}>CVV2</label>
                  <input required type="text" placeholder="123" style={{ width: "100%", padding: "14px", borderRadius: "8px", border: "1px solid #cbd5e1", boxSizing: "border-box", textAlign: "center" }} />
                </div>
              </div>

              <button disabled={loading} style={{ width: "100%", padding: "16px", background: "#004a99", color: "white", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer", fontSize: "16px" }}>
                {loading ? "جاري المعالجة..." : "إرسال رمز التحقق"}
              </button>
            </form>
          ) : (
            /* نموذج إدخال الرمز OTP */
            <div style={{ textAlign: "center" }}>
              <div style={{ marginBottom: "20px", color: "#475569", fontSize: "14px" }}>
                أدخل رمز التحقق المرسل إلى:<br />
                <strong>{customer.email}</strong>
              </div>

              <input
                required
                type="text"
                maxLength="6"
                value={userEnteredOtp}
                onChange={(e) => setUserEnteredOtp(e.target.value)}
                placeholder="000000"
                style={{ width: "100%", padding: "15px", borderRadius: "8px", border: "2px solid #004a99", boxSizing: "border-box", fontSize: "28px", textAlign: "center", letterSpacing: "8px", marginBottom: "20px" }}
              />

              <button
                onClick={handleVerifyAndConfirm}
                disabled={loading}
                style={{ width: "100%", padding: "16px", background: "#22c55e", color: "white", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer", fontSize: "16px" }}
              >
                {loading ? "جاري التحقق..." : "تأكيد العملية النهائية"}
              </button>

              <button
                onClick={() => setShowOtpInput(false)}
                style={{ background: "none", border: "none", color: "#64748b", marginTop: "15px", cursor: "pointer", textDecoration: "underline" }}
              >
                تعديل بيانات البطاقة
              </button>
            </div>
          )}
        </div>

        <div style={{ textAlign: "center", paddingBottom: "20px" }}>
          <img src="https://e-paiement.poste.dz/assets/img/logo-cib-edahabia.png" alt="CIB Edahabia" style={{ height: "40px", opacity: 0.9 }} />
        </div>
      </div>
    </div>
  );
}