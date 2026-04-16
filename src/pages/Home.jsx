import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// استعادة البيانات الأصلية
import { quickFlags, essentials, colors } from "../data/mockData";

export default function Home({ userRole, setUserRole }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const openDetails = (country) => {
    navigate("/details", { state: { selectedCountry: country, role: userRole } });
    window.scrollTo(0, 0);
  };

  const allCountries = [...quickFlags, ...essentials].reduce((acc, current) => {
    const x = acc.find(item => item.name === current.name);
    if (!x) return acc.concat([current]);
    return acc;
  }, []);

  const filteredCountries = allCountries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh", paddingBottom: "20px" }}>

      {/* 1. Identity Selector (POS vs Normal) */}
      <div style={{ backgroundColor: "#1e293b", padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "white", fontSize: "11px", fontWeight: "bold" }}>IDENTIFY ACCESS:</span>
        <div style={{ display: "flex", backgroundColor: "#334155", borderRadius: "10px", padding: "2px" }}>
          <button
            onClick={() => setUserRole("customer")}
            style={{
              padding: "5px 15px", borderRadius: "8px", border: "none", fontSize: "10px", fontWeight: "bold",
              backgroundColor: userRole === "customer" ? "#e11d48" : "transparent",
              color: "white", cursor: "pointer"
            }}>CONSUMER</button>
          <button
            onClick={() => setUserRole("pos")}
            style={{
              padding: "5px 15px", borderRadius: "8px", border: "none", fontSize: "10px", fontWeight: "bold",
              backgroundColor: userRole === "pos" ? "#e11d48" : "transparent",
              color: "white", cursor: "pointer"
            }}>POINT OF SALE (POS)</button>
        </div>
      </div>

      {/* 2. Premium Header */}
      <div style={{
        backgroundColor: colors?.primary || "#e11d48",
        padding: "25px 20px", color: "white",
        borderBottomLeftRadius: "30px", borderBottomRightRadius: "30px",
        boxShadow: "0 4px 20px rgba(225, 29, 72, 0.25)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <div style={{ backgroundColor: "white", padding: "2px", borderRadius: "50%", display: "flex" }}>
            <img src="/logo.png" style={{ width: "45px", height: "45px", borderRadius: "50%" }} alt="GoSIM" />
          </div>
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: "900", margin: "0" }}>GoSIM</h1>
            <p style={{ margin: "0", opacity: 0.8, fontSize: "12px" }}>Souf International - SIN Sahara</p>
          </div>
        </div>
        <div style={{ background: "white", borderRadius: "15px", display: "flex", alignItems: "center", padding: "12px 15px" }}>
          <input
            type="text"
            placeholder="Search your destination..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: "none", outline: "none", width: "100%", fontSize: "16px", color: "#334155" }}
          />
        </div>
      </div>

      {/* 3. Payment Method Indicator */}
      <div style={{ padding: "15px 20px" }}>
        {userRole === "pos" ? (
          <div style={{ backgroundColor: "#ecfeff", border: "1px solid #a5f3fc", padding: "12px", borderRadius: "15px", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "20px" }}>🏢</span>
            <div>
              <p style={{ margin: 0, fontWeight: "bold", fontSize: "13px", color: "#0e7490" }}>Mode Revendeur (POS)</p>
              <p style={{ margin: 0, fontSize: "11px", color: "#0891b2" }}>Paiement via Crédit Rechargeable / Virement</p>
            </div>
          </div>
        ) : (
          <div style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", padding: "12px", borderRadius: "15px", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "20px" }}>💳</span>
            <div>
              <p style={{ margin: 0, fontWeight: "bold", fontSize: "13px", color: "#166534" }}>Mode Consommateur</p>
              <p style={{ margin: 0, fontSize: "11px", color: "#15803d" }}>Paiement par Carte Dahabia / CIB</p>
            </div>
          </div>
        )}
      </div>

      {/* 4. Touristic Banner */}
      <div style={{ padding: "0 20px 20px 20px" }}>
        <div style={{ position: "relative", borderRadius: "25px", overflow: "hidden", height: "160px", boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}>
          <img src="https://images.unsplash.com/photo-1542401886-65d6c61db217?w=800" style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Sahara" />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent 70%)", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "18px", fontWeight: "bold" }}>Discover Sahara</h2>
            <p style={{ color: "white", margin: 0, fontSize: "12px", opacity: 0.9 }}>Stay connected everywhere.</p>
          </div>
        </div>
      </div>

      {/* 5. Feature Icons */}
      <div style={{ padding: "0 20px 20px 20px" }}>
        <div style={{ display: "flex", gap: "12px" }}>
          <div style={{ flex: 1, backgroundColor: "#fef2f2", padding: "15px", borderRadius: "18px", textAlign: "center", border: "1px solid #fee2e2" }}>
            <div style={{ fontSize: "22px" }}>⚡</div>
            <p style={{ margin: "5px 0 0", fontSize: "11px", fontWeight: "bold", color: "#991b1b" }}>Fast Activation</p>
          </div>
          <div style={{ flex: 1, backgroundColor: "#f0f9ff", padding: "15px", borderRadius: "18px", textAlign: "center", border: "1px solid #e0f2fe" }}>
            <div style={{ fontSize: "22px" }}>🌍</div>
            <p style={{ margin: "5px 0 0", fontSize: "11px", fontWeight: "bold", color: "#075985" }}>Global Access</p>
          </div>
        </div>
      </div>

      {/* 6. Professional List */}
      <div style={{ padding: "0 20px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "15px", color: "#1e293b" }}>Destinations</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filteredCountries.map((country, i) => (
            <div
              key={i}
              onClick={() => openDetails(country)}
              style={{ display: "flex", alignItems: "center", backgroundColor: "white", padding: "15px", borderRadius: "20px", border: "1px solid #f1f5f9", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.02)", cursor: "pointer" }}
            >
              <img
                src={`https://flagcdn.com/w80/${country.code || country.flag}.png`}
                style={{ width: "45px", height: "45px", borderRadius: "50%", objectFit: "cover", marginRight: "15px", border: "1px solid #f1f5f9" }}
                alt={country.name}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "bold", fontSize: "16px", color: "#1e293b" }}>{country.name}</div>
                <div style={{ fontSize: "14px", color: userRole === "pos" ? "#0891b2" : "#e11d48", fontWeight: "bold" }}>
                  {userRole === "pos" ? "Wholesale (B2B Rate)" : `From ${country.price || 350} DA`}
                </div>
              </div>
              <div style={{ color: "#e11d48", fontWeight: "bold" }}>→</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}