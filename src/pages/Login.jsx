import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ملاحظة: تأكد أن App.jsx يمرر الدالة setIsLoggedIn إذا كنت تستخدمها في سياق التطبيق
export default function Login({ setIsLoggedIn }) {
    const [isLoginMode, setIsLoginMode] = useState(true); // التبديل بين الدخول وإنشاء حساب
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const navigate = useNavigate();

    // وظيفة إرسال الكود (المحاكاة)
    const handleSendCode = (e) => {
        e.preventDefault();
        // التحقق من صحة الإيميل (والاسم إذا كان في وضع إنشاء حساب)
        if (email.includes("@") && (isLoginMode || (!isLoginMode && fullName.length > 2))) {
            setIsCodeSent(true);
        } else {
            alert("يرجى ملء البيانات بشكل صحيح");
        }
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
            // إذا كانت الدالة ممررة من App.jsx، قم بتفعيلها، وإلا تجاهلها
            if (typeof setIsLoggedIn === 'function') {
                setIsLoggedIn(true);
            }
            alert(`مرحباً بك${!isLoginMode ? ` يا ${fullName}` : ''}، تم التحقق بنجاح!`);
            navigate("/"); // العودة للرئيسية بعد تسجيل الدخول
        } else {
            alert("الكود غير صحيح. جرب 123456");
        }
    };

    return (
        <div style={{ backgroundColor: "#f8fafc", padding: "60px 20px", textAlign: "center", minHeight: "100vh", direction: "rtl", display: "flex", flexDirection: "column", justifyContent: "center" }}>

            <div style={{ backgroundColor: "white", padding: "40px", borderRadius: "20px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", maxWidth: "450px", margin: "0 auto", width: "100%" }}>

                {/* الشعار والعودة للرئيسية */}
                <div onClick={() => navigate("/")} style={{ width: "50px", height: "50px", backgroundColor: "#e11d48", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "900", fontSize: "24px", margin: "0 auto 15px", cursor: "pointer", boxShadow: "0 4px 10px rgba(225, 29, 72, 0.3)" }}>S</div>
                <h2 style={{ fontSize: "22px", fontWeight: "900", color: "#1e293b", margin: "0 0 5px 0" }}>SoufSim</h2>

                <h3 style={{ fontWeight: "bold", marginBottom: "10px", marginTop: "20px" }}>
                    {!isCodeSent ? (isLoginMode ? "سجل الدخول للمتابعة" : "أنشئ حسابك الجديد") : "أدخل رمز التحقق"}
                </h3>

                <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "30px", lineHeight: "1.6" }}>
                    {!isCodeSent
                        ? (isLoginMode ? "أدخل بريدك الإلكتروني لاستلام رمز الدخول الآمن" : "أدخل بياناتك لاستلام رمز التفعيل على بريدك")
                        : `أرسلنا رمز التحقق المكون من 6 أرقام إلى ${email}`}
                </p>

                {!isCodeSent ? (
                    <form onSubmit={handleSendCode} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>

                        {/* حقل الاسم يظهر فقط في حالة "إنشاء حساب" */}
                        {!isLoginMode && (
                            <input
                                type="text"
                                placeholder="الاسم الكامل"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                style={{ width: "100%", padding: "15px", borderRadius: "12px", border: "1px solid #ddd", textAlign: "right", outlineColor: "#e11d48" }}
                                required={!isLoginMode}
                            />
                        )}

                        <input
                            type="email"
                            placeholder="البريد الإلكتروني (مثال: ali@domain.dz)"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: "100%", padding: "15px", borderRadius: "12px", border: "1px solid #ddd", textAlign: "right", direction: "ltr", outlineColor: "#e11d48" }}
                            required
                        />

                        <button type="submit" style={{ width: "100%", padding: "15px", backgroundColor: "#e11d48", color: "white", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", transition: "0.3s" }}>
                            إرسال رمز التحقق
                        </button>

                        {/* التبديل بين الدخول وإنشاء حساب */}
                        <div style={{ marginTop: "15px", fontSize: "14px", color: "#64748b" }}>
                            {isLoginMode ? "مستخدم جديد؟ " : "لديك حساب بالفعل؟ "}
                            <span
                                onClick={() => setIsLoginMode(!isLoginMode)}
                                style={{ color: "#e11d48", fontWeight: "bold", cursor: "pointer" }}
                            >
                                {isLoginMode ? "أنشئ حساباً" : "سجل الدخول"}
                            </span>
                        </div>
                    </form>
                ) : (
                    <div>
                        {/* مربعات الكود المنفصلة (نظام OTP) */}
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
                                        outlineColor: "#e11d48",
                                        backgroundColor: "#f8fafc"
                                    }}
                                />
                            ))}
                        </div>

                        <button
                            onClick={handleVerify}
                            style={{ width: "100%", padding: "15px", backgroundColor: "#10b981", color: "white", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 10px rgba(16, 185, 129, 0.3)" }}
                        >
                            تحقق ومتابعة
                        </button>

                        <p onClick={() => setIsCodeSent(false)} style={{ marginTop: "20px", color: "#e11d48", cursor: "pointer", fontSize: "13px", fontWeight: "bold", textDecoration: "underline" }}>
                            إعادة إرسال الرمز؟
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}