export interface Product {
  id: number;
  name: string;
  description: string;
  fullDescription?: string; 
  price: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  tags?: string[];
  inStock?: boolean;
  isOrganic?: boolean;
  weight?: string;
}

export interface FilterState {
  categories: string[];
  priceRange: [number, number];
  inStock: boolean;
  organic: boolean;
  rating: number | null;
}

export interface SearchResult {
  id: number;
  name: string;
  price: string;
  image: string | null;
  slug: string;
}