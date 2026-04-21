import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(""); // 👈 إضافة حالة كلمة المرور
    const [loading, setLoading] = useState(false); // 👈 إضافة حالة التحميل
    const [isSignUp, setIsSignUp] = useState(false); // 👈 للتبديل بين تسجيل الدخول وإنشاء حساب
    const navigate = useNavigate();

    // دالة التعامل مع إرسال النموذج (دخول أو تسجيل جديد)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (isSignUp) {
            // 1. منطق إنشاء حساب جديد
            const { error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) {
                alert("خطأ في التسجيل: " + error.message);
            } else {
                alert("تم إنشاء الحساب بنجاح! جرب تسجيل الدخول الآن.");
                setIsSignUp(false); // تحويل الواجهة لوضع تسجيل الدخول
            }
        } else {
            // 2. منطق تسجيل الدخول الفعلي عبر Supabase
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                alert("بيانات الدخول غير صحيحة، يرجى التأكد من البريد وكلمة المرور.");
            } else {
                // 3. التوجيه بعد نجاح الدخول (نفس منطقك الممتاز)
                const adminEmail = "admin@soufsim.com";
                if (email.toLowerCase() === adminEmail.toLowerCase()) {
                    alert("مرحباً بك أيها المدير!");
                    navigate("/admin");
                } else {
                    navigate("/"); // توجيه الزبون العادي للرئيسية
                }
            }
        }
        setLoading(false);
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f8fafc", padding: "20px", direction: "rtl", fontFamily: "Arial" }}>
            <div style={{ width: "100%", maxWidth: "400px", backgroundColor: "white", padding: "40px", borderRadius: "20px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}>
                <div style={{ textAlign: "center", marginBottom: "30px" }}>
                    <div style={{ width: "50px", height: "50px", backgroundColor: "#e11d48", borderRadius: "12px", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "24px", fontWeight: "bold", marginBottom: "15px" }}>S</div>
                    <h2 style={{ fontSize: "22px", fontWeight: "bold", color: "#1e293b" }}>
                        {isSignUp ? "إنشاء حساب جديد" : "تسجيل الدخول"}
                    </h2>
                    <p style={{ color: "#64748b", fontSize: "14px", marginTop: "5px" }}>
                        {isSignUp ? "أدخل بياناتك لإنشاء حسابك في SoufSim" : "أدخل بريدك الإلكتروني للمتابعة"}
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* حقل البريد الإلكتروني */}
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "#64748b" }}>البريد الإلكتروني</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@mail.com"
                            style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", outlineColor: "#e11d48", textAlign: "left", direction: "ltr", boxSizing: "border-box" }}
                        />
                    </div>

                    {/* حقل كلمة المرور (جديد) */}
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "#64748b" }}>كلمة المرور</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="******"
                            style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", outlineColor: "#e11d48", textAlign: "left", direction: "ltr", boxSizing: "border-box" }}
                        />
                    </div>

                    {/* زر الإرسال الرئيسي */}
                    <button type="submit" disabled={loading} style={{ width: "100%", padding: "14px", backgroundColor: "#1e293b", color: "white", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", marginBottom: "15px", opacity: loading ? 0.7 : 1 }}>
                        {loading ? "جاري التحميل..." : (isSignUp ? "إنشاء الحساب" : "دخول")}
                    </button>

                    {/* زر التبديل بين الدخول والتسجيل */}
                    <div style={{ textAlign: "center", marginTop: "10px" }}>
                        <button
                            type="button"
                            onClick={() => setIsSignUp(!isSignUp)}
                            style={{ background: "none", border: "none", color: "#e11d48", cursor: "pointer", fontSize: "14px", textDecoration: "underline" }}
                        >
                            {isSignUp ? "لديك حساب بالفعل؟ سجل دخولك" : "ليس لديك حساب؟ أنشئ حساباً جديداً"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
