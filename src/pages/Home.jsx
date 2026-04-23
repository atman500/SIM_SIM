import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { motion, AnimatePresence } from "framer-motion";

export default function Home({ userRole, setUserRole }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [allDestinations, setAllDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState(null);
  const [isOrderComplete, setIsOrderComplete] = useState(false);

  const sandDunesBg = "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?q=80&w=2000&auto=format&fit=crop";
  const oldWadiCity = "https://images.unsplash.com/photo-1545062990-4a95e8e4b96d?q=80&w=1500&auto=format&fit=crop";

  useEffect(() => {
    async function fetchDestinations() {
      try {
        const { data, error } = await supabase.from('destinations').select('*').order('name', { ascending: true });
        if (error) throw error;
        setAllDestinations(data || []);
      } catch (error) {
        console.error("Error:", error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDestinations();
  }, []);

  const handleBooking = async (e, country) => {
    e.stopPropagation();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("⚠️ يرجى تسجيل الدخول أولاً لتتمكن من الحجز.");
      navigate("/login");
      return;
    }

    const basePrice = country.Price || 0;
    const finalPrice = userRole === "pos" ? Math.round(basePrice * 0.8) : basePrice;

    const { error } = await supabase
      .from('bookings')
      .insert([
        {
          user_name: user.email,
          destination_name: country.name,
          price: finalPrice,
          status: 'قيد الانتظار'
        }
      ]);

    if (!error) {
      setIsOrderComplete(true); // تفعيل النافذة هنا
    } else {
      alert("خطأ أثناء الطلب: " + error.message);
    }
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

      {/* --- النافذة المنبثقة (Modal) - وضعناها داخل الـ return لتعمل --- */}
      <AnimatePresence>
        {isOrderComplete && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999,
              display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(5px)'
            }}>
            <motion.div
              initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, y: 20 }}
              style={{
                backgroundColor: 'white', padding: '40px', borderRadius: '25px',
                textAlign: 'center', maxWidth: '450px', width: '90%', boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
              }}>
              <div style={{ fontSize: '50px', marginBottom: '15px' }}>🎉</div>
              <h2 style={{ color: '#0ea5e9', fontWeight: '900', marginBottom: '10px' }}>تم استلام طلبك بنجاح!</h2>
              <p style={{ fontWeight: 'bold', color: '#1e293b' }}>شكراً لثقتك بنا دكتور عثمان.</p>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6', margin: '15px 0' }}>
                تم تسجيل طلبك في النظام. سيقوم فريق SoufSim بالتواصل معكم عبر الواتساب لتأكيد الدفع وتفعيل الخدمة فوراً.
              </p>
              <button
                onClick={() => setIsOrderComplete(false)}
                style={{
                  backgroundColor: '#e11d48', color: 'white', border: 'none',
                  padding: '12px 35px', borderRadius: '12px', cursor: 'pointer',
                  marginTop: '10px', fontWeight: '900', fontSize: '16px', boxShadow: '0 5px 15px rgba(225,29,72,0.3)'
                }}
              >
                حسناً، فهمت
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. نظام الوصول العلوي */}
      <div style={{ backgroundColor: "rgba(15, 23, 42, 0.95)", padding: "8px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", direction: "ltr", zIndex: 1000, backdropFilter: "blur(10px)" }}>
        <span style={{ color: "#94a3b8", fontSize: "10px", fontWeight: "bold" }}>SoufSim Global Panel</span>
        <div style={{ display: "flex", backgroundColor: "#1e293b", borderRadius: "10px", padding: "3px" }}>
          <button onClick={() => setUserRole("customer")} style={{ padding: "4px 12px", borderRadius: "8px", border: "none", fontSize: "9px", fontWeight: "bold", backgroundColor: userRole === "customer" ? "#e11d48" : "transparent", color: "white", cursor: "pointer" }}>CONSUMER</button>
          <button onClick={() => setUserRole("pos")} style={{ padding: "4px 12px", borderRadius: "8px", border: "none", fontSize: "9px", fontWeight: "bold", backgroundColor: userRole === "pos" ? "#e11d48" : "transparent", color: "white", cursor: "pointer" }}>PARTNER POS</button>
        </div>
      </div>

      {/* 2. الهيدر */}
      <div style={{
        backgroundImage: `linear-gradient(to bottom, rgba(225,29,72,0.85), rgba(225,29,72,0.95)), url(${oldWadiCity})`,
        backgroundSize: "cover", backgroundPosition: "center",
        padding: "20px 20px 50px 20px", color: "white", borderBottomLeftRadius: "30px", borderBottomRightRadius: "30px", position: "relative", zIndex: 10,
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1200px", margin: "0 auto 15px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "35px", height: "35px", backgroundColor: "white", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "#e11d48", fontWeight: "900", fontSize: "18px" }}>S</div>
            <h1 style={{ fontSize: "18px", fontWeight: "900", margin: "0" }}>SoufSim marketplace</h1>
          </div>
          <button onClick={() => navigate("/login")} style={{ backgroundColor: "rgba(255,255,255,0.25)", color: "white", border: "1px solid rgba(255,255,255,0.4)", padding: "8px 16px", borderRadius: "10px", fontSize: "12px", fontWeight: "bold", cursor: "pointer", backdropFilter: "blur(10px)" }}>👤 تسجيل الدخول</button>
        </div>
        <div style={{ textAlign: "center", maxWidth: "500px", margin: "0 auto" }}>
          <input type="text" placeholder="ابحث عن وجهتك..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: "100%", padding: "12px 20px", borderRadius: "12px", border: "none", outline: "none", fontSize: "14px", textAlign: "right", color: "#1e293b", boxShadow: "0 8px 20px rgba(0,0,0,0.2)" }} />
        </div>
      </div>

      {/* 3. شبكة الوجهات */}
      <div style={{ padding: "0 20px 40px", maxWidth: "1100px", margin: "-25px auto 0", width: "100%", zIndex: 50, position: "relative", boxSizing: "border-box" }}>
        <h3 style={{ color: "white", fontSize: "28px", fontWeight: "800", marginBottom: "15px", textAlign: "right", textShadow: "0 2px 5px rgba(0,0,0,0.4)" }}>وجهات شائعة</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px", marginBottom: "50px" }}>
          {popularDestinations.map((country) => (
            <DestinationCard key={country.id} country={country} openDetails={openDetails} handleBooking={handleBooking} userRole={userRole} />
          ))}
        </div>

        <h3 style={{ color: "white", fontSize: "28px", fontWeight: "900", marginBottom: "20px", borderRight: "5px solid white", paddingRight: "15px", textAlign: "right", textShadow: "0 2px 5px rgba(0,0,0,0.4)" }}>أفضل الباقات</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px", marginBottom: "50px" }}>
          {bestSellers.map((country) => (
            <DestinationCard key={country.id} country={country} openDetails={openDetails} handleBooking={handleBooking} userRole={userRole} />
          ))}
        </div>
      </div>

      {/* 4. قسم لماذا تختارنا والأسئلة الشائعة والفوتر (كما هي في كودك) */}
      {/* ... بقية الأقسام ... */}
      <footer style={{ backgroundColor: "rgba(15, 23, 42, 0.95)", color: "white", padding: "30px", textAlign: "center", backdropFilter: "blur(10px)" }}>
        <p style={{ fontSize: "11px", opacity: 0.8 }}>جميع الحقوق محفوظة للدكتور Dr.Medini atmane © 2026 | SoufSim Marketplace</p>
      </footer>
    </div>
  );
}

// دالة DestinationCard تبقى كما هي بالأسفل
function DestinationCard({ country, openDetails, handleBooking, userRole }) {
  const basePrice = country.Price || 0;
  const displayPrice = userRole === "pos" ? Math.round(basePrice * 0.8) : basePrice;
  const countryPhoto = `https://images.unsplash.com/featured/?${encodeURIComponent(country.name)},travel,city&sig=${country.id}`;

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={() => openDetails(country)}
      style={{
        position: "relative", height: "260px", backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderRadius: "28px", overflow: "hidden", cursor: "pointer", boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
        border: "1px solid rgba(255, 255, 255, 0.1)"
      }}
    >
      <img src={countryPhoto} alt={country.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)", backdropFilter: "blur(1.5px)", zIndex: 1 }} />
      <div style={{ position: "absolute", top: "15px", right: "15px", display: "flex", alignItems: "center", gap: "8px", zIndex: 2 }}>
        <span style={{ color: "white", fontSize: "16px", fontWeight: "900", textShadow: "0 2px 10px rgba(0,0,0,1)" }}>{country.name}</span>
        <img src={country.flag_url} style={{ width: "24px", height: "24px", borderRadius: "5px", border: "1px solid white" }} alt="" />
      </div>
      <div style={{ position: "absolute", top: "45%", left: "15px", right: "15px", display: "flex", gap: "8px", zIndex: 2 }}>
        <div style={{ flex: 1, backgroundColor: "rgba(225, 29, 72, 0.85)", padding: "10px", borderRadius: "12px", textAlign: "center", border: "1px solid rgba(255,255,255,0.2)", backdropFilter: "blur(4px)" }}>
          <div style={{ color: "white", opacity: 0.9, fontSize: "9px" }}>الصلاحية</div>
          <div style={{ color: "white", fontWeight: "bold", fontSize: "12px" }}>30 يوم</div>
        </div>
        <div style={{ flex: 1, backgroundColor: "rgba(225, 29, 72, 0.85)", padding: "10px", borderRadius: "12px", textAlign: "center", border: "1px solid rgba(255,255,255,0.2)", backdropFilter: "blur(4px)" }}>
          <div style={{ color: "white", opacity: 0.9, fontSize: "9px" }}>البيانات</div>
          <div style={{ color: "white", fontWeight: "bold", fontSize: "12px" }}>5 GB</div>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: "18px", left: "18px", right: "18px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 2 }}>
        <div style={{ color: "white", fontSize: "20px", fontWeight: "900", textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>{displayPrice} <span style={{ fontSize: "11px", opacity: 0.9 }}>DZD</span></div>
        <button
          onClick={(e) => handleBooking(e, country)}
          style={{ backgroundColor: "#0ea5e9", color: "white", border: "none", padding: "8px 18px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold", boxShadow: "0 4px 10px rgba(0,0,0,0.3)", cursor: "pointer" }}
        >
          اطلب الآن
        </button>
      </div>
    </motion.div>
  );
}