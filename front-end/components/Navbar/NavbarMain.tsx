'use client'
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search, ChevronDown, LogOut, Package, Heart, ShoppingCart, ArrowRight } from "lucide-react";
import type { SearchResult } from "@/types/product";
import { useAuth } from "@/context/Authcontext";
import { useCart } from "@/context/Cartcontext";
import type { WCCategory } from "@/lib/wordpress";

const PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect width="80" height="80" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" font-size="28" text-anchor="middle" dominant-baseline="middle"%3E🌿%3C/text%3E%3C/svg%3E';

// ── SearchBox ──
interface SearchBoxProps {
  query: string;
  results: SearchResult[];
  isLoading: boolean;
  isDropdownOpen: boolean;
  mobile?: boolean;
  searchRef?: React.RefObject<HTMLDivElement | null>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  onResultClick: () => void;
  onFocus: () => void;
}

function SearchBox({
  query, results, isLoading, isDropdownOpen,
  mobile, searchRef, onChange, onSearch, onResultClick, onFocus,
}: SearchBoxProps) {
  return (
    <div ref={searchRef} className="relative w-full">
      <button type="button" onClick={onSearch}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10" aria-label="Search">
        {isLoading
          ? <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
          : <img src="/icons/search.svg" alt="" className="w-5 h-5 opacity-60 hover:opacity-100 transition-opacity" />
        }
      </button>
      <input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={onChange}
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
        onFocus={onFocus}
        className={`w-full pl-12 pr-4 rounded-full bg-[#F7F6F4] focus:outline-none focus:ring-2 focus:ring-black/10 transition-all ${mobile ? "h-[45px]" : "h-[50px]"}`}
      />
      {isDropdownOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
          {results.length === 0 && !isLoading ? (
            <div className="flex items-center gap-3 px-4 py-5 text-sm text-gray-400">
              <Search size={16} className="shrink-0" />
              No products found for &quot;{query}&quot;
            </div>
          ) : (
            <>
              <ul>
                {results.map((product) => (
                  <li key={product.id} className="border-b border-gray-50 last:border-0">
                    <Link href={`/shop/${product.slug}`} onClick={onResultClick}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                      <div className="w-11 h-11 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                        {product.image
                          ? <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-lg">🌿</div>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">${product.price}</p>
                      </div>
                      <span className="text-gray-300 text-sm">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <button onClick={onSearch}
                className="w-full text-center text-sm font-medium text-gray-500 hover:text-black py-3 hover:bg-gray-50 transition-colors border-t border-gray-100">
                See all results for &quot;{query}&quot;
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ── CartIcon (уже использует ShoppingCart, без изменений) ──
function CartIcon() {
  const { totalItems } = useCart();
  return (
    <li className="grid w-15 place-items-center text-center cursor-pointer group">
      <Link href="/cart">
        <div className="relative p-2 rounded-lg group-hover:bg-gray-100 flex items-center justify-center transition-colors">
          <ShoppingCart size={20} className="text-gray-700 group-hover:text-black transition-colors" />
          {totalItems > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-black text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
              {totalItems > 99 ? '99+' : totalItems}
            </span>
          )}
        </div>
        <span className="text-xs font-medium hover:text-black transition-colors">Cart</span>
      </Link>
    </li>
  );
}

// ── UserMenu (без изменений) ──
function UserMenu() {
  const { user, logout, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (loading) return <li><div className="w-20 h-8 bg-gray-100 animate-pulse rounded-full" /></li>;

  if (!user) {
    return (
      <li className="grid w-15 place-items-center text-center cursor-pointer group">
        <Link href="/login">
          <div className="p-2 rounded-lg group-hover:bg-gray-100 flex items-center justify-center transition-colors">
            <img src="/icons/auth.svg" alt="Sign in" width={20} height={20} />
          </div>
          <span className="text-xs font-medium hover:text-black transition-colors">Sign in</span>
        </Link>
      </li>
    );
  }

  const initials = (user.firstName?.[0] ?? user.email[0]).toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(p => !p)}
        className="flex items-center gap-1 p-1 rounded-full hover:bg-gray-100 transition-colors">
        <div className="w-8 h-8 rounded-full bg-[#B3E5C9] flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-bold text-gray-800">{initials}</span>
        </div>
        <ChevronDown size={13} className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-gray-50">
            <p className="text-sm font-bold text-gray-900 truncate">{user.firstName} {user.lastName}</p>
            <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
          </div>
          <div className="py-1.5">
            {[
              { href: '/orders',     Icon: Package, label: 'My Orders'     },
              { href: '/favourites', Icon: Heart,   label: 'My Favourites' },
            ].map(({ href, Icon, label }) => (
              <Link key={href} href={href} onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors">
                <Icon size={15} className="text-gray-400" />
                {label}
              </Link>
            ))}
          </div>
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

// ── CategoriesDropdown (без изменений) ──
function CategoriesDropdown({ categories }: { categories: WCCategory[] }) {
  return (
    <div className="
      absolute top-full ml-[200px] left-1/2 -translate-x-1/2
      mt-3 w-[580px]
      bg-white rounded-2xl shadow-2xl border border-gray-100
      overflow-hidden z-50
      opacity-0 invisible translate-y-2
      group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
      transition-all duration-200 ease-out
    ">
      <div className="px-5 pt-5 pb-3 border-b border-gray-50 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">Browse</p>
          <h3 className="text-sm font-bold text-gray-900 mt-0.5">All Categories</h3>
        </div>
        <Link href="/categories"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-black transition-colors group/link">
          View all
          <ArrowRight size={12} className="group-hover/link:translate-x-0.5 transition-transform" />
        </Link>
      </div>
      <div className="p-4 grid grid-cols-2 gap-2">
        {categories.map((cat, i) => {
          const imgSrc = cat.image?.src ?? PLACEHOLDER;
          const accents = ['bg-[#FFCAB3]', 'bg-[#B3E5C9]', 'bg-yellow-100'];
          const accent = accents[i % accents.length];
          return (
            <Link key={cat.id} href={`/categories/${cat.slug}`}>
              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-150 group/item cursor-pointer">
                <div className={`relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 ${accent}`}>
                  <Image
                    src={imgSrc}
                    alt={cat.name}
                    fill
                    sizes="48px"
                    className="object-cover transition-transform duration-300 group-hover/item:scale-110"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 group-hover/item:text-black leading-snug truncate">
                    {cat.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {cat.count} product{cat.count !== 1 ? 's' : ''}
                  </p>
                </div>
                <ArrowRight
                  size={14}
                  className="text-gray-300 group-hover/item:text-black group-hover/item:translate-x-0.5 transition-all duration-150 flex-shrink-0"
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// ── Основной компонент ──
export default function NavbarMain() {
  const { user, logout } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [categories, setCategories] = useState<WCCategory[]>([]);
  const lastScrollY = useRef(0);

  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortController = useRef<AbortController | null>(null);

  // Безопасная загрузка категорий через API route
  useEffect(() => {
    fetch('/api/shop?type=categories')
      .then(res => res.json())
      .then((data: WCCategory[]) =>
        setCategories(Array.isArray(data) ? data.filter(c => c.slug !== 'uncategorized') : [])
      )
      .catch(() => {});
  }, []);

  const navLinks = [
    { href: "/",          label: "Home",        hasDropdown: false },
    { href: "/shop",      label: "Products",    hasDropdown: false },
    { href: "/categories", label: "Categories", hasDropdown: true  },
    { href: "/discounts", label: "Discounts",   hasDropdown: false },
    { href: "/blog",      label: "Blog",        hasDropdown: false },
  ];

  const staticLinks = [
    { href: "/favourites", label: "Favourite", icon: "/icons/favourite.svg" },
    { href: "/orders",     label: "Orders",    icon: "/icons/orders.svg"    },
  ];

  const fetchResults = useCallback(async (q: string) => {
    if (q.trim().length < 3) { setResults([]); setIsDropdownOpen(false); setIsLoading(false); return; }
    if (abortController.current) abortController.current.abort();
    abortController.current = new AbortController();
    setIsLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: abortController.current.signal });
      const data: SearchResult[] = await res.json();
      setResults(data); setIsDropdownOpen(true);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      if (e?.name !== 'AbortError') setResults([]);
    } finally { setIsLoading(false); }
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim().length >= 3) setIsLoading(true);
    else { setIsLoading(false); setResults([]); setIsDropdownOpen(false); }
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => fetchResults(val), 500);
  }, [fetchResults]);

  const handleSearch = useCallback(() => {
    if (!query.trim()) return;
    setIsDropdownOpen(false);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (abortController.current) abortController.current.abort();
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setQuery("");
  }, [query, router]);

  const handleResultClick = useCallback(() => {
    setIsDropdownOpen(false); setQuery(""); setIsMenuOpen(false);
  }, []);

  const handleFocus = useCallback(() => {
    if (results.length > 0) setIsDropdownOpen(true);
  }, [results.length]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!searchRef.current?.contains(t) && !mobileSearchRef.current?.contains(t))
        setIsDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      if (y < lastScrollY.current || y < 50) setIsVisible(true);
      else if (y > lastScrollY.current && y > 50) setIsVisible(false);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const sharedProps = {
    query, results, isLoading, isDropdownOpen,
    onChange: handleInputChange, onSearch: handleSearch,
    onResultClick: handleResultClick, onFocus: handleFocus,
  };

  return (
    <header className={`fixed top-0 left-0 right-0 bg-white text-gray-800 border-b border-gray-100 z-50 transition-transform duration-300 ease-out ${isVisible ? "translate-y-0" : "-translate-y-full"}`}>
      <nav className="navbar flex px-4 md:px-15 py-6 gap-6 items-center justify-between md:justify-start">
        <div className="logo">
          <Link href="/">
            <Image src="/img/logos/logo.svg" className="w-[80px] md:w-[100px]" alt="Logo" width={100} height={50} />
          </Link>
        </div>

        <div className="hidden md:block relative w-full">
          <SearchBox {...sharedProps} searchRef={searchRef} />
        </div>

        <div className="hidden md:flex nav-links justify-end">
          <ul className="flex gap-5 items-center">
            {staticLinks.map((link) => (
              <li key={link.href} className="grid w-15 place-items-center text-center cursor-pointer group">
                <Link href={link.href}>
                  <div className="p-2 rounded-lg group-hover:bg-gray-100 flex items-center justify-center transition-colors">
                    <img src={link.icon} alt={link.label} width={20} height={20} />
                  </div>
                  <span className="text-xs font-medium hover:text-black transition-colors">{link.label}</span>
                </Link>
              </li>
            ))}
            <CartIcon />
            <UserMenu />
          </ul>
        </div>

        <button onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden flex flex-col gap-1.5 ml-auto p-2" aria-label="Toggle menu">
          <span className={`w-6 h-0.5 bg-black transition-all duration-300 origin-center ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`w-6 h-0.5 bg-black transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`} />
          <span className={`w-6 h-0.5 bg-black transition-all duration-300 origin-center ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </nav>

      {/* Desktop nav links row */}
      <div className="links hidden md:block border-t border-gray-100">
        <ul className="flex gap-8 px-15 py-4">
          {navLinks.map((link) =>
            link.hasDropdown ? (
              <li key={link.href} className="relative group mt-[2px]">
                <Link href={link.href}
                  className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-black transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-black after:transition-all after:duration-300 hover:after:w-full">
                  {link.label}
                  <ChevronDown
                    size={13}
                    className="text-gray-400 transition-transform duration-200 group-hover:rotate-180 mt-px"
                  />
                </Link>
                {categories.length > 0 && <CategoriesDropdown categories={categories} />}
              </li>
            ) : (
              <li key={link.href}>
                <Link href={link.href}
                  className="text-sm font-medium text-gray-700 hover:text-black transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-black after:transition-all after:duration-300 hover:after:w-full">
                  {link.label}
                </Link>
              </li>
            )
          )}
        </ul>
      </div>

      {/* Mobile overlay */}
      {isMenuOpen && <div className="fixed inset-0 z-40 md:hidden" onClick={() => setIsMenuOpen(false)} />}

      {/* Mobile Drawer */}
      <div className={`fixed top-0 left-0 h-screen w-72 bg-white shadow-xl z-40 md:hidden transform transition-transform duration-300 ease-in-out overflow-y-auto ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="pt-5 px-6 pb-6">
          <div className="mb-8">
            <div className="logo mb-5">
              <Link href="/"><Image src="/img/logos/logo.svg" className="w-[80px]" alt="Logo" width={100} height={50} /></Link>
            </div>
            <SearchBox {...sharedProps} mobile searchRef={mobileSearchRef} />
          </div>

          <nav className="mb-6">
            <h3 className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-wider">Menu</h3>
            <ul className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} onClick={() => setIsMenuOpen(false)}
                    className="block py-3 px-3 text-gray-700 font-medium rounded-lg hover:bg-gray-100 hover:text-black transition-all duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {categories.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Categories</h3>
              <div className="flex flex-col gap-1">
                {categories.map((cat, i) => {
                  const accents = ['bg-[#FFCAB3]', 'bg-[#B3E5C9]', 'bg-yellow-100'];
                  const accent = accents[i % accents.length];
                  return (
                    <Link key={cat.id} href={`/categories/${cat.slug}`} onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-gray-50 transition-colors group/mob">
                      <div className={`relative w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 ${accent}`}>
                        <Image
                          src={cat.image?.src ?? PLACEHOLDER}
                          alt={cat.name}
                          fill
                          sizes="36px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{cat.name}</p>
                        <p className="text-xs text-gray-400">{cat.count} products</p>
                      </div>
                      <ArrowRight size={13} className="text-gray-300 group-hover/mob:text-black transition-colors flex-shrink-0" />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-wider">Account</h3>
            {user ? (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3 px-3 py-3 mb-1">
                  <div className="w-9 h-9 rounded-full bg-[#B3E5C9] flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-gray-800">
                      {(user.firstName?.[0] ?? user.email[0]).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                </div>
                {/* Ссылки для авторизованного пользователя: для корзины используем ShoppingCart вместо cart.svg */}
                <Link href="/cart" onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 py-3 px-3 text-gray-700 font-medium rounded-lg hover:bg-gray-100 hover:text-black transition-all duration-200">
                  <ShoppingCart size={20} />
                  Cart
                </Link>
                <Link href="/orders" onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 py-3 px-3 text-gray-700 font-medium rounded-lg hover:bg-gray-100 hover:text-black transition-all duration-200">
                  <img src="/icons/orders.svg" alt="Orders" width={20} height={20} />
                  My Orders
                </Link>
                <Link href="/favourites" onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 py-3 px-3 text-gray-700 font-medium rounded-lg hover:bg-gray-100 hover:text-black transition-all duration-200">
                  <img src="/icons/favourite.svg" alt="Favourites" width={20} height={20} />
                  My Favourites
                </Link>
                <button onClick={() => { logout(); setIsMenuOpen(false); }}
                  className="flex items-center gap-3 py-3 px-3 text-red-500 font-medium rounded-lg hover:bg-[#FFCAB3]/30 transition-all duration-200 mt-1">
                  <LogOut size={20} />
                  Sign Out
                </button>
              </div>
            ) : (
              <ul className="flex flex-col gap-1">
                <li>
                  <Link href="/favourites" onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 py-3 px-3 text-gray-700 font-medium rounded-lg hover:bg-gray-100 hover:text-black transition-all duration-200">
                    <img src="/icons/favourite.svg" alt="Favourite" width={20} height={20} />
                    Favourite
                  </Link>
                </li>
                <li>
                  <Link href="/cart" onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 py-3 px-3 text-gray-700 font-medium rounded-lg hover:bg-gray-100 hover:text-black transition-all duration-200">
                    <ShoppingCart size={20} />
                    Cart
                  </Link>
                </li>
                <li>
                  <Link href="/orders" onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 py-3 px-3 text-gray-700 font-medium rounded-lg hover:bg-gray-100 hover:text-black transition-all duration-200">
                    <img src="/icons/orders.svg" alt="Orders" width={20} height={20} />
                    Orders
                  </Link>
                </li>
                <li>
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 py-3 px-3 text-gray-700 font-medium rounded-lg hover:bg-gray-100 hover:text-black transition-all duration-200">
                    <img src="/icons/auth.svg" alt="Sign in" width={20} height={20} />
                    Sign in
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}