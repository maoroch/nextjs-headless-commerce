'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { User, LogOut, Package, Heart, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/Authcontext';

export default function UserMenu() {
  const { user, logout, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (loading) return <div className="w-9 h-9 rounded-full bg-gray-100 animate-pulse" />;

  // Not logged in
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/login"
          className="text-sm font-semibold text-gray-700 hover:text-black transition-colors px-3 py-1.5">
          Sign In
        </Link>
        <Link href="/register"
          className="group inline-flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-bold rounded-full hover:bg-gray-900 active:scale-95 transition-all duration-200">
          Register
        </Link>
      </div>
    );
  }

  // Logged in — dropdown
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(p => !p)}
        className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 transition-colors group">
        <div className="w-8 h-8 rounded-full bg-[#B3E5C9] flex items-center justify-center">
          <span className="text-sm font-bold text-gray-800">
            {user.firstName?.[0] ?? user.email[0].toUpperCase()}
          </span>
        </div>
        <span className="text-sm font-semibold text-gray-700 hidden sm:block max-w-[100px] truncate">
          {user.firstName || user.displayName}
        </span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
          {/* User info */}
          <div className="px-4 py-3 border-b border-gray-50">
            <p className="text-sm font-bold text-gray-900 truncate">{user.displayName}</p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>

          {/* Links */}
          <div className="py-1.5">
            {[
              { href: '/orders',     icon: Package, label: 'My Orders'     },
              { href: '/favourites', icon: Heart,   label: 'My Favourites' },
            ].map(({ href, icon: Icon, label }) => (
              <Link key={href} href={href} onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors">
                <Icon size={15} className="text-gray-400" />
                {label}
              </Link>
            ))}
          </div>

          {/* Logout */}
          <div className="border-t border-gray-50 py-1.5">
            <button onClick={() => { logout(); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-[#FFCAB3]/30 transition-colors">
              <LogOut size={15} />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}