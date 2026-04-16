import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { colors } from "../data/mockData";

export default function Details() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { selectedCountry } = location.state || {};
  const [days, setDays] = useState(1);

  if (!selectedCountry) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2>Aucun pays sélectionné</h2>
        <button onClick={() => navigate("/")} className="btn-primary">Retourner à l'accueil</button>
      </div>
    );
  }

  const basePrice = selectedCountry.price || 350;
  const subtotal = basePrice * days;

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      {/* Mobile App Header */}
      <div style={{ backgroundColor: "white", padding: "15px 20px", display: "flex", alignItems: "center", borderBottom: "1px solid #eee", position: "sticky", top: 0, zIndex: 10 }}>
        <button onClick={() => navigate("/")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: "0" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.textDark} strokeWidth="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <h2 style={{ flex: 1, textAlign: "center", margin: 0, fontSize: "18px", fontWeight: "bold", color: colors.textDark }}>Détails du forfait</h2>
        <div style={{ width: "24px" }}></div> {/* Placeholder for balance */}
      </div>

      {/* Hero Section */}
      <div style={{ padding: "20px", backgroundColor: "white", textAlign: "center", marginBottom: "15px" }}>
        <img src={`https://flagcdn.com/w160/${selectedCountry.flag || selectedCountry.code}.png`} width="90" style={{ borderRadius: "50%", border: "4px solid #f1f5f9", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", marginBottom: "15px" }} alt="" />
        <h2 style={{ fontSize: "24px", fontWeight: "900", margin: "0 0 5px 0" }}>eSIM {selectedCountry.name}</h2>
        <p style={{ color: colors.textLight, margin: 0 }}>Internet Illimité & Rapide</p>
      </div>

      <div style={{ padding: "0 20px" }}>
        {/* Paramètres */}
        <div style={{ backgroundColor: "white", borderRadius: "20px", padding: "20px", marginBottom: "20px", border: "1px solid #eee" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", paddingBottom: "15px", borderBottom: "1px solid #f1f5f9" }}>
            <span style={{ fontWeight: "bold", color: colors.textDark }}>Type de forfait</span>
            <span style={{ color: colors.primary, fontWeight: "bold", backgroundColor: "#fff1f2", padding: "5px 12px", borderRadius: "10px", fontSize: "12px" }}>Illimité</span>
          </div>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: "bold", color: colors.textDark }}>Durée (Jours)</span>
            <div style={{ display: "flex", alignItems: "center", gap: "15px", backgroundColor: "#f8fafc", padding: "5px", borderRadius: "15px" }}>
              <button onClick={() => setDays(Math.max(1, days - 1))} style={{ width: "35px", height: "35px", borderRadius: "10px", border: "none", backgroundColor: "white", boxShadow: "0 2px 5px rgba(0,0,0,0.05)", cursor: "pointer", fontWeight: "bold", fontSize: "18px" }}>-</button>
              <span style={{ fontWeight: "900", fontSize: "18px", width: "20px", textAlign: "center" }}>{days}</span>
              <button onClick={() => setDays(days + 1)} style={{ width: "35px", height: "35px", borderRadius: "10px", border: "none", backgroundColor: "white", boxShadow: "0 2px 5px rgba(0,0,0,0.05)", cursor: "pointer", fontWeight: "bold", fontSize: "18px" }}>+</button>
            </div>
          </div>
        </div>

        {/* Facturation */}
        <div style={{ backgroundColor: "white", borderRadius: "20px", padding: "20px", marginBottom: "20px", border: "1px solid #eee" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <span style={{ color: colors.textLight }}>Prix journalier</span>
            <span style={{ fontWeight: "bold" }}>{basePrice} DA</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "20px", fontWeight: "900", marginTop: "15px", borderTop: "1px dashed #cbd5e1", paddingTop: "15px" }}>
            <span>Total</span>
            <span style={{ color: colors.primary }}>{subtotal} DA</span>
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={() => navigate("/checkout", { state: { selectedCountry, days, subtotal } })} 
          className="btn-primary"
          style={{ marginBottom: "20px" }}
        >
          Acheter maintenant
        </button>
      </div>
    </div>
  );
}
