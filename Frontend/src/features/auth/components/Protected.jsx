import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

const Protected = ({ children }) => {
    const { loading, user } = useAuth();

    if (loading) {
        return (
            <main style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100dvh",
                background: "var(--bg-dark-950, #05060d)",
                color: "#f8fafc",
                fontFamily: "var(--font-sans, sans-serif)"
            }}>
                <div className="spinner" style={{ width: "36px", height: "36px", borderWidth: "3px", borderTopColor: "#10b981" }}></div>
                <p style={{ color: "#94a3b8", fontSize: "0.95rem" }}>Verifying credentials...</p>
            </main>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default Protected;