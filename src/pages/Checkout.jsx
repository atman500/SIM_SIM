import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import emailjs from '@emailjs/browser';

export default function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // استلام البيانات من صفحة التفاصيل
  const country = state?.selectedCountry;
  const customer = state?.customer;

  // الحماية: إذا تم الدخول للصفحة مباشرة بدون بيانات يتم إرجاع الزبون للمتجر
  if (!country || !customer) {
    return <div style={{ textAlign: "center", padding: "50px", direction: "rtl", fontFamily: "Arial" }}>جاري العودة للمتجر... {window.location.href = "/"}</div>;
  }

  const handleFinalPayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. توليد رمز OTP عشوائي من 6 أرقام
    const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();

    try {
      // 2. إرسال الإيميل للزبون عبر EmailJS
      console.log("بيانات الزبون الحالية:", customer);

      const templateParams = {
        to_email: customer.email,
        name: customer.name,
        email: customer.email,
        title: "رمز التحقق من متجر SoufSim",
        message: "تم طلب رمز تحقق لإتمام عملية الدفع الخاصة بك",
        otp: generatedOTP
      };

      await emailjs.send(
        'service_2ltqsh8',
        'template_cjak4yq',
        templateParams,
        'RUX4eLBq--cXiEtqh'
      );

      // 3. إرسال البيانات إلى السوبابيس (Supabase) لتظهر في لوحة المدير
      const { error } = await supabase.from('bookings').insert([{
        user_name: customer.name + " (" + customer.email + ")",
        destination_name: country.name,
        price: country.price || country.Price,
        status: 'قيد الانتظار'
      }]);

      if (error) throw error;

      // 4. إظهار رسالة النجاح وتنبيه الزبون بفحص بريده
      alert(`✅ تمت العملية بنجاح!\nتم إرسال رمز التحقق (${generatedOTP}) إلى بريدك الإلكتروني لتوثيق العملية.`);
      navigate("/");

    } catch (err) {
      // طباعة الخطأ كاملاً في الكونسول لتسهيل حله إن حدث
      console.error("الخطأ الحقيقي من الخادم هو:", err);
      alert("حدث خطأ أثناء الاتصال بالخادم، يرجى فحص الـ Console (F12) لمعرفة التفاصيل.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#f0f2f5", minHeight: "100vh", padding: "40px 20px", direction: "rtl", fontFamily: "Arial, sans-serif" }}>
      <div style={{ maxWidth: "450px", margin: "0 auto", background: "white", borderRadius: "15px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", overflow: "hidden" }}>

        {/* رأس البطاقة الذهبية */}
        <div style={{ background: "#ffcc00", padding: "15px", textAlign: "center", fontWeight: "bold", fontSize: "18px", color: "#333" }}>
          بوابة الدفع - البطاقة الذهبية / CIB
        </div>

        <form onSubmit={handleFinalPayment} style={{ padding: "30px" }}>

          <div style={{ marginBottom: "25px", textAlign: "center", backgroundColor: "#f8fafc", padding: "15px", borderRadius: "10px" }}>
            <div style={{ fontSize: "14px", color: "#64748b", marginBottom: "5px" }}>المبلغ المطلوب للدفع</div>
            <strong style={{ color: "#e11d48", fontSize: "22px" }}>{country.price || country.Price} د.ج</strong>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", fontSize: "13px", color: "#475569", marginBottom: "8px", fontWeight: "bold" }}>رقم البطاقة (16 رقم)</label>
            <input required type="text" placeholder="6280 0000 0000 0000" style={{ width: "100%", padding: "14px", borderRadius: "8px", border: "1px solid #cbd5e1", boxSizing: "border-box", fontSize: "16px", letterSpacing: "2px", textAlign: "center", direction: "ltr" }} />
          </div>

          <div style={{ display: "flex", gap: "15px", marginBottom: "25px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", fontSize: "13px", color: "#475569", marginBottom: "8px", fontWeight: "bold" }}>تاريخ الانتهاء (MM/YY)</label>
              <input required type="text" placeholder="MM/YY" style={{ width: "100%", padding: "14px", borderRadius: "8px", border: "1px solid #cbd5e1", boxSizing: "border-box", textAlign: "center", direction: "ltr" }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", fontSize: "13px", color: "#475569", marginBottom: "8px", fontWeight: "bold" }}>CVV2</label>
              <input required type="text" placeholder="123" style={{ width: "100%", padding: "14px", borderRadius: "8px", border: "1px solid #cbd5e1", boxSizing: "border-box", textAlign: "center", direction: "ltr" }} />
            </div>
          </div>

          <button disabled={loading} style={{ width: "100%", padding: "16px", background: "#004a99", color: "white", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer", fontSize: "16px", transition: "0.3s" }}>
            {loading ? "جاري تشفير البيانات..." : "تأكيد وإتمام الدفع"}
          </button>
        </form>

        <div style={{ textAlign: "center", paddingBottom: "20px" }}>
          {/* صورة لوغو البطاقة الذهبية و CIB */}
          <img src="https://e-paiement.poste.dz/assets/img/logo-cib-edahabia.png" alt="CIB Edahabia" style={{ height: "40px", opacity: 0.9 }} />
        </div>
      </div>
    </div>
  );
}