import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (isSignUp) {
            // 1. منطق إنشاء حساب جديد عبر Supabase
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) {
                alert("خطأ في التسجيل: " + error.message);
            } else {
                alert("تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.");
                setIsSignUp(false); // العودة تلقائياً لوضع تسجيل الدخول
            }
        } else {
            // 2. منطق تسجيل الدخول الفعلي
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                alert("بيانات الدخول غير صحيحة، يرجى التأكد من البريد وكلمة المرور.");
            } else {
                // 3. منطق التوجيه الذكي (أدمن أو زبون)
                const adminEmail = "admin@soufsim.com";
                if (email.toLowerCase() === adminEmail.toLowerCase()) {
                    alert("مرحباً بك أيها المدير!");
                    navigate("/admin");
                } else {
                    navigate("/");
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

                    <button type="submit" disabled={loading} style={{ width: "100%", padding: "14px", backgroundColor: "#1e293b", color: "white", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer", marginBottom: "15px", opacity: loading ? 0.7 : 1 }}>
                        {loading ? "جاري المعالجة..." : (isSignUp ? "إنشاء الحساب" : "دخول")}
                    </button>

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