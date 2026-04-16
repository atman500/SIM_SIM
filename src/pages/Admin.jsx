import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { colors } from "../data/mockData";

const DEFAULTS = {
  goubbaDiscountPercent: 5,
  quickFlagPricePerDay: 350,
  bestSellerPrice: 500,
};

function readNumber(key, fallback, opts = {}) {
  const { min = -Infinity, max = Infinity } = opts;
  try {
    const raw = localStorage.getItem(key);
    const n = Number(raw);
    if (!Number.isFinite(n)) return fallback;
    if (n < min) return min;
    if (n > max) return max;
    return n;
  } catch {
    return fallback;
  }
}

export default function Admin() {
  const navigate = useNavigate();
  const [role, setRole] = useState(() => {
    try {
      return localStorage.getItem("adminRole");
    } catch {
      return null;
    }
  });

  const [goubbaDiscountPercent, setGoubbaDiscountPercent] = useState(() =>
    readNumber("goubbaDiscountPercent", DEFAULTS.goubbaDiscountPercent, { min: 0, max: 50 })
  );
  const [quickFlagPricePerDay, setQuickFlagPricePerDay] = useState(() =>
    readNumber("quickFlagPricePerDay", DEFAULTS.quickFlagPricePerDay, { min: 1, max: 1000000 })
  );
  const [bestSellerPrice, setBestSellerPrice] = useState(() =>
    readNumber("bestSellerPrice", DEFAULTS.bestSellerPrice, { min: 1, max: 1000000 })
  );

  const isSuper = role === "super";

  const currentSummary = {
    quick: quickFlagPricePerDay,
    best: bestSellerPrice,
    disc: goubbaDiscountPercent,
  };

  const handleLogin = (newRole) => {
    try {
      localStorage.setItem("adminRole", newRole);
      setRole(newRole);
    } catch {
      // ignore
    }
  };

  const handleSave = () => {
    try {
      localStorage.setItem("goubbaDiscountPercent", String(goubbaDiscountPercent));
      if (isSuper) {
        localStorage.setItem("quickFlagPricePerDay", String(quickFlagPricePerDay));
        localStorage.setItem("bestSellerPrice", String(bestSellerPrice));
      }
    } catch {
      // ignore
    }
    navigate("/");
  };

  const handleSignOut = () => {
    try {
      localStorage.removeItem("adminRole");
    } catch {
      // ignore
    }
    setRole(null);
    navigate("/");
  };

  if (!role) {
    return (
      <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
        <Header />
        <div style={{ padding: "50px 5%", display: "flex", justifyContent: "center" }}>
          <div style={{ backgroundColor: "white", padding: "40px", borderRadius: "35px", width: "100%", maxWidth: "600px", border: "1px solid #e2e8f0" }}>
            <h2 style={{ textAlign: "center", marginBottom: 10 }}>Connexion Admin</h2>
            <p style={{ textAlign: "center", color: colors.textLight, marginTop: 0, marginBottom: 22 }}>
              Choisissez votre type d&apos;admin (frontend uniquement).
            </p>

            <button
              type="button"
              onClick={() => handleLogin("normal")}
              style={{ width: "100%", padding: "18px", backgroundColor: colors.primary, color: "white", border: "none", borderRadius: 15, fontWeight: "bold", fontSize: 18, cursor: "pointer", marginBottom: 14 }}
            >
              Normal admin
            </button>
            <button
              type="button"
              onClick={() => handleLogin("super")}
              style={{ width: "100%", padding: "18px", backgroundColor: colors.textDark, color: "white", border: "none", borderRadius: 15, fontWeight: "bold", fontSize: 18, cursor: "pointer" }}
            >
              Super admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <Header />
      <div style={{ padding: "50px 5%", display: "flex", justifyContent: "center" }}>
        <div style={{ backgroundColor: "white", padding: "40px", borderRadius: "35px", width: "100%", maxWidth: "700px", border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
            <h2 style={{ margin: 0 }}>Admin Dashboard</h2>
            <button type="button" onClick={handleSignOut} style={{ padding: "10px 18px", background: "none", border: `1px solid ${colors.primary}`, borderRadius: 12, color: colors.primary, fontWeight: "bold", cursor: "pointer" }}>
              Déconnexion
            </button>
          </div>

          <div style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 20, padding: 16, marginBottom: 18 }}>
            <div style={{ fontWeight: 900, color: colors.textDark, marginBottom: 8 }}>Rôle: {role}</div>
            <div style={{ color: colors.textLight, fontSize: 14 }}>
              Actuel: remise={currentSummary.disc}% / quickFlag={currentSummary.quick} DA / bestSeller={currentSummary.best} DA
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isSuper ? "repeat(2, 1fr)" : "1fr", gap: 16 }}>
            <div style={{ backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: 20, padding: 16 }}>
              <div style={{ fontWeight: 900, marginBottom: 8 }}>Goubba Pay Discount %</div>
              <input
                type="number"
                value={goubbaDiscountPercent}
                onChange={(e) => setGoubbaDiscountPercent(Number(e.target.value))}
                style={{ width: "100%", padding: 12, border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 16 }}
                min={0}
                max={50}
              />
              <div style={{ color: colors.textLight, fontSize: 13, marginTop: 8 }}>
                Normal admin & Super admin peuvent modifier.
              </div>
            </div>

            {isSuper && (
              <>
                <div style={{ backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: 20, padding: 16 }}>
                  <div style={{ fontWeight: 900, marginBottom: 8 }}>Quick flag price per day</div>
                  <input
                    type="number"
                    value={quickFlagPricePerDay}
                    onChange={(e) => setQuickFlagPricePerDay(Number(e.target.value))}
                    style={{ width: "100%", padding: 12, border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 16 }}
                    min={1}
                  />
                  <div style={{ color: colors.textLight, fontSize: 13, marginTop: 8 }}>Super admin uniquement.</div>
                </div>
                <div style={{ backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: 20, padding: 16 }}>
                  <div style={{ fontWeight: 900, marginBottom: 8 }}>Best seller price</div>
                  <input
                    type="number"
                    value={bestSellerPrice}
                    onChange={(e) => setBestSellerPrice(Number(e.target.value))}
                    style={{ width: "100%", padding: 12, border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 16 }}
                    min={1}
                  />
                  <div style={{ color: colors.textLight, fontSize: 13, marginTop: 8 }}>Super admin uniquement.</div>
                </div>
              </>
            )}
          </div>

          <div style={{ marginTop: 18, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={handleSave}
              style={{ flex: "1 1 220px", padding: "16px 18px", backgroundColor: colors.primary, color: "white", border: "none", borderRadius: 15, fontWeight: "bold", fontSize: 16, cursor: "pointer" }}
            >
              Sauvegarder & retourner
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              style={{ flex: "1 1 220px", padding: "16px 18px", backgroundColor: "white", color: colors.textDark, border: `1px solid ${colors.textDark}`, borderRadius: 15, fontWeight: "bold", fontSize: 16, cursor: "pointer" }}
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

