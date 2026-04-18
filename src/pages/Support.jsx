// src/pages/Support.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Support() {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState(0);
    const [activeQuestion, setActiveQuestion] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const supportCategories = [
        {
            id: 0,
            title: "حول SoufSim",
            icon: "ℹ️",
            questions: [
                { q: "ما هو SoufSim؟", a: "SoufSim هو شريحة eSIM بيانات افتراضية مدفوعة مسبقاً تسمح لك بالاتصال بالإنترنت في أكثر من 170 دولة، بدون شريحة SIM فعلية." },
                { q: "هل يمكنني إجراء المكالمات أو استقبال الرسائل النصية؟", a: "باقاتنا مخصصة للبيانات (الإنترنت) فقط. يمكنك استخدام تطبيقات المراسلة مثل WhatsApp للاتصال." },
                { q: "هل يعمل SoufSim مثل WiFi؟", a: "لا، SoufSim يستخدم شبكات الاتصال الخلوية المحلية في البلد الذي تزوره لتوفير الإنترنت، تماماً مثل الشريحة العادية." },
                { q: "ما الفرق بين SoufSim وشريحة SIM التقليدية؟", a: "SoufSim رقمية بالكامل، لا تحتاج لتبديل شرائح بلاستيكية، ويمكن تفعيلها فوراً عبر مسح رمز QR." }
            ]
        },
        { id: 1, title: "الدفع والشحن", icon: "💳", questions: [{ q: "كيف أدفع؟", a: "عبر البطاقة الذهبية أو CIB أو PayPal." }] },
        { id: 2, title: "التفعيل والاستخدام", icon: "⚡", questions: [{ q: "كيف أفعل الشريحة؟", a: "امسح رمز QR المرسل لبريدك الإلكتروني." }] },
        { id: 3, title: "توافق الأجهزة", icon: "📱", questions: [{ q: "هل هاتفي متوافق؟", a: "معظم الهواتف الحديثة تدعم eSIM مثل آيفون وسامسونج فئة S." }] },
        { id: 4, title: "الخصوصية والأمان", icon: "🔒", questions: [{ q: "هل بياناتي آمنة؟", a: "نعم، نستخدم أعلى معايير التشفير." }] }
    ];

    const toggleCategory = (index) => {
        setActiveCategory(activeCategory === index ? null : index);
        setActiveQuestion(null);
    };

    return (
        <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh", direction: "rtl", fontFamily: "Arial, sans-serif", paddingBottom: "60px" }}>

            {/* هيدر الصفحة الثانوية */}
            <div style={{ padding: "15px 5%", backgroundColor: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e5e7eb" }}>
                <div onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                    <div style={{ width: "35px", height: "35px", backgroundColor: "#e11d48", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "900", fontSize: "18px" }}>S</div>
                    <span style={{ fontWeight: "900", color: "#e11d48", fontSize: "18px" }}>SOUFSIM</span>
                </div>
                <button onClick={() => navigate("/")} style={{ backgroundColor: "transparent", color: "#64748b", border: "none", fontSize: "14px", cursor: "pointer", fontWeight: "bold" }}>العودة للرئيسية</button>
            </div>

            {/* محتوى الدعم */}
            <div style={{ textAlign: "center", padding: "50px 20px 30px" }}>
                <h1 style={{ fontSize: "28px", fontWeight: "900", color: "#0f172a", marginBottom: "10px" }}>مركز مساعدة SoufSim</h1>
                <p style={{ fontSize: "15px", color: "#64748b", marginBottom: "30px" }}>اعثر بسرعة على إجابات لأسئلتك حول استخدام شريحة eSIM</p>

                <div style={{ maxWidth: "600px", margin: "0 auto", position: "relative" }}>
                    <input type="text" placeholder="لدي سؤال؟ ابحث هنا للتفاصيل..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: "100%", padding: "18px 20px 18px 50px", borderRadius: "30px", border: "1px solid #e2e8f0", outline: "none", fontSize: "15px", textAlign: "right" }} />
                    <span style={{ position: "absolute", left: "20px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}>🔍</span>
                </div>
            </div>

            {/* القائمة المنسدلة للأسئلة */}
            <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 20px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "15px", backgroundColor: "#fff", padding: "30px", borderRadius: "15px", border: "1px solid #e2e8f0" }}>
                    {supportCategories.map((category, index) => (
                        <div key={index} style={{ border: "1px solid #f1f5f9", borderRadius: "8px", overflow: "hidden" }}>
                            <div onClick={() => toggleCategory(index)} style={{ padding: "20px", backgroundColor: activeCategory === index ? "#f8fafc" : "#fff", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontWeight: "bold", fontSize: "16px", color: "#1e293b" }}>
                                    <span>{category.icon}</span> {category.title} <span style={{ color: "#94a3b8", fontSize: "12px" }}>({category.questions.length})</span>
                                </div>
                                <span style={{ color: "#64748b", transform: activeCategory === index ? "rotate(180deg)" : "rotate(0deg)", transition: "0.3s" }}>⌄</span>
                            </div>
                            {activeCategory === index && (
                                <div style={{ padding: "10px 20px 20px", backgroundColor: "#fff", borderTop: "1px solid #f1f5f9" }}>
                                    {category.questions.map((item, qIndex) => (
                                        <div key={qIndex} style={{ borderBottom: "1px solid #f8fafc" }}>
                                            <div onClick={() => setActiveQuestion(activeQuestion === qIndex ? null : qIndex)} style={{ padding: "15px 0", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "14px", color: activeQuestion === qIndex ? "#e11d48" : "#334155", fontWeight: activeQuestion === qIndex ? "bold" : "normal" }}>
                                                {item.q}
                                                <span style={{ color: "#cbd5e1" }}>{activeQuestion === qIndex ? "−" : "+"}</span>
                                            </div>
                                            {activeQuestion === qIndex && (<div style={{ padding: "0 0 15px 0", fontSize: "13px", color: "#64748b", lineHeight: "1.8" }}>{item.a}</div>)}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* الصندوق الأحمر السفلي */}
                <div style={{ backgroundColor: "#e11d48", borderRadius: "15px", padding: "40px", marginTop: "40px", textAlign: "center", color: "white" }}>
                    <h2 style={{ fontSize: "22px", fontWeight: "900", margin: "0 0 10px 0" }}>لم تجد إجابة لسؤالك؟</h2>
                    <p style={{ fontSize: "14px", margin: "0 0 30px 0", opacity: 0.9 }}>فريقنا متاح على مدار الساعة طوال أيام الأسبوع لمساعدتك.</p>
                    <div style={{ display: "flex", gap: "15px", justifyContent: "center", flexWrap: "wrap" }}>
                        <button style={{ padding: "15px 30px", backgroundColor: "#be123c", color: "white", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}>تحدث على WhatsApp 💬</button>
                        <button style={{ padding: "15px 30px", backgroundColor: "#be123c", color: "white", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}>إرسال رسالة ✉️</button>
                    </div>
                </div>
            </div>
        </div>
    );
}