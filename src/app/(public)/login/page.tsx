'use client';

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid credentials.");
    } else {
      router.push("/account");
      router.refresh();
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', color: '#fff' }}>
      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit} 
        style={{ width: '100%', maxWidth: '400px', padding: '2rem', backgroundColor: '#111', borderRadius: '8px', border: '1px solid #222' }}
      >
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center', letterSpacing: '0.1em' }}>LOGIN TO SHIV</h1>
        
        {error && <div style={{ padding: '1rem', backgroundColor: 'rgba(255,0,0,0.1)', color: '#ff4444', marginBottom: '1rem', borderRadius: '4px', textAlign: 'center' }}>{error}</div>}
        
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
        
        <button type="submit" style={{ width: '100%', padding: '1rem', backgroundColor: '#fff', color: '#000', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '1rem' }}>
          Sign In
        </button>

        <div style={{ textAlign: 'center', fontSize: '0.875rem', color: '#888' }}>
          Don't have an account? <Link href="/register" style={{ color: '#fff', textDecoration: 'underline' }}>Register</Link>
        </div>
      </motion.form>
    </div>
  );
}
