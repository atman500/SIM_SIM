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

  // صور الخلفية التراثية المعتمدة
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

  const openDetails = (country) => {
    const basePrice = country.Price || 0;
    const finalPrice = userRole === "pos" ? Math.round(basePrice * 0.8) : basePrice;
    navigate("/details", { state: { selectedCountry: { ...country, price: finalPrice }, userRole } });
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

      {/* 1. نظام الوصول العلوي - مصون */}
      <div style={{ backgroundColor: "rgba(15, 23, 42, 0.9)", padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", direction: "ltr", zIndex: 1000, backdropFilter: "blur(10px)" }}>
        <span style={{ color: "#94a3b8", fontSize: "10px", fontWeight: "bold" }}>SoufSim Global Access</span>
        <div style={{ display: "flex", backgroundColor: "#1e293b", borderRadius: "8px", padding: "2px" }}>
          <button onClick={() => setUserRole("customer")} style={{ padding: "4px 12px", borderRadius: "6px", border: "none", fontSize: "9px", fontWeight: "bold", backgroundColor: userRole === "customer" ? "#e11d48" : "transparent", color: "white", cursor: "pointer" }}>CONSUMER</button>
          <button onClick={() => setUserRole("pos")} style={{ padding: "4px 12px", borderRadius: "6px", border: "none", fontSize: "9px", fontWeight: "bold", backgroundColor: userRole === "pos" ? "#e11d48" : "transparent", color: "white", cursor: "pointer" }}>PARTNER POS</button>
        </div>
      </div>

      {/* 2. الهيدر العريق مع أيقونة التسجيل المصونة */}
      <div style={{
        backgroundImage: `linear-gradient(to bottom, rgba(225,29,72,0.85), rgba(225,29,72,0.95)), url(${oldWadiCity})`,
        backgroundSize: "cover", backgroundPosition: "center",
        padding: "40px 20px 80px 20px", color: "white", borderBottomLeftRadius: "35px", borderBottomRightRadius: "35px", position: "relative", zIndex: 10
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1200px", margin: "0 auto 30px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "42px", height: "42px", backgroundColor: "white", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "#e11d48", fontWeight: "900", fontSize: "22px" }}>S</div>
            <div>
              <h1 style={{ fontSize: "20px", fontWeight: "900", margin: "0" }}>SoufSim</h1>
              <p style={{ margin: "0", fontSize: "11px", opacity: 0.9 }}>وادي سوف - مدينة الألف قبة</p>
            </div>
          </div>
          {/* زر التسجيل المصون */}
          <button onClick={() => navigate("/login")} style={{ backgroundColor: "rgba(255,255,255,0.25)", color: "white", border: "1px solid rgba(255,255,255,0.4)", padding: "10px 20px", borderRadius: "12px", fontSize: "14px", fontWeight: "bold", cursor: "pointer", backdropFilter: "blur(10px)" }}>👤 تسجيل الدخول</button>
        </div>
        <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto" }}>
          <input type="text" placeholder="ابحث عن وجهتك العالمية..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: "100%", padding: "16px 25px", borderRadius: "18px", border: "none", outline: "none", fontSize: "16px", textAlign: "right", color: "#1e293b", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }} />
        </div>
      </div>

      {/* 3. شبكة الوجهات مع التصميم الجديد للبطاقات */}
      <div style={{ padding: "0 20px 40px", maxWidth: "1250px", margin: "-40px auto 0", width: "100%", zIndex: 50, position: "relative" }}>
        <h3 style={{ color: "white", fontSize: "15px", fontWeight: "800", marginBottom: "20px", textShadow: "0 2px 5px rgba(0,0,0,0.5)" }}>وجهات شائعة</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "25px", marginBottom: "50px" }}>
          {popularDestinations.map((country) => (
            <DestinationCard key={country.id} country={country} openDetails={openDetails} />
          ))}
        </div>

        <h3 style={{ color: "white", fontSize: "19px", fontWeight: "900", marginBottom: "20px", borderRight: "6px solid white", paddingRight: "15px", textShadow: "0 2px 5px rgba(0,0,0,0.5)" }}>أفضل الباقات الأكثر مبيعاً</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "25px" }}>
          {bestSellers.map((country) => (
            <DestinationCard key={country.id} country={country} openDetails={openDetails} />
          ))}
        </div>
      </div>

      {/* 4. لماذا تختارنا - مصون */}
      <section style={{ padding: "60px 20px", textAlign: "center", backgroundColor: "rgba(255, 255, 255, 0.7)", borderRadius: "40px", margin: "0 20px 40px", backdropFilter: "blur(15px)", border: "1px solid rgba(255,255,255,0.3)" }}>
        <h2 style={{ fontSize: "26px", fontWeight: "900", marginBottom: "40px", color: "#0f172a" }}>لماذا تختار <span style={{ color: "#e11d48" }}>SoufSim</span>؟</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "25px", maxWidth: "1100px", margin: "0 auto" }}>
          {[
            { t: "تفعيل QR فوري", d: "استلم شريحتك فوراً عبر البريد.", i: "⚡" },
            { t: "أسعار محلية", d: "بالدينار الجزائري وبدون تجوال.", i: "💰" },
            { t: "دفع آمن 100%", d: "تشفير عالي لبياناتك البنكية.", i: "🛡️" },
            { t: "دعم 24/7", d: "فريقنا مستعد لمساعدتك دائماً.", i: "🎧" }
          ].map((item, i) => (
            <div key={i} style={{ padding: "30px", borderRadius: "25px", backgroundColor: "rgba(255, 255, 255, 0.8)", border: "1px solid #f1f5f9", textAlign: "right" }}>
              <div style={{ fontSize: "40px", marginBottom: "15px" }}>{item.i}</div>
              <h4 style={{ fontWeight: "900", fontSize: "18px" }}>{item.t}</h4>
              <p style={{ color: "#64748b", fontSize: "13px" }}>{item.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. الأسئلة الشائعة - مصون */}
      <section style={{ padding: "60px 20px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "24px", fontWeight: "900", marginBottom: "40px", color: "white", textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>الأسئلة الشائعة</h2>
          {[{ q: "ما هي شريحة eSIM؟", a: "هي شريحة رقمية مدمجة تتيح لك تفعيل باقة إنترنت دولية." }, { q: "هل يعمل هاتفي مع الخدمة؟", a: "معظم الهواتف الحديثة تدعم التقنية." }].map((faq, i) => (
            <div key={i} onClick={() => setActiveFaq(activeFaq === i ? null : i)} style={{ backgroundColor: "rgba(255, 255, 255, 0.85)", marginBottom: "12px", borderRadius: "15px", cursor: "pointer", overflow: "hidden", border: "1px solid rgba(255,255,255,0.3)", backdropFilter: "blur(10px)" }}>
              <div style={{ padding: "18px 20px", fontWeight: "bold", display: "flex", justifyContent: "space-between", color: "#1e293b" }}>
                <span>{faq.q}</span>
                <span style={{ color: "#e11d48" }}>{activeFaq === i ? "−" : "+"}</span>
              </div>
              {activeFaq === i && <div style={{ padding: "0 20px 20px", color: "#64748b", fontSize: "14px", lineHeight: "1.6" }}>{faq.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* 6. تحميل التطبيق - مصون */}
      <section style={{ padding: "40px 20px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", background: "linear-gradient(90deg, #0ea5e9, #6366f1)", borderRadius: "30px", padding: "40px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", color: "white", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}>
          <div style={{ flex: "1 1 400px", textAlign: "right" }}>
            <h2 style={{ fontSize: "26px", fontWeight: "900", marginBottom: "15px" }}>حمل التطبيق واستمتع بإدارة أسهل</h2>
            <p style={{ opacity: 0.9 }}>تابع استهلاك البيانات وفعل شرائحك بضغطة زر.</p>
            <div style={{ display: "flex", gap: "10px", marginTop: "25px", justifyContent: "flex-end" }}>
              <div style={{ backgroundColor: "black", padding: "10px 20px", borderRadius: "10px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}>Google Play</div>
              <div style={{ backgroundColor: "black", padding: "10px 20px", borderRadius: "10px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}>App Store</div>
            </div>
          </div>
          <div style={{ flex: "1 1 300px", textAlign: "center", fontSize: "100px" }}>📱</div>
        </div>
      </section>

      <footer style={{ backgroundColor: "rgba(15, 23, 42, 0.95)", color: "white", padding: "40px 20px", textAlign: "center", marginTop: "auto", backdropFilter: "blur(10px)" }}>
        <p style={{ fontSize: "12px", opacity: 0.8 }}>جميع الحقوق محفوظة للدكتور عثمان مديني © 2026 | SoufSim</p>
      </footer>
    </div>
  );
}

// مكون البطاقة (Card) المطور - دمج التصميم الجديد مع المربعات التقنية
function DestinationCard({ country, openDetails }) {
  const countryImage = `https://source.unsplash.com/600x400/?${country.name},landmark,travel`;

  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      onClick={() => openDetails(country)}
      style={{
        position: "relative",
        height: "280px", // ارتفاع رشيق ومتناسق
        borderRadius: "28px",
        overflow: "hidden",
        cursor: "pointer",
        boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
        // دمج التدرج اللوني مع صورة المعلم السياحي
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.85)), url(${countryImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* العلم والاسم */}
      <div style={{ position: "absolute", top: "15px", right: "15px", display: "flex", alignItems: "center", gap: "8px", zIndex: 2 }}>
        <span style={{ color: "white", fontSize: "16px", fontWeight: "900", textShadow: "0 2px 4px rgba(0,0,0,0.6)" }}>{country.name}</span>
        <img src={country.flag_url} style={{ width: "26px", height: "26px", borderRadius: "6px", border: "1px solid white" }} alt="" />
      </div>

      {/* المربعات التقنية السوداء (مسترجعة ومصونة) */}
      <div style={{ position: "absolute", top: "45%", left: "15px", right: "15px", display: "flex", gap: "8px", zIndex: 2 }}>
        <div style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.7)", padding: "10px", borderRadius: "12px", textAlign: "center", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(5px)" }}>
          <div style={{ color: "#94a3b8", fontSize: "8px" }}>الصلاحية</div>
          <div style={{ color: "white", fontWeight: "bold", fontSize: "12px" }}>30 يوم</div>
        </div>
        <div style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.7)", padding: "10px", borderRadius: "12px", textAlign: "center", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(5px)" }}>
          <div style={{ color: "#94a3b8", fontSize: "8px" }}>البيانات</div>
          <div style={{ color: "white", fontWeight: "bold", fontSize: "12px" }}>5120 MB</div>
        </div>
      </div>

      {/* السعر وزر الحجز */}
      <div style={{ position: "absolute", bottom: "20px", left: "15px", right: "15px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 2 }}>
        <div style={{ color: "white", fontSize: "20px", fontWeight: "900" }}>{country.Price} <span style={{ fontSize: "10px", opacity: 0.8 }}>DZD</span></div>
        <button style={{ backgroundColor: "#0ea5e9", color: "white", border: "none", padding: "8px 18px", borderRadius: "10px", fontSize: "11px", fontWeight: "bold" }}>حجز</button>
      </div>
    </motion.div>
  );
}