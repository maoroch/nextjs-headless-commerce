'use client';

import { Heart } from 'lucide-react';
import { useFavourites } from '@/context/FavouritesContext';

export default function FavouriteButton({ productId }: { productId: number }) {
  const { toggleFavourite, isFavourite } = useFavourites();
  const fav = isFavourite(productId);

  return (
    <button
      onClick={() => toggleFavourite(productId)}
      className={`p-3 rounded-full border transition-all duration-200
        ${fav
          ? 'bg-[#FFCAB3]/50 border-[#FFCAB3] text-red-400'
          : 'border-gray-200 text-gray-400 hover:border-[#FFCAB3] hover:bg-[#FFCAB3]/20'
        }`}
    >
      <Heart size={18} className={fav ? 'fill-red-400' : ''} />
    </button>
  );
}