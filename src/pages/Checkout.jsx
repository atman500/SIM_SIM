import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Checkout({ userRole }) {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [method, setMethod] = useState("");
  const [showForm, setShowForm] = useState(false); // حالة لإظهار نموذج البطاقة

  const country = state?.selectedCountry || { name: "Destination", price: 350 };
  const total = state?.totalPrice || 350;

  // وظيفة الضغط على الزر الكبير
  const handleProceed = () => {
    if (method === "credit") {
      alert("Transaction réussie ! Votre solde POS a été débité.");
      navigate("/");
    } else {
      setShowForm(true); // إظهار نموذج إدخال البطاقة
    }
  };

  return (
    <div style={{ backgroundColor: "#f1f5f9", minHeight: "100vh", padding: "20px", fontFamily: "sans-serif" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "25px" }}>
        <button onClick={() => showForm ? setShowForm(false) : navigate(-1)} style={{ background: "white", border: "none", width: "40px", height: "40px", borderRadius: "12px", cursor: "pointer" }}>❮</button>
        <h2 style={{ flex: 1, textAlign: "center", fontSize: "18px", fontWeight: "bold", marginRight: "40px" }}>
          {showForm ? "Détails de Paiement" : "Finaliser la commande"}
        </h2>
      </div>

      {!showForm ? (
        <>
          {/* ملخص الطلب */}
          <div style={{ backgroundColor: "white", borderRadius: "24px", padding: "20px", boxShadow: "0 4px 10px rgba(0,0,0,0.05)", marginBottom: "25px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <span style={{ color: "#64748b" }}>Produit:</span>
              <span style={{ fontWeight: "bold" }}>eSIM {country.name}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "18px" }}>Total:</span>
              <span style={{ color: "#e11d48", fontWeight: "900", fontSize: "22px" }}>{total} DA</span>
            </div>
          </div>

          <h3 style={{ fontSize: "15px", marginBottom: "15px" }}>Choisir une méthode</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {userRole === "customer" && (
              <div onClick={() => setMethod("dahabia")} style={{ backgroundColor: "white", padding: "15px", borderRadius: "20px", border: method === "dahabia" ? "2px solid #e11d48" : "1px solid #fff", cursor: "pointer" }}>
                <strong>💳 Edahabia / CIB</strong>
              </div>
            )}
            <div onClick={() => setMethod("intl")} style={{ backgroundColor: "white", padding: "15px", borderRadius: "20px", border: method === "intl" ? "2px solid #e11d48" : "1px solid #fff", cursor: "pointer" }}>
              <strong>🌍 Visa / MasterCard</strong>
            </div>
            {userRole === "pos" && (
              <div onClick={() => setMethod("credit")} style={{ backgroundColor: "white", padding: "15px", borderRadius: "20px", border: method === "credit" ? "2px solid #059669" : "1px solid #fff", cursor: "pointer" }}>
                <strong>💰 Solde Business (POS)</strong>
              </div>
            )}
          </div>

          <button onClick={handleProceed} disabled={!method} style={{ width: "100%", padding: "18px", borderRadius: "20px", border: "none", marginTop: "30px", backgroundColor: !method ? "#cbd5e1" : "#e11d48", color: "white", fontWeight: "bold", cursor: "pointer" }}>
            Continuer
          </button>
        </>
      ) : (
        /* --- نموذج إدخال بيانات البطاقة (هذا ما كان ينقصك) --- */
        <div style={{ backgroundColor: "white", padding: "25px", borderRadius: "25px", boxShadow: "0 10px 20px rgba(0,0,0,0.05)" }}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "12px", color: "#64748b", marginBottom: "8px" }}>NUMÉRO DE CARTE</label>
            <input type="text" placeholder="0000 0000 0000 0000" style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "16px" }} />
          </div>

          <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", fontSize: "12px", color: "#64748b", marginBottom: "8px" }}>EXPIRATION</label>
              <input type="text" placeholder="MM/YY" style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0" }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", fontSize: "12px", color: "#64748b", marginBottom: "8px" }}>CVV</label>
              <input type="text" placeholder="123" style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0" }} />
            </div>
          </div>

          <button onClick={() => { alert("Paiement validé !"); navigate("/"); }} style={{ width: "100%", padding: "18px", borderRadius: "20px", border: "none", backgroundColor: "#e11d48", color: "white", fontWeight: "bold", fontSize: "16px", cursor: "pointer" }}>
            Valider le paiement {total} DA
          </button>
        </div>
      )}

      <p style={{ textAlign: "center", fontSize: "11px", color: "#94a3b8", marginTop: "20px" }}>🔒 Transaction sécurisée par GoSIM Algeria</p>
    </div>
  );
}