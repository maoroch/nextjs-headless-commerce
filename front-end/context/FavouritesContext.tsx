'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface FavouritesContextValue {
  ids: number[];
  toggleFavourite: (id: number) => void;
  isFavourite: (id: number) => boolean;
}

const FavouritesContext = createContext<FavouritesContextValue | null>(null);

export function FavouritesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<number[]>([]);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('favourites');
      if (saved) setIds(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem('favourites', JSON.stringify(ids));
    } catch {}
  }, [ids]);

  const toggleFavourite = (id: number) => {
    setIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const isFavourite = (id: number) => ids.includes(id);

  return (
    <FavouritesContext.Provider value={{ ids, toggleFavourite, isFavourite }}>
      {children}
    </FavouritesContext.Provider>
  );
}

export function useFavourites(): FavouritesContextValue {
  const ctx = useContext(FavouritesContext);
  if (!ctx) throw new Error('useFavourites must be used inside <FavouritesProvider>');
  return ctx;
}