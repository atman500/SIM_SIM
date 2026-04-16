import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ setIsLoggedIn, setUserRole }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        let role = "";
        if (email === "admin@gosim.dz" && password === "123456") {
            role = "super_admin";
        } else if (email === "shop@gosim.dz" && password === "123456") {
            role = "pos";
        }

        if (role) {
            // حفظ في الذاكرة الدائمة
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userRole", role);

            // تحديث حالة التطبيق
            setIsLoggedIn(true);
            setUserRole(role);
            navigate("/");
        } else {
            setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        }
    };

    return (
        <div style={{ padding: "40px 20px", textAlign: "center" }}>
            <h2>تسجيل الدخول</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <input type="email" placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ccc" }} />
                <input type="password" placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ccc" }} />
                <button type="submit" style={{ padding: "15px", backgroundColor: "#e11d48", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold" }}>دخول</button>
            </form>
        </div>
    );
}