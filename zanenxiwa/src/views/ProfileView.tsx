// views/ProfileView.tsx
import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const ProfileView = () => {
  const { user, isAuthenticated, loading, logout } = useAuthStore();
  const navigate = useNavigate();

  // If not authenticated, redirect to login
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);

  // Show loading state
  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  // If no user (should not happen if authenticated), show fallback
  if (!user) {
    return <div>No user data found.</div>;
  }

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", padding: "20px", background: "#f9f9f9", borderRadius: "8px" }}>
      <h1>My Profile</h1>
      <div style={{ borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
        <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone_number || "Not provided"}</p>
        <p><strong>Role:</strong> 
          <span style={{ 
            background: user.role === "admin" ? "#ff4757" : "#2ed573", 
            color: "white", 
            padding: "2px 10px", 
            borderRadius: "12px", 
            marginLeft: "8px", 
            fontSize: "0.9rem" 
          }}>
            {user.role.toUpperCase()}
          </span>
        </p>
      </div>

      {/* --- Role-Based Actions --- */}
      <div style={{ marginTop: "20px" }}>
        {user.role === "admin" && (
          <div style={{ background: "#fff3cd", padding: "15px", borderRadius: "4px", border: "1px solid #ffeeba" }}>
            <h4 style={{ color: "#856404" }}>🛠️ Admin Dashboard</h4>
            <button 
              onClick={() => navigate("/admin/moderate")} 
              style={{ background: "#007bff", color: "white", border: "none", padding: "8px 16px", borderRadius: "4px", cursor: "pointer" }}
            >
              Moderate Suggestions
            </button>
            <button 
              onClick={() => navigate("/admin/seed")} 
              style={{ background: "#28a745", color: "white", border: "none", padding: "8px 16px", borderRadius: "4px", cursor: "pointer", marginLeft: "10px" }}
            >
              Seed Overpass Data
            </button>
          </div>
        )}

        {user.role === "user" && (
          <div style={{ background: "#d4edda", padding: "15px", borderRadius: "4px", border: "1px solid #c3e6cb" }}>
            <h4 style={{ color: "#155724" }}>👤 User Actions</h4>
            <button 
              onClick={() => navigate("/services/suggest")} 
              style={{ background: "#17a2b8", color: "white", border: "none", padding: "8px 16px", borderRadius: "4px", cursor: "pointer" }}
            >
              Suggest a New Service
            </button>
          </div>
        )}
      </div>

      {/* Logout Button */}
      <button 
        onClick={() => { logout(); navigate("/"); }} 
        style={{ marginTop: "30px", background: "#dc3545", color: "white", border: "none", padding: "10px 20px", borderRadius: "4px", cursor: "pointer", width: "100%" }}
      >
        Logout
      </button>
    </div>
  );
};

export default ProfileView;