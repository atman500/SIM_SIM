import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(sessionStorage.getItem("adminAuth") === "true");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("الكل");
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "admin123") {
      setIsAuthenticated(true);
      sessionStorage.setItem("adminAuth", "true");
      setLoginError("");
    } else {
      setLoginError("كلمة المرور غير صحيحة.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("adminAuth");
    setPassword("");
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('bookings').select('*');
      if (error) throw error;
      setBookings(data ? data.reverse() : []);
    } catch (err) {
      console.error("خطأ:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const { error } = await supabase.from('bookings').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      setBookings(prev => prev.map(item => (item.id === id ? { ...item, status: newStatus } : item)));
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      alert("فشل تحديث الحالة");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الطلب نهائياً؟")) {
      try {
        const { error } = await supabase.from('bookings').delete().eq('id', id);
        if (error) throw error;
        setBookings(prev => prev.filter(item => item.id !== id));
      } catch (err) {
        alert("فشل الحذف");
      }
    }
  };

  const exportToCSV = () => {
    const BOM = "\uFEFF";
    const headers = ["الزبون", "البريد", "الهاتف", "الوجهة", "المبلغ", "الحالة"];
    const csvRows = [headers.join(",")];
    filteredBookings.forEach(b => {
      csvRows.push([b.user_name || "", b.email || "", b.phone || "", b.destination_name || "", b.price || "0", b.status || "قيد الانتظار"].join(","));
    });
    const blob = new Blob([BOM + csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `طلبات_SoufSim.csv`;
    link.click();
  };

  useEffect(() => {
    if (isAuthenticated) fetchBookings();
  }, [isAuthenticated]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  if (!isAuthenticated) {
    return (
      <div style={{ backgroundColor: "#f1f5f9", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", direction: "rtl", fontFamily: "Arial" }}>
        <div style={{ backgroundColor: "white", padding: "40px", borderRadius: "15px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", width: "350px", textAlign: "center" }}>
          <div style={{ fontSize: "40px", marginBottom: "15px" }}>🔒</div>
          <h2 style={{ color: "#1e293b", marginBottom: "5px" }}>منطقة الإدارة</h2>
          <form onSubmit={handleLogin}>
            <input type="password" placeholder="كلمة المرور (admin123)" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "100%", padding: "12px", marginBottom: "15px", border: "1px solid #cbd5e1", borderRadius: "8px", boxSizing: "border-box", textAlign: "center" }} />
            {loginError && <div style={{ color: "#ef4444", fontSize: "13px", marginBottom: "15px" }}>{loginError}</div>}
            <button type="submit" style={{ width: "100%", background: "#3b82f6", color: "white", border: "none", padding: "12px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>دخول</button>
          </form>
        </div>
      </div>
    );
  }

  // الحسابات
  const totalSales = bookings.reduce((sum, b) => sum + (Number(b.price) || 0), 0);
  const totalOrders = bookings.length;
  const pendingOrders = bookings.filter(b => b.status === "قيد الانتظار" || !b.status).length;
  const completedOrders = bookings.filter(b => b.status === "مكتمل").length;

  const filteredBookings = bookings.filter(b => {
    const name = b.user_name ? b.user_name.toLowerCase() : "";
    return name.includes(searchTerm.toLowerCase()) && (filterStatus === "الكل" || b.status === filterStatus);
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const currentItems = filteredBookings.slice(indexOfLastItem - itemsPerPage, indexOfLastItem);
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  // حسابات الرسوم البيانية (بدون مكتبات خارجية)
  const destCounts = bookings.reduce((acc, b) => {
    const dest = b.destination_name || "غير محدد";
    acc[dest] = (acc[dest] || 0) + 1;
    return acc;
  }, {});
  const destinationData = Object.keys(destCounts).map(key => ({ name: key, count: destCounts[key] })).sort((a, b) => b.count - a.count).slice(0, 5); // عرض أعلى 5
  const maxCount = destinationData.length > 0 ? Math.max(...destinationData.map(d => d.count)) : 1;

  const statusCounts = bookings.reduce((acc, b) => {
    const status = b.status || "قيد الانتظار";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
  const statusColors = { "مكتمل": "#22c55e", "قيد الانتظار": "#eab308", "جارٍ الشحن": "#3b82f6", "ملغي": "#ef4444" };

  const getStatusStyle = (status) => {
    switch (status) {
      case "مكتمل": return { bg: "#dcfce7", color: "#166534" };
      case "ملغي": return { bg: "#fee2e2", color: "#991b1b" };
      case "جارٍ الشحن": return { bg: "#e0f2fe", color: "#075985" };
      default: return { bg: "#fef9c3", color: "#854d0e" };
    }
  };

  return (
    <div style={{ backgroundColor: "#f1f5f9", minHeight: "100vh", direction: "rtl", fontFamily: "Arial", position: "relative" }}>

      {selectedBooking && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(15, 23, 42, 0.7)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "15px", width: "500px", maxWidth: "90%" }}>
            <button onClick={() => setSelectedBooking(null)} style={{ float: "left", background: "#fee2e2", color: "#ef4444", border: "none", borderRadius: "50%", width: "30px", height: "30px", cursor: "pointer", fontWeight: "bold" }}>✕</button>
            <h3 style={{ marginTop: 0, borderBottom: "2px solid #f1f5f9", paddingBottom: "10px" }}>تفاصيل الطلب</h3>
            <div style={{ display: "grid", gap: "15px", marginTop: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#64748b" }}>الزبون:</span><strong>{selectedBooking.user_name}</strong></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#64748b" }}>البريد:</span><strong>{selectedBooking.email || "غير متوفر"}</strong></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#64748b" }}>الوجهة:</span><strong style={{ color: "#3b82f6" }}>{selectedBooking.destination_name}</strong></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#64748b" }}>المبلغ:</span><strong style={{ color: "#10b981" }}>{selectedBooking.price} د.ج</strong></div>
            </div>
          </div>
        </div>
      )}

      <div style={{ backgroundColor: "#1e293b", color: "white", padding: "15px 30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0, fontSize: "20px" }}>لوحة تحكم SoufSim الحقيقية</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => navigate("/")} style={{ background: "none", border: "1px solid white", color: "white", padding: "8px 15px", borderRadius: "8px", cursor: "pointer" }}>المتجر</button>
          <button onClick={handleLogout} style={{ background: "#ef4444", border: "none", color: "white", padding: "8px 15px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>خروج</button>
        </div>
      </div>

      <div style={{ padding: "30px" }}>

        {/* البطاقات العلوية */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "30px" }}>
          <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "15px", borderRight: "5px solid #10b981" }}><div style={{ color: "#64748b", fontSize: "14px" }}>إجمالي المبيعات</div><div style={{ fontSize: "24px", fontWeight: "bold" }}>{totalSales.toLocaleString()} د.ج</div></div>
          <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "15px", borderRight: "5px solid #3b82f6" }}><div style={{ color: "#64748b", fontSize: "14px" }}>إجمالي الطلبات</div><div style={{ fontSize: "24px", fontWeight: "bold" }}>{totalOrders}</div></div>
          <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "15px", borderRight: "5px solid #eab308" }}><div style={{ color: "#64748b", fontSize: "14px" }}>قيد الانتظار</div><div style={{ fontSize: "24px", fontWeight: "bold", color: "#eab308" }}>{pendingOrders}</div></div>
          <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "15px", borderRight: "5px solid #22c55e" }}><div style={{ color: "#64748b", fontSize: "14px" }}>المكتملة</div><div style={{ fontSize: "24px", fontWeight: "bold", color: "#22c55e" }}>{completedOrders}</div></div>
        </div>

        {/* --- الإحصائيات البصرية المبنية بالـ CSS فقط --- */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "20px", marginBottom: "30px" }}>

          {/* الوجهات الأكثر طلباً */}
          <div style={{ backgroundColor: "white", padding: "25px", borderRadius: "15px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
            <h3 style={{ margin: "0 0 20px 0", color: "#1e293b", fontSize: "18px", borderBottom: "1px solid #f1f5f9", paddingBottom: "10px" }}>أعلى 5 وجهات طلباً 🌍</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {destinationData.length > 0 ? destinationData.map(d => (
                <div key={d.name} style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                  <span style={{ width: "80px", fontSize: "14px", color: "#475569", fontWeight: "bold" }}>{d.name}</span>
                  <div style={{ flex: 1, backgroundColor: "#f1f5f9", height: "12px", borderRadius: "10px", overflow: "hidden" }}>
                    <div style={{ width: `${(d.count / maxCount) * 100}%`, backgroundColor: "#3b82f6", height: "100%", borderRadius: "10px", transition: "width 0.5s ease" }}></div>
                  </div>
                  <span style={{ width: "30px", fontWeight: "bold", color: "#1e293b", textAlign: "left" }}>{d.count}</span>
                </div>
              )) : <div style={{ textAlign: "center", color: "#94a3b8" }}>لا توجد بيانات</div>}
            </div>
          </div>

          {/* توزيع الحالات */}
          <div style={{ backgroundColor: "white", padding: "25px", borderRadius: "15px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
            <h3 style={{ margin: "0 0 20px 0", color: "#1e293b", fontSize: "18px", borderBottom: "1px solid #f1f5f9", paddingBottom: "10px" }}>مؤشرات سير العمل 📊</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {Object.keys(statusCounts).map(status => (
                <div key={status} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 15px", backgroundColor: "#f8fafc", borderRadius: "8px", borderRight: `4px solid ${statusColors[status] || "#cbd5e1"}` }}>
                  <span style={{ fontWeight: "bold", color: "#475569" }}>{status}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "20px", fontWeight: "bold", color: statusColors[status] || "#64748b" }}>{statusCounts[status]}</span>
                    <span style={{ fontSize: "12px", color: "#94a3b8" }}>طلب</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* الجدول والأدوات */}
        <div style={{ backgroundColor: "white", padding: "25px", borderRadius: "15px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "15px" }}>
            <h3 style={{ margin: 0 }}>العمليات المسجلة</h3>
            <div style={{ display: "flex", gap: "10px", flex: 1, maxWidth: "500px" }}>
              <input type="text" placeholder="🔍 ابحث عن زبون..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ padding: "8px 15px", borderRadius: "8px", border: "1px solid #cbd5e1", flex: 1, outline: "none" }} />
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ padding: "8px 15px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none" }}>
                <option value="الكل">جميع الحالات</option><option value="قيد الانتظار">قيد الانتظار</option><option value="جارٍ الشحن">جارٍ الشحن</option><option value="مكتمل">مكتمل</option><option value="ملغي">ملغي</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={exportToCSV} style={{ background: "#10b981", color: "white", border: "none", padding: "8px 15px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>📥 تصدير</button>
              <button onClick={fetchBookings} style={{ background: "#3b82f6", color: "white", border: "none", padding: "8px 15px", borderRadius: "8px", cursor: "pointer" }}>🔄 تحديث</button>
            </div>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "right" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #f1f5f9", color: "#64748b" }}>
                <th style={{ padding: "12px" }}>الزبون</th><th style={{ padding: "12px" }}>الوجهة</th><th style={{ padding: "12px" }}>الحالة</th><th style={{ padding: "12px", textAlign: "center" }}>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (<tr><td colSpan="4" style={{ textAlign: "center", padding: "30px" }}>جاري التحميل...</td></tr>) : currentItems.length > 0 ? (
                currentItems.map((b) => (
                  <tr key={b.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "15px" }}><div style={{ fontWeight: "bold" }}>{b.user_name}</div><div style={{ fontSize: "12px", color: "#94a3b8" }}>{b.price} د.ج</div></td>
                    <td style={{ padding: "15px" }}>{b.destination_name}</td>
                    <td style={{ padding: "15px" }}>
                      <select value={b.status || "قيد الانتظار"} onChange={(e) => handleStatusChange(b.id, e.target.value)} style={{ backgroundColor: getStatusStyle(b.status).bg, color: getStatusStyle(b.status).color, border: "none", padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", outline: "none", cursor: "pointer" }}>
                        <option value="قيد الانتظار">قيد الانتظار</option><option value="جارٍ الشحن">جارٍ الشحن</option><option value="مكتمل">مكتمل</option><option value="ملغي">ملغي</option>
                      </select>
                    </td>
                    <td style={{ padding: "15px", textAlign: "center" }}>
                      <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                        <button onClick={() => setSelectedBooking(b)} style={{ background: "#f1f5f9", color: "#3b82f6", border: "1px solid #e2e8f0", padding: "6px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}>👁️ تفاصيل</button>
                        <button onClick={() => handleDelete(b.id)} style={{ background: "#fee2e2", color: "#ef4444", border: "1px solid #fca5a5", padding: "6px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}>🗑️ حذف</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (<tr><td colSpan="4" style={{ textAlign: "center", padding: "40px" }}>لا توجد بيانات.</td></tr>)}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "15px", marginTop: "20px", paddingTop: "15px", borderTop: "1px solid #f1f5f9" }}>
              <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} style={{ padding: "8px 15px", borderRadius: "8px", border: "1px solid #cbd5e1", background: currentPage === 1 ? "#f1f5f9" : "white", color: currentPage === 1 ? "#94a3b8" : "#1e293b", cursor: currentPage === 1 ? "not-allowed" : "pointer" }}>السابق</button>
              <span style={{ fontSize: "14px", color: "#64748b", fontWeight: "bold" }}>صفحة {currentPage} من {totalPages}</span>
              <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} style={{ padding: "8px 15px", borderRadius: "8px", border: "1px solid #cbd5e1", background: currentPage === totalPages ? "#f1f5f9" : "white", color: currentPage === totalPages ? "#94a3b8" : "#1e293b", cursor: currentPage === totalPages ? "not-allowed" : "pointer" }}>التالي</button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}