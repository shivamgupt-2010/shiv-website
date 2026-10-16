'use client';

import { useState } from "react";
import { signIn } from "next-auth/react";
import { verifyAdminCredentials } from "@/app/actions/adminAuth";
import { Shield, Lock, AlertCircle } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    try {
      const formData = new FormData();
      formData.set("email", cleanEmail);
      formData.set("password", cleanPassword);

      // 1. Verify against database with strict RBAC check
      const authRes = await verifyAdminCredentials(formData);

      if (!authRes.success) {
        setError(authRes.error || "Failed to sign in. Please verify your credentials.");
        setLoading(false);
        return;
      }

      // 2. Establish NextAuth session
      const nextAuthRes = await signIn("credentials", {
        redirect: false,
        email: cleanEmail,
        password: cleanPassword,
      });

      if (nextAuthRes?.error) {
        console.warn("NextAuth credentials warning:", nextAuthRes.error);
      }

      // Redirect to admin overview
      window.location.replace("/admin");
    } catch (err: any) {
      console.error("Admin Login Error:", err);
      setError(err?.message || "An unexpected error occurred during sign-in.");
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#07090e', color: '#fff', padding: '1.5rem' }}>
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '420px', padding: '2.5rem', backgroundColor: '#0f1422', borderRadius: '1rem', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: '1rem', boxShadow: '0 0 25px rgba(14, 165, 233, 0.35)' }}>
            <Shield size={24} />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, letterSpacing: '0.05em', color: '#fff' }}>SHIV ADMIN</h1>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.4rem', lineHeight: 1.4 }}>
            Restricted access for Super Admins, Shop Owners, and Marketers only.
          </p>
        </div>
        
        {error && (
          <div style={{ padding: '0.85rem 1rem', backgroundColor: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', marginBottom: '1.5rem', borderRadius: '0.5rem', fontSize: '0.84rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{error}</span>
          </div>
        )}
        
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1' }}>Admin Email</label>
          <input 
            type="email" 
            required 
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="admin@shiv.com"
            style={{ width: '100%', padding: '0.8rem 1rem', backgroundColor: '#080b12', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#fff', borderRadius: '0.5rem', fontSize: '0.9rem' }}
          />
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1' }}>Password</label>
          <input 
            type="password" 
            required 
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{ width: '100%', padding: '0.8rem 1rem', backgroundColor: '#080b12', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#fff', borderRadius: '0.5rem', fontSize: '0.9rem' }}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '0.95rem', 
            background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '0.5rem', 
            fontWeight: 700, 
            fontSize: '0.95rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 20px rgba(14, 165, 233, 0.35)',
            opacity: loading ? 0.7 : 1,
            transition: 'all 0.2s ease',
          }}
        >
          {loading ? "Authenticating Staff..." : "Sign In to Admin Panel"}
        </button>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.78rem', color: '#64748b' }}>
          Staff roles are assigned exclusively by <strong>admin@shiv.com</strong>
        </div>
      </form>
    </div>
  );
}
