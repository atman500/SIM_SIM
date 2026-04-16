import React from "react";
import { Link } from "react-router-dom";
import { colors } from "../data/mockData";
import "../index.css"; // Assurez-vous que les styles sont chargés

export default function Header() {
  return (
    <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 5%", borderBottom: "1px solid #eee", backgroundColor: "#fff", position: "sticky", top: 0, zIndex: 100 }}>
      <Link to="/" style={{ textDecoration: "none" }}>
        <div style={{ fontSize: "24px", fontWeight: "900", color: colors.primary, cursor: "pointer" }}>
          Eloued<span style={{ color: colors.textDark }}>_Sim</span>
        </div>
      </Link>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Link to="/admin" className="btn-secondary">
          Admin
        </Link>
        <button className="btn-primary" type="button">
          Se Connecter
        </button>
      </div>
    </header>
  );
}
