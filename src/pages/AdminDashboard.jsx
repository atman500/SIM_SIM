import React from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
    const navigate = useNavigate();

    // بيانات تجريبية للمدير (في المستقبل ستأتي من قاعدة البيانات)
    const stats = [
        { label: "إجمالي المبيعات", value: "450,000 د.ج", icon: "💰", color: "#10b981" },
        { label: "طلبات اليوم", value: "12 عملية", icon: "📈", color: "#3b82f6" },
        { label: "نشاط الوكلاء", value: "8 نقاط بيع", icon: "🤝", color: "#f59e0b" },
        { label: "الشرائح المتاحة", value: "170 دولة", icon: "🌍", color: "#e11d48" },
    ];

    return (
        <div style={{ backgroundColor: "#f1f5f9", minHeight: "100vh", direction: "rtl", fontFamily: "Arial, sans-serif" }}>
            {/* شريط علوي للمدير */}
            <div style={{ backgroundColor: "#1e293b", color: "white", padding: "15px 30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ backgroundColor: "#e11d48", padding: "5px 10px", borderRadius: "5px", fontWeight: "bold" }}>Admin</div>
                    <h2 style={{ fontSize: "18px", margin: 0 }}>لوحة تحكم SoufSim</h2>
                </div>
                <button onClick={() => navigate("/")} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "white", padding: "8px 15px", borderRadius: "5px", cursor: "pointer" }}>
                    خروج للموقع العام
                </button>
            </div>

            <div style={{ padding: "30px" }}>
                {/* بطاقات الإحصائيات */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "30px" }}>
                    {stats.map((stat, index) => (
                        <div key={index} style={{ backgroundColor: "white", padding: "20px", borderRadius: "15px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", borderRight: `5px solid ${stat.color}` }}>
                            <div style={{ fontSize: "24px", marginBottom: "10px" }}>{stat.icon}</div>
                            <div style={{ color: "#64748b", fontSize: "14px" }}>{stat.label}</div>
                            <div style={{ fontSize: "20px", fontWeight: "bold", color: "#1e293b", marginTop: "5px" }}>{stat.value}</div>
                        </div>
                    ))}
                </div>

                {/* جدول آخر العمليات */}
                <div style={{ backgroundColor: "white", borderRadius: "15px", padding: "20px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
                    <h3 style={{ marginBottom: "20px", color: "#1e293b" }}>آخر عمليات الشراء</h3>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "right" }}>
                        <thead>
                            <tr style={{ borderBottom: "2px solid #f1f5f9", color: "#64748b" }}>
                                <th style={{ padding: "12px" }}>الزبون</th>
                                <th style={{ padding: "12px" }}>الدولة</th>
                                <th style={{ padding: "12px" }}>المبلغ</th>
                                <th style={{ padding: "12px" }}>الحالة</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 2, 3].map((item) => (
                                <tr key={item} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                    <td style={{ padding: "12px" }}>مستخدم تجريبي {item}</td>
                                    <td style={{ padding: "12px" }}>تركيا 🇹🇷</td>
                                    <td style={{ padding: "12px" }}>2400 د.ج</td>
                                    <td style={{ padding: "12px" }}><span style={{ backgroundColor: "#dcfce7", color: "#166534", padding: "4px 8px", borderRadius: "5px", fontSize: "12px" }}>مكتملة</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}