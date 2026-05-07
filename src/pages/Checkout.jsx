import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import emailjs from '@emailjs/browser';

export default function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [userEnteredOtp, setUserEnteredOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");

  // حالات البيانات المطلوبة للتحليل (K-means)
  const [extraData, setExtraData] = useState({ age: "", gender: "", preference: "" });
  const country = state?.selectedCountry;
  const customer = state?.customer;

  if (!country || !customer) return <div style={{ textAlign: "center", padding: "50px" }}>جاري العودة للمتجر...</div>;

  const handleRequestOtp = async (e) => {
    e.preventDefault();

    // التحقق المنطقي قبل الإرسال
    if (!extraData.age || !extraData.gender) {
      alert("⚠️ يرجى تحديد العمر والجنس للمتابعة.");
      return;
    }

    setLoading(true);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);

    try {
      await emailjs.send('service_2ltqsh8', 'template_cjak4yq', {
        to_email: customer.email, name: customer.name, otp: otp
      }, 'RUX4eLBq--cXiEtqh');
      setShowOtpInput(true);
    } catch (err) { alert("خطأ في الإرسال"); } finally { setLoading(false); }
  };

  const handleVerifyAndConfirm = async () => {
    if (userEnteredOtp !== generatedOtp) return alert("❌ الرمز غير صحيح");
    setLoading(true);
    try {
      const { error } = await supabase.from('bookings').insert([{
        user_name: customer.name,
        destination_name: country.name,
        price: country.price || country.Price,
        age: parseInt(extraData.age),
        gender: extraData.gender,
        preferred_dest: extraData.preference,
        status: 'قيد الانتظار'
      }]);
      if (error) throw error;
      alert("✅ تم الحجز بنجاح!"); navigate("/");
    } catch (err) { alert(err.message); } finally { setLoading(false); }
  };

  // تنسيقات العناصر
  const labelStyle = { display: "block", fontSize: "13px", color: "#475569", marginBottom: "5px", fontWeight: "bold" };
  const inputStyle = { width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", boxSizing: "border-box", textAlign: "center" };

  return (
    <div style={{ backgroundColor: "#f0f2f5", minHeight: "100vh", padding: "40px 20px", direction: "rtl", fontFamily: "Arial" }}>
      <div style={{ maxWidth: "450px", margin: "0 auto", background: "white", borderRadius: "15px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>

        <div style={{ background: "#ffcc00", padding: "15px", textAlign: "center", fontWeight: "bold", borderRadius: "15px 15px 0 0" }}>
          بوابة الدفع - SoufSim {showOtpInput && "(تأكيد الرمز)"}
        </div>

        <div style={{ padding: "30px" }}>
          {!showOtpInput ? (
            <form onSubmit={handleRequestOtp}>

              <div style={{ marginBottom: "20px", textAlign: "center", backgroundColor: "#f8fafc", padding: "10px", borderRadius: "10px" }}>
                <div style={{ fontSize: "12px", color: "#64748b" }}>المبلغ الإجمالي</div>
                <strong style={{ color: "#e11d48", fontSize: "22px" }}>{country.price || country.Price} د.ج</strong>
              </div>

              {/* --- قسم حقول البيانات الجديدة المدمجة بصرياً --- */}
              <div style={{ background: "#eff6ff", padding: "15px", borderRadius: "10px", marginBottom: "20px", border: "1px solid #bfdbfe" }}>
                <p style={{ fontSize: "12px", fontWeight: "bold", color: "#1e40af", marginBottom: "10px" }}>معلومات لتحسين جودة الخدمة (اختياري):</p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
                  <div>
                    <label style={labelStyle}>العمر</label>
                    <input required type="number" style={inputStyle} value={extraData.age} onChange={(e) => setExtraData({ ...extraData, age: e.target.value })} placeholder="25" />
                  </div>
                  <div>
                    <label style={labelStyle}>الجنس</label>
                    <select required style={inputStyle} value={extraData.gender} onChange={(e) => setExtraData({ ...extraData, gender: e.target.value })}>
                      <option value="">اختر...</option>
                      <option value="ذكر">ذكر</option>
                      <option value="أنثى">أنثى</option>
                    </select>
                  </div>
                </div>

                <label style={labelStyle}>الوجهة المفضلة</label>
                <select style={inputStyle} value={extraData.preference} onChange={(e) => setExtraData({ ...extraData, preference: e.target.value })}>
                  <option value="">اختر وجهة...</option>
                  <option value="تونس">تونس</option>
                  <option value="إسبانيا">إسبانيا</option>
                  <option value="تركيا">تركيا</option>
                  <option value="السعودية">السعودية</option>
                  <option value="فرنسا">فرنسا</option>
                  <option value="ألمانيا">ألمانيا</option>
                  <option value="المغرب">المغرب</option>
                  <option value="الإمارات">الإمارات</option>
                  <option value="قطر">قطر</option>
                  <option value="الكويت">الكويت</option>
                  <option value="البحرين">البحرين</option>
                  <option value="عمان">عمان</option>
                  <option value="لبنان">لبنان</option>
                  <option value="الأردن">الأردن</option>
                  <option value="مصر">مصر</option>
                </select>
              </div>

              {/* حقول البطاقة التقليدية */}
              <div style={{ marginBottom: "20px" }}>
                <label style={labelStyle}>رقم البطاقة الذهبية</label>
                <input required type="text" placeholder="6280 0000 0000 0000" style={{ ...inputStyle, direction: "ltr" }} />
              </div>

              <button disabled={loading} style={{ width: "100%", padding: "16px", background: "#004a99", color: "white", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}>
                {loading ? "جاري المعالجة..." : "إرسال رمز التحقق"}
              </button>
            </form>
          ) : (
            <div style={{ textAlign: "center" }}>
              <p>أدخل الرمز المرسل للإيميل:</p>
              <input type="text" value={userEnteredOtp} onChange={(e) => setUserEnteredOtp(e.target.value)} style={{ ...inputStyle, fontSize: "24px", letterSpacing: "5px", border: "2px solid #004a99" }} />
              <button onClick={handleVerifyAndConfirm} style={{ width: "100%", padding: "16px", background: "#22c55e", color: "white", border: "none", borderRadius: "10px", marginTop: "15px", fontWeight: "bold" }}>
                تأكيد الدفع النهائي
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
