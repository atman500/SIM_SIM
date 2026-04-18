import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        // إيميل المدير المتفق عليه
        const adminEmail = "admin@soufsim.com";

        if (email.toLowerCase() === adminEmail.toLowerCase()) {
            // إذا كان الداخل هو المدير، نوجهه مباشرة للوحة التحكم
            alert("مرحباً بك أيها المدير!");
            navigate("/admin");
        } else {
            // إذا كان زبوناً عادياً، نوجهه للرئيسية كما كان يحدث سابقاً
            navigate("/");
        }
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f8fafc", padding: "20px", direction: "rtl", fontFamily: "Arial" }}>
            <div style={{ width: "100%", maxWidth: "400px", backgroundColor: "white", padding: "40px", borderRadius: "20px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}>
                <div style={{ textAlign: "center", marginBottom: "30px" }}>
                    <div style={{ width: "50px", height: "50px", backgroundColor: "#e11d48", borderRadius: "12px", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "24px", fontWeight: "bold", marginBottom: "15px" }}>S</div>
                    <h2 style={{ fontSize: "22px", fontWeight: "bold", color: "#1e293b" }}>تسجيل الدخول</h2>
                    <p style={{ color: "#64748b", fontSize: "14px", marginTop: "5px" }}>أدخل بريدك الإلكتروني للمتابعة</p>
                </div>

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "#64748b" }}>البريد الإلكتروني</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@mail.com"
                            style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", outlineColor: "#e11d48", textAlign: "left", direction: "ltr" }}
                        />
                    </div>
                    <button type="submit" style={{ width: "100%", padding: "14px", backgroundColor: "#1e293b", color: "white", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "bold", cursor: "pointer" }}>
                        دخول
                    </button>
                </form>
            </div>
        </div>
    );
}