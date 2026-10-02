"use client";

import { useState } from "react";
import { Search, Bell, LogOut, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import Link from "next/link";

export default function AdminHeader() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/admin/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header style={{ 
      height: '70px', 
      borderBottom: '1px solid #222', 
      backgroundColor: '#111', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      padding: '0 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }}>
      
      {/* Search */}
      <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', backgroundColor: '#000', borderRadius: '8px', border: '1px solid #333', padding: '0.5rem 1rem', width: '400px' }}>
        <Search size={18} color="#666" style={{ marginRight: '0.5rem' }} />
        <input 
          type="text" 
          placeholder="Search orders, customers, products..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ 
            backgroundColor: 'transparent', 
            border: 'none', 
            color: '#fff', 
            width: '100%', 
            outline: 'none',
            fontSize: '0.875rem'
          }} 
        />
      </form>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link href="/" target="_blank" style={{ color: '#888', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', fontSize: '0.875rem' }}>
          <Globe size={18} /> View Store
        </Link>
        <button style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', position: 'relative' }}>
          <Bell size={20} />
          <span style={{ position: 'absolute', top: 0, right: 0, width: '8px', height: '8px', backgroundColor: '#ff4444', borderRadius: '50%' }}></span>
        </button>
        <div style={{ width: '1px', height: '24px', backgroundColor: '#333' }}></div>
        <button 
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </header>
  );
}
