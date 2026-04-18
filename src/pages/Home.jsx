import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home({ userRole, setUserRole }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFaq, setActiveFaq] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // مصفوفة الوجهات السياحية العالمية (شاملة أكثر من 170 دولة)
  const allDestinations = [
    // الشرق الأوسط وشمال أفريقيا
    { name: "تركيا", code: "tr", price: 450, flag: "tr" },
    { name: "السعودية", code: "sa", price: 800, flag: "sa" },
    { name: "الإمارات", code: "ae", price: 700, flag: "ae" },
    { name: "تونس", code: "tn", price: 300, flag: "tn" },
    { name: "مصر", code: "eg", price: 400, flag: "eg" },
    { name: "المغرب", code: "ma", price: 350, flag: "ma" },
    { name: "الأردن", code: "jo", price: 450, flag: "jo" },
    { name: "قطر", code: "qa", price: 750, flag: "qa" },
    { name: "الكويت", code: "kw", price: 700, flag: "kw" },
    { name: "عمان", code: "om", price: 600, flag: "om" },
    { name: "البحرين", code: "bh", price: 650, flag: "bh" },
    { name: "لبنان", code: "lb", price: 400, flag: "lb" },
    { name: "العراق", code: "iq", price: 500, flag: "iq" },
    { name: "ليبيا", code: "ly", price: 350, flag: "ly" },
    { name: "موريتانيا", code: "mr", price: 400, flag: "mr" },
    { name: "فلسطين", code: "ps", price: 500, flag: "ps" },
    { name: "اليمن", code: "ye", price: 600, flag: "ye" },

    // أوروبا
    { name: "فرنسا", code: "fr", price: 650, flag: "fr" },
    { name: "إسبانيا", code: "es", price: 600, flag: "es" },
    { name: "إيطاليا", code: "it", price: 600, flag: "it" },
    { name: "بريطانيا", code: "gb", price: 900, flag: "gb" },
    { name: "ألمانيا", code: "de", price: 650, flag: "de" },
    { name: "سويسرا", code: "ch", price: 1100, flag: "ch" },
    { name: "البرتغال", code: "pt", price: 600, flag: "pt" },
    { name: "اليونان", code: "gr", price: 500, flag: "gr" },
    { name: "هولندا", code: "nl", price: 700, flag: "nl" },
    { name: "بلجيكا", code: "be", price: 650, flag: "be" },
    { name: "النمسا", code: "at", price: 750, flag: "at" },
    { name: "السويد", code: "se", price: 850, flag: "se" },
    { name: "النرويج", code: "no", price: 950, flag: "no" },
    { name: "الدنمارك", code: "dk", price: 800, flag: "dk" },
    { name: "فنلندا", code: "fi", price: 800, flag: "fi" },
    { name: "بولندا", code: "pl", price: 500, flag: "pl" },
    { name: "المجر", code: "hu", price: 450, flag: "hu" },
    { name: "التشيك", code: "cz", price: 500, flag: "cz" },
    { name: "رومانيا", code: "ro", price: 450, flag: "ro" },
    { name: "بلغاريا", code: "bg", price: 400, flag: "bg" },
    { name: "كرواتيا", code: "hr", price: 550, flag: "hr" },
    { name: "سلوفاكيا", code: "sk", price: 500, flag: "sk" },
    { name: "أيرلندا", code: "ie", price: 800, flag: "ie" },
    { name: "لوكسمبورغ", code: "lu", price: 950, flag: "lu" },
    { name: "قبرص", code: "cy", price: 500, flag: "cy" },
    { name: "مالطا", code: "mt", price: 550, flag: "mt" },
    { name: "ألبانيا", code: "al", price: 400, flag: "al" },
    { name: "أيسلندا", code: "is", price: 1200, flag: "is" },
    { name: "صربيا", code: "rs", price: 450, flag: "rs" },
    { name: "روسيا", code: "ru", price: 700, flag: "ru" },

    // آسيا وأوقيانوسيا
    { name: "ماليزيا", code: "my", price: 550, flag: "my" },
    { name: "تايلاند", code: "th", price: 550, flag: "th" },
    { name: "الصين", code: "cn", price: 850, flag: "cn" },
    { name: "اليابان", code: "jp", price: 1000, flag: "jp" },
    { name: "كوريا الجنوبية", code: "kr", price: 900, flag: "kr" },
    { name: "سنغافورة", code: "sg", price: 950, flag: "sg" },
    { name: "فيتنام", code: "vn", price: 450, flag: "vn" },
    { name: "الفلبين", code: "ph", price: 500, flag: "ph" },
    { name: "إندونيسيا", code: "id", price: 500, flag: "id" },
    { name: "الهند", code: "in", price: 400, flag: "in" },
    { name: "باكستان", code: "pk", price: 350, flag: "pk" },
    { name: "سريلانكا", code: "lk", price: 400, flag: "lk" },
    { name: "المالديف", code: "mv", price: 1400, flag: "mv" },
    { name: "كازاخستان", code: "kz", price: 600, flag: "kz" },
    { name: "أوزبكستان", code: "uz", price: 500, flag: "uz" },
    { name: "أذربيجان", code: "az", price: 550, flag: "az" },
    { name: "جورجيا", code: "ge", price: 500, flag: "ge" },
    { name: "أستراليا", code: "au", price: 1000, flag: "au" },
    { name: "نيوزيلندا", code: "nz", price: 1100, flag: "nz" },

    // الأمريكيتان
    { name: "الولايات المتحدة", code: "us", price: 900, flag: "us" },
    { name: "كندا", code: "ca", price: 950, flag: "ca" },
    { name: "المكسيك", code: "mx", price: 750, flag: "mx" },
    { name: "البرازيل", code: "br", price: 800, flag: "br" },
    { name: "الأرجنتين", code: "ar", price: 850, flag: "ar" },
    { name: "كولومبيا", code: "co", price: 700, flag: "co" },
    { name: "تشيلي", code: "cl", price: 750, flag: "cl" },
    { name: "بيرو", code: "pe", price: 650, flag: "pe" },
    { name: "بنما", code: "pa", price: 800, flag: "pa" },
    { name: "كوستاريكا", code: "cr", price: 850, flag: "cr" },

    // أفريقيا (ما عدا شمال أفريقيا)
    { name: "جنوب أفريقيا", code: "za", price: 750, flag: "za" },
    { name: "نيجيريا", code: "ng", price: 600, flag: "ng" },
    { name: "كينيا", code: "ke", price: 550, flag: "ke" },
    { name: "إثيوبيا", code: "et", price: 600, flag: "et" },
    { name: "تنزانيا", code: "tz", price: 550, flag: "tz" },
    { name: "السنغال", code: "sn", price: 450, flag: "sn" },
    { name: "غانا", code: "gh", price: 500, flag: "gh" },
    { name: "أوغندا", code: "ug", price: 500, flag: "ug" },
    { name: "موريشيوس", code: "mu", price: 1100, flag: "mu" },
    { name: "سيشل", code: "sc", price: 1500, flag: "sc" },
    { name: "الكاميرون", code: "cm", price: 600, flag: "cm" },
    { name: "كوت ديفوار", code: "ci", price: 550, flag: "ci" }
  ];

  // بيانات البانر المتحرك
  const slides = [
    {
      id: 1,
      img: "https://images.unsplash.com/photo-1542401886-65d6c61db217?w=1400",
      title: "من قلب الوادي العريق والحديث",
      description: "اختبر الاتصال العالمي السلس مع SoufSim eSIM في الوادي العريق والحديث"
    },
    {
      id: 2,
      img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1400",
      title: "تغطية عالمية فورية لطلبتنا",
      description: "أكثر من 170 دولة بين يديك، لتجربة سفر مريحة وآمنة"
    }
  ];

  // بيانات الأسئلة الشائعة
  const faqData = [
    { q: "ما هو SoufSim؟", a: "SoufSim هو شريحة eSIM بيانات افتراضية مدفوعة مسبقاً تسمح لك بالاتصال بالإنترنت في أكثر من 170 دولة، بدون شريحة SIM فعلية أو اشتراك." },
    { q: "كيف أفعل SoufSim الخاص بي؟", a: "بعد الشراء، ستتلقى رمز الاستجابة السريعة (QR code) عبر البريد الإلكتروني. ما عليك سوى مسحه ضوئياً باستخدام هاتفك المتوافق." },
    { q: "هل يمكنني إعادة شحن SoufSim الخاص بي من الخارج؟", a: "نعم بالتأكيد! يمكنك الدخول إلى حسابك في موقعنا من أي مكان وإضافة باقات بيانات جديدة." },
    { q: "هل يسمح SoufSim بإجراء المكالمات أو استقبال الرسائل النصية؟", a: "باقاتنا مخصصة للبيانات (الإنترنت) فقط. يمكنك استخدام تطبيقات المراسلة مثل WhatsApp للتواصل." }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const openDetails = (country) => {
    const basePrice = country.price || 350;
    const finalPrice = userRole === "pos" ? Math.round(basePrice * 0.8) : basePrice;
    navigate("/details", { state: { selectedCountry: { ...country, price: finalPrice }, userRole } });
    window.scrollTo(0, 0);
  };

  // ربط الفلترة بالمصفوفة الكاملة allDestinations
  const filteredCountries = allDestinations.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh", display: "flex", flexDirection: "column", direction: "rtl", fontFamily: "Arial, sans-serif" }}>

      {/* 1. نظام الوصول */}
      <div style={{ backgroundColor: "#1e293b", padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", direction: "ltr" }}>
        <span style={{ color: "white", fontSize: "11px", fontWeight: "bold" }}>IDENTIFY ACCESS:</span>
        <div style={{ display: "flex", backgroundColor: "#334155", borderRadius: "10px", padding: "2px" }}>
          <button onClick={() => setUserRole("customer")} style={{ padding: "5px 15px", borderRadius: "8px", border: "none", fontSize: "10px", fontWeight: "bold", backgroundColor: userRole === "customer" ? "#e11d48" : "transparent", color: "white", cursor: "pointer", transition: "0.3s" }}>CONSUMER</button>
          <button onClick={() => setUserRole("pos")} style={{ padding: "5px 15px", borderRadius: "8px", border: "none", fontSize: "10px", fontWeight: "bold", backgroundColor: userRole === "pos" ? "#e11d48" : "transparent", color: "white", cursor: "pointer", transition: "0.3s" }}>POINT OF SALE (POS)</button>
        </div>
      </div>

      {/* 2. الهيدر مع زر التسجيل المُفعل */}
      <div style={{ backgroundColor: "#e11d48", padding: "40px 20px", color: "white", borderBottomLeftRadius: "20px", borderBottomRightRadius: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", maxWidth: "1000px", margin: "0 auto 30px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "45px", height: "45px", backgroundColor: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#e11d48", fontWeight: "900", fontSize: "20px" }}>S</div>
            <div style={{ textAlign: "right" }}>
              <h1 style={{ fontSize: "22px", fontWeight: "900", margin: "0" }}>SoufSim</h1>
              <p style={{ margin: "0", fontSize: "11px", opacity: 0.9 }}>Souf International - SIN Sahara</p>
            </div>
          </div>
          {/* زر تسجيل الدخول */}
          <button onClick={() => navigate("/login")} style={{ backgroundColor: "white", color: "#e11d48", border: "none", padding: "10px 20px", borderRadius: "10px", fontSize: "14px", fontWeight: "bold", cursor: "pointer", boxShadow: "0 2px 5px rgba(0,0,0,0.2)" }}>
            👤 تسجيل الدخول
          </button>
        </div>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "15px" }}>تحية عطرة وتمنيات بسفرٍ مريح وإقامةٍ موفّقة</h2>
          <input type="text" placeholder="ابحث عن وجهتك..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: "100%", maxWidth: "500px", padding: "15px 20px", borderRadius: "10px", border: "none", outline: "none", fontSize: "15px", textAlign: "right", color: "#333", margin: "0 auto", display: "block" }} />
        </div>
      </div>

      {/* 3. البانر المتحرك */}
      <div style={{ padding: "10px 20px", marginTop: "-15px", marginBottom: "15px" }}>
        <div style={{ position: "relative", width: "100%", maxWidth: "1000px", margin: "0 auto", height: "200px", borderRadius: "20px", overflow: "hidden", boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}>
          <div style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "flex", transition: "transform 0.5s ease-in-out", transform: `translateX(${currentSlide * 100}%)` }}>
            {slides.map((slide) => (
              <div key={slide.id} style={{ flex: "0 0 100%", height: "100%", position: "relative", background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent 70%)" }}>
                <img src={slide.img} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={slide.title} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 15px", textAlign: "right", color: "white" }}>
                  <h4 style={{ margin: "0 0 5px 0", fontSize: "18px", fontWeight: "bold" }}>{slide.title}</h4>
                  <p style={{ margin: 0, fontSize: "13px", opacity: 0.9 }}>{slide.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. قائمة الوجهات */}
      <div style={{ padding: "10px 20px", flex: 1, maxWidth: "800px", margin: "0 auto", width: "100%" }}>
        <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "20px", color: "#1e293b", textAlign: "right", borderRight: "4px solid #e11d48", paddingRight: "10px" }}>الوجهات المتاحة ({filteredCountries.length})</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {filteredCountries.map((country, i) => {
            const basePrice = country.price;
            const posPrice = Math.round(basePrice * 0.8);
            return (
              <div key={i} onClick={() => openDetails(country)} style={{ display: "flex", alignItems: "center", backgroundColor: "white", padding: "15px 20px", borderRadius: "12px", border: "1px solid #e2e8f0", cursor: "pointer" }}>
                <img src={`https://flagcdn.com/w80/${country.flag}.png`} style={{ width: "35px", height: "35px", borderRadius: "50%", marginLeft: "15px", objectFit: "cover" }} alt={country.name} />
                <div style={{ flex: 1, textAlign: "right" }}>
                  <div style={{ fontWeight: "bold", fontSize: "15px", color: "#1e293b" }}>{country.name}</div>
                  {userRole === "pos" ? (
                    <div><span style={{ fontSize: "11px", color: "#94a3b8", textDecoration: "line-through", marginLeft: "8px" }}>{basePrice} د.ج</span><span style={{ fontSize: "13px", color: "#10b981", fontWeight: "bold" }}>سعر الجملة: {posPrice} د.ج</span></div>
                  ) : (
                    <div style={{ fontSize: "12px", color: "#e11d48", fontWeight: "bold" }}>تبدأ من {basePrice} د.ج</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. قسم الأسئلة الشائعة */}
      <div style={{ backgroundColor: "#ffffff", padding: "60px 20px", borderTop: "1px solid #e2e8f0", marginTop: "40px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <h2 style={{ fontSize: "26px", fontWeight: "900", color: "#0f172a", marginBottom: "10px" }}>الأسئلة الشائعة</h2>
            <p style={{ fontSize: "15px", color: "#64748b" }}>اعثر على معلومات مفيدة للإجابة على أسئلتك</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {faqData.map((item, index) => (
              <div key={index} style={{ border: "1px solid #e2e8f0", borderRadius: "10px", overflow: "hidden" }}>
                <div onClick={() => toggleFaq(index)} style={{ padding: "18px 20px", backgroundColor: "#fff", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: "bold", fontSize: "14px", color: "#0f172a" }}>{item.q}</span>
                  <span style={{ color: "#64748b", transform: activeFaq === index ? "rotate(180deg)" : "rotate(0deg)", transition: "0.3s", fontSize: "16px" }}>{activeFaq === index ? "∧" : "∨"}</span>
                </div>
                {activeFaq === index && (
                  <div style={{ padding: "0 20px 20px 20px", backgroundColor: "#fff", fontSize: "13px", color: "#64748b", lineHeight: "1.8", textAlign: "right" }}>
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. الفوتر */}
      <footer style={{ backgroundColor: "#111827", color: "#f3f4f6", padding: "60px 20px 30px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "40px", direction: "rtl", textAlign: "right" }}>
          <div>
            <h2 style={{ color: "#e11d48", fontWeight: "900", marginBottom: "20px", fontSize: "20px" }}>SoufSim</h2>
            <p style={{ fontSize: "13px", lineHeight: "1.8", color: "#9ca3af", marginBottom: "20px" }}>حل SoufSim الموثوق للاتصال العالمي الفوري. أكثر من 170 دولة مغطاة مع التفعيل الفوري والأسعار الشفافة.</p>
          </div>
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "25px", color: "#ffffff" }}>روابط سريعة</h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "14px", color: "#9ca3af", lineHeight: "2.8" }}>
              <li onClick={() => window.scrollTo(0, 0)} style={{ cursor: "pointer", transition: "0.2s" }}>• جميع الوجهات</li>
              <li onClick={() => navigate("/installation")} style={{ cursor: "pointer", transition: "0.2s" }}>• أدلة التثبيت</li>
              <li onClick={() => navigate("/support")} style={{ cursor: "pointer", color: "#e11d48", fontWeight: "bold", transition: "0.2s" }}>• دعم العملاء</li>
              {/* الرابط المفعل للتسجيل في الفوتر */}
              <li onClick={() => navigate("/login")} style={{ cursor: "pointer", transition: "0.2s" }}>• حسابي / التسجيل</li>
            </ul>
          </div>
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "25px", color: "#ffffff" }}>اتصل بنا</h3>
            <div style={{ fontSize: "14px", color: "#9ca3af", display: "flex", flexDirection: "column", gap: "18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}><span>✉️</span> <span>hello@soufsim.dz</span></div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", direction: "ltr", justifyContent: "flex-end" }}><span>+213 000 00 00 00</span> <span>📞</span></div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}><span>📍</span> <span>الوادي، الجزائر</span></div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}><span>📍</span> <span> جميع الحقوق محفوظة Dr.Atmane medini </span></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}