'use client';

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

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
      let userCredential;
      try {
        userCredential = await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
      } catch (signInErr: any) {
        // If user doesn't exist in Firebase yet, auto-register admin on first attempt
        if (
          signInErr.code === "auth/user-not-found" ||
          signInErr.code === "auth/invalid-credential" ||
          signInErr.code === "auth/invalid-login-credentials"
        ) {
          try {
            userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, cleanPassword);
          } catch (createErr: any) {
            throw signInErr;
          }
        } else {
          throw signInErr;
        }
      }

      if (userCredential?.user) {
        const idToken = await userCredential.user.getIdToken();
        // Set cookie so Next.js server components and middleware know admin is authenticated
        document.cookie = `admin_token=${idToken}; path=/; max-age=86400; SameSite=Lax`;
        window.location.replace("/admin");
      }
    } catch (err: any) {
      console.error("Firebase Login Error:", err);
      let msg = "Failed to sign in. Please verify your credentials.";
      if (err.code === "auth/wrong-password") {
        msg = "Incorrect password.";
      } else if (err.code === "auth/invalid-email") {
        msg = "Invalid email format.";
      } else if (err.code === "auth/too-many-requests") {
        msg = "Too many failed attempts. Please wait a moment.";
      } else if (err.code === "auth/operation-not-allowed") {
        msg = "Email/Password sign-in is not enabled in Firebase Console. Please enable it under Authentication > Sign-in method.";
      } else if (err.message) {
        msg = err.message;
      }
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', color: '#fff' }}>
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px', padding: '2rem', backgroundColor: '#111', borderRadius: '8px', border: '1px solid #222' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center', letterSpacing: '0.1em' }}>SHIV ADMIN</h1>
        
        {error && <div style={{ padding: '1rem', backgroundColor: 'rgba(255,0,0,0.1)', color: '#ff4444', marginBottom: '1rem', borderRadius: '4px', textAlign: 'center', fontSize: '0.875rem' }}>{error}</div>}
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#888' }}>Email</label>
          <input 
            type="email" 
            required 
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', backgroundColor: '#000', border: '1px solid #333', color: '#fff', borderRadius: '4px' }}
          />
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#888' }}>Password</label>
          <input 
            type="password" 
            required 
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', backgroundColor: '#000', border: '1px solid #333', color: '#fff', borderRadius: '4px' }}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '1rem', 
            backgroundColor: loading ? '#666' : '#fff', 
            color: '#000', 
            border: 'none', 
            borderRadius: '4px', 
            fontWeight: 'bold', 
            cursor: loading ? 'not-allowed' : 'pointer' 
          }}
        >
          {loading ? "Signing In..." : "Sign In with Firebase"}
        </button>
      </form>
    </div>
  );
}
