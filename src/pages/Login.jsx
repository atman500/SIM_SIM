import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ setIsLoggedIn }) {
    const [email, setEmail] = useState("");
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [otp, setOtp] = useState(new Array(6).fill("")); // مصفوفة لـ 6 أرقام
    const inputRefs = useRef([]); // مراجع للتحكم في التنقل بين المربعات
    const navigate = useNavigate();

    // وظيفة إرسال الكود (المحاكاة)
    const handleSendCode = (e) => {
        e.preventDefault();
        if (email.includes("@")) setIsCodeSent(true);
    };

    // وظيفة التعامل مع كتابة الأرقام والتنقل
    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // الانتقال للمربع التالي تلقائياً
        if (element.nextSibling && element.value !== "") {
            element.nextSibling.focus();
        }
    };

    const handleVerify = () => {
        const finalOtp = otp.join("");
        if (finalOtp === "123456") { // كود تجريبي
            setIsLoggedIn(true);
            navigate("/checkout");
        } else {
            alert("الكود غير صحيح");
        }
    };

    return (
        <div style={{ padding: "60px 20px", textAlign: "center", minHeight: "80vh", direction: "rtl" }}>
            <div style={{ maxWidth: "450px", margin: "0 auto" }}>
                <h2 style={{ fontWeight: "bold", marginBottom: "10px" }}>
                    {!isCodeSent ? "سجل الدخول للمتابعة" : "أدخل رمز التحقق"}
                </h2>
                <p style={{ color: "#666", fontSize: "14px", marginBottom: "30px" }}>
                    {!isCodeSent ? "أدخل بريدك الإلكتروني لاستلام رمز تفعيل الشراء" : `أرسلنا الرمز إلى ${email}`}
                </p>

                {!isCodeSent ? (
                    <form onSubmit={handleSendCode}>
                        <input
                            type="email"
                            placeholder="email@example.com"
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: "100%", padding: "15px", borderRadius: "12px", border: "1px solid #ddd", marginBottom: "20px", textAlign: "center" }}
                            required
                        />
                        <button type="submit" style={{ width: "100%", padding: "15px", backgroundColor: "#e11d48", color: "white", border: "none", borderRadius: "25px", fontWeight: "bold", cursor: "pointer" }}>
                            متابعة
                        </button>
                    </form>
                ) : (
                    <div>
                        {/* مربعات الكود المنفصلة */}
                        <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "30px", direction: "ltr" }}>
                            {otp.map((data, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength="1"
                                    value={data}
                                    onChange={(e) => handleChange(e.target, index)}
                                    onFocus={(e) => e.target.select()}
                                    style={{
                                        width: "45px",
                                        height: "55px",
                                        textAlign: "center",
                                        fontSize: "24px",
                                        fontWeight: "bold",
                                        borderRadius: "10px",
                                        border: "2px solid #ddd",
                                        outlineColor: "#e11d48"
                                    }}
                                />
                            ))}
                        </div>

                        <button
                            onClick={handleVerify}
                            style={{ width: "100%", padding: "15px", backgroundColor: "#e11d48", color: "white", border: "none", borderRadius: "25px", fontWeight: "bold", cursor: "pointer" }}
                        >
                            تحقق ومتابعة الشراء
                        </button>
                        <p onClick={() => setIsCodeSent(false)} style={{ marginTop: "20px", color: "#e11d48", cursor: "pointer", fontSize: "13px" }}>إعادة إرسال الرمز؟</p>
                    </div>
                )}
            </div>
        </div>
    );
}