
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { motion, AnimatePresence } from "framer-motion";

// --- مكون التقييم (NPS Review) ---
const ReviewForm = ({ bookingId }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.stopPropagation();
    const { error } = await supabase
      .from('reviews')
      .insert([{ booking_id: bookingId, rating, comment }]);
    if (!error) setSent(true);
  };

  if (sent) return <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: "#10b981", fontSize: "13px", fontWeight: "bold", textAlign: "center", padding: "10px" }}>✓ شكراً لتقييمك دكتور!</motion.p>;

  return (
    <div style={{ background: "rgba(255, 255, 255, 0.95)", padding: "12px", borderRadius: "15px", marginTop: "10px", border: "1px solid #e2e8f0" }}>
      <p style={{ fontSize: "12px", color: "#475569", marginBottom: "8px", fontWeight: "bold" }}>رأيك يهمنا في جودة الخدمة:</p>
      <div style={{ marginBottom: "8px", display: "flex", gap: "5px", justifyContent: "center" }}>
        {[1, 2, 3, 4, 5].map(s => (
          <span key={s} onClick={() => setRating(s)} style={{ cursor: "pointer", fontSize: "22px", color: rating >= s ? "#f59e0b" : "#cbd5e1" }}>★</span>
        ))}
      </div>
      <textarea
        placeholder="ملاحظاتك..."
        style={{ width: "100%", fontSize: "12px", padding: "8px", borderRadius: "8px", border: "1px solid #ddd", minHeight: "50px", outline: "none" }}
        onChange={(e) => setComment(e.target.value)}
      />
      <button onClick={handleSubmit} style={{ background: "#8b5cf6", color: "white", border: "none", padding: "6px", borderRadius: "8px", marginTop: "8px", cursor: "pointer", width: "100%", fontWeight: "bold", fontSize: "12px" }}>إرسال التقييم</button>
    </div>
  );
};

export default function Home({ userRole, setUserRole }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [allDestinations, setAllDestinations] = useState([]);
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState(null);
  const [isOrderComplete, setIsOrderComplete] = useState(false);

  const sandDunesBg = "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?q=80&w=2000&auto=format&fit=crop";
  const oldWadiCity = "https://images.unsplash.com/photo-1545062990-4a95e8e4b96d?q=80&w=1500&auto=format&fit=crop";

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: dests } = await supabase.from('destinations').select('*').order('name', { ascending: true });
        setAllDestinations(dests || []);

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: books } = await supabase
            .from('bookings')
            .select('*')
            .eq('user_name', user.email)
            .order('created_at', { ascending: false })
            .limit(3);
          setUserBookings(books || []);
        }
      } catch (error) {
        console.error("Error:", error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleBooking = async (e, country) => {
    e.stopPropagation();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate("/login"); return; }

    const basePrice = country.Price || 0;
    const finalPrice = userRole === "pos" ? Math.round(basePrice * 0.8) : basePrice;

    const { error } = await supabase.from('bookings').insert([{ user_name: user.email, destination_name: country.name, price: finalPrice, status: 'قيد الانتظار' }]);
    if (!error) setIsOrderComplete(true);
  };

  const openDetails = (country) => {
    const basePrice = country.Price || 0;
    const finalPrice = userRole === "pos" ? Math.round(basePrice * 0.8) : basePrice;
    navigate("/details", { state: { selectedCountry: { ...country, Price: finalPrice }, userRole } });
    window.scrollTo(0, 0);
  };

  const filteredCountries = allDestinations.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const popularDestinations = filteredCountries.slice(0, 4);
  const bestSellers = filteredCountries.slice(4);

  return (
    <div style={{
      backgroundImage: `url(${sandDunesBg})`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed",
      minHeight: "100vh", display: "flex", flexDirection: "column", direction: "rtl", fontFamily: "system-ui, sans-serif"
    }}>

      {/* --- النافذة المنبثقة (Success Modal) --- */}
      <AnimatePresence>
        {isOrderComplete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={modalOverlayStyle}>
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} style={modalContentStyle}>
              <div style={{ fontSize: '50px' }}>🎉</div>
              <h2 style={{ color: '#0ea5e9' }}>تم استلام طلبك بنجاح!</h2>
              <p>شكراً لثقتك بنا دكتور عثمان.</p>
              <button onClick={() => setIsOrderComplete(false)} style={modalBtnStyle}>حسناً، فهمت</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. نظام الوصول العلوي */}
      <div style={{ backgroundColor: "rgba(15, 23, 42, 0.95)", padding: "8px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", direction: "ltr", zIndex: 1000 }}>
        <span style={{ color: "#94a3b8", fontSize: "10px" }}>SoufSim Global Panel</span>
        <div style={{ display: "flex", backgroundColor: "#1e293b", borderRadius: "10px", padding: "3px" }}>
          <button onClick={() => setUserRole("customer")} style={roleBtnStyle(userRole === "customer")}>CONSUMER</button>
          <button onClick={() => setUserRole("pos")} style={roleBtnStyle(userRole === "pos")}>PARTNER POS</button>
        </div>
      </div>

      {/* 2. الهيدر */}
      <div style={{ backgroundImage: `linear-gradient(to bottom, rgba(225,29,72,0.85), rgba(225,29,72,0.95)), url(${oldWadiCity})`, backgroundSize: "cover", padding: "20px 20px 50px 20px", color: "white", borderBottomLeftRadius: "30px", borderBottomRightRadius: "30px", zIndex: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", maxWidth: "1200px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "18px", fontWeight: "900" }}>SoufSim marketplace</h1>
          <button onClick={() => navigate("/login")} style={loginBtnStyle}>👤 دخول</button>
        </div>
        <div style={{ textAlign: "center", maxWidth: "500px", margin: "20px auto 0" }}>
          <input type="text" placeholder="ابحث عن وجهتك..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={searchInputStyle} />
        </div>
      </div>

      {/* --- جديد: قسم التقييمات والرحلات --- */}
      {userBookings.length > 0 && (
        <div style={{ padding: "30px 20px 0", maxWidth: "1100px", margin: "0 auto", width: "100%", zIndex: 50 }}>
          <h3 style={{ color: "white", fontSize: "20px", textAlign: "right" }}>🔔 رحلاتك الأخيرة</h3>
          <div style={{ display: "flex", gap: "15px", overflowX: "auto", paddingBottom: "10px" }}>
            {userBookings.map((b) => (
              <div key={b.id} style={bookingCardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>{b.destination_name}</span>
                  <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", background: b.status === 'مكتمل' ? "#10b981" : "#f59e0b" }}>{b.status}</span>
                </div>
                {b.status === 'مكتمل' && <ReviewForm bookingId={b.id} />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. شبكة الوجهات */}
      <div style={{ padding: "0 20px 40px", maxWidth: "1100px", margin: "20px auto 0", width: "100%", zIndex: 40 }}>
        <h3 style={sectionTitleStyle}>وجهات شائعة</h3>
        <div style={gridStyle}>
          {popularDestinations.map((country) => (
            <DestinationCard key={country.id} country={country} openDetails={openDetails} handleBooking={handleBooking} userRole={userRole} />
          ))}
        </div>

        <h3 style={sectionTitleStyle}>أفضل الباقات</h3>
        <div style={gridStyle}>
          {bestSellers.map((country) => (
            <DestinationCard key={country.id} country={country} openDetails={openDetails} handleBooking={handleBooking} userRole={userRole} />
          ))}
        </div>
      </div>

      {/* --- استعادة الأقسام المفقودة (لماذا تختارنا والأسئلة) --- */}
      <div style={{ backgroundColor: "rgba(255,255,255,0.9)", padding: "40px 20px", borderRadius: "30px 30px 0 0" }}>
        <h3 style={{ textAlign: "center", color: "#1e293b" }}>لماذا تختار SoufSim؟</h3>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px", marginTop: "20px" }}>
          <div style={featureBoxStyle}>🚀 سرعة التفعيل</div>
          <div style={featureBoxStyle}>🛡️ ضمان استرجاع</div>
          <div style={featureBoxStyle}>📞 دعم 24/7</div>
        </div>

        <div style={{ maxWidth: "800px", margin: "40px auto 0" }}>
          <h4 style={{ textAlign: "center" }}>الأسئلة الشائعة</h4>
          {/* منطق الأسئلة الشائعة */}
          {[1, 2].map(q => (
            <div key={q} onClick={() => setActiveFaq(activeFaq === q ? null : q)} style={faqStyle}>
              {q === 1 ? "كيف يتم الدفع؟" : "هل الخدمة تعمل في كل الولايات؟"}
              {activeFaq === q && <p style={{ fontSize: "14px", marginTop: "10px" }}>نحن نوفر الدفع عبر بريدي موب والبطاقة الذهبية.</p>}
            </div>
          ))}
        </div>
      </div>

      <footer style={{ backgroundColor: "rgba(15, 23, 42, 0.95)", color: "white", padding: "30px", textAlign: "center" }}>
        <p style={{ fontSize: "11px" }}>جميع الحقوق محفوظة للدكتور Dr.Medini atmane © 2026 | SoufSim Marketplace</p>
      </footer>
    </div>
  );
}

// --- التنسيقات (Styles) ---
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(5px)' };
const modalContentStyle = { backgroundColor: 'white', padding: '40px', borderRadius: '25px', textAlign: 'center', maxWidth: '450px', width: '90%' };
const modalBtnStyle = { backgroundColor: '#e11d48', color: 'white', border: 'none', padding: '12px 35px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' };
const roleBtnStyle = (active) => ({ padding: "4px 12px", borderRadius: "8px", border: "none", fontSize: "9px", fontWeight: "bold", backgroundColor: active ? "#e11d48" : "transparent", color: "white", cursor: "pointer" });
const loginBtnStyle = { backgroundColor: "rgba(255,255,255,0.25)", color: "white", border: "1px solid rgba(255,255,255,0.4)", padding: "8px 16px", borderRadius: "10px", fontSize: "12px", cursor: "pointer" };
const searchInputStyle = { width: "100%", padding: "12px 20px", borderRadius: "12px", border: "none", textAlign: "right" };
const bookingCardStyle = { minWidth: "250px", background: "rgba(15, 23, 42, 0.9)", padding: "15px", borderRadius: "20px", color: "white" };
const sectionTitleStyle = { color: "white", fontSize: "24px", fontWeight: "800", marginBottom: "15px", textAlign: "right" };
const gridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px", marginBottom: "40px" };
const featureBoxStyle = { background: "white", padding: "15px 25px", borderRadius: "15px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", fontWeight: "bold" };
const faqStyle = { padding: "15px", borderBottom: "1px solid #ddd", cursor: "pointer" };

// --- دالة DestinationCard ---
function DestinationCard({ country, openDetails, handleBooking, userRole }) {
  const displayPrice = userRole === "pos" ? Math.round(country.Price * 0.8) : country.Price;
  return (
    <motion.div whileHover={{ y: -5 }} onClick={() => openDetails(country)} style={{ position: "relative", height: "250px", borderRadius: "25px", overflow: "hidden", cursor: "pointer" }}>
      <img src={`https://images.unsplash.com/featured/?${country.name},travel`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.8))" }} />
      <div style={{ position: "absolute", bottom: "15px", left: "15px", right: "15px", color: "white" }}>
        <div style={{ fontWeight: "bold" }}>{country.name}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "5px" }}>
          <span>{displayPrice} DZD</span>
          <button onClick={(e) => handleBooking(e, country)} style={{ background: "#0ea5e9", color: "white", border: "none", padding: "5px 10px", borderRadius: "8px" }}>اطلب</button>
        </div>
      </div>
    </motion.div>
  );
}

