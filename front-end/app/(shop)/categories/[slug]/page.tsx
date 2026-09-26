// app/categories/[slug]/page.tsx

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Heart, ShoppingCart, Leaf, Award, Truck, Shield } from 'lucide-react';
import {
  getCategories, getProducts, getProductImage,
  isOrganic, type WCCategory, type WCProduct
} from '@/lib/wordpress';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const cats = await getCategories();
    return cats.filter(c => c.slug !== 'uncategorized').map(c => ({ slug: c.slug }));
  } catch { return []; }
}

export const dynamic = 'force-dynamic';

// ─────────────────────────────────────────────
// Static metadata per category
// ─────────────────────────────────────────────
const CATEGORY_META: Record<string, {
  tagline: string;
  description: string;
  highlights: string[];
  features: { icon: string; title: string; text: string }[];
  accent: string;
  badge: string;
}> = {
  bakery: {
    tagline: 'Baked Fresh Every Morning',
    description: 'Each item in our bakery is handcrafted in small batches using organic stone-ground flours, free-range eggs, and grass-fed butter. No preservatives, no artificial additives — just honest baking with ingredients you can trust. From slow-fermented sourdough to flaky almond croissants, every bite tells the story of real craftsmanship.',
    highlights: ['No artificial preservatives', 'Organic ingredients only', 'Baked fresh daily', 'Traditional methods'],
    features: [
      { icon: '🌾', title: 'Stone-Ground Flour', text: 'We use only organic, stone-milled whole grains that retain their full nutritional profile.' },
      { icon: '🥚', title: 'Free-Range Eggs', text: 'Every egg in our bakery comes from certified free-range farms with full traceability.' },
      { icon: '🧈', title: 'Grass-Fed Butter', text: 'Rich, creamy grass-fed butter sourced from small family dairies for unmatched flavor.' },
      { icon: '⏱️', title: 'Slow Fermented', text: 'Our sourdoughs and breads prove for 24–48 hours for a deeply complex flavor and better digestibility.' },
    ],
    accent: 'bg-yellow-100',
    badge: 'bg-yellow-100 text-yellow-800',
  },
  drinks: {
    tagline: 'Pure. Cold-Pressed. Alive.',
    description: 'Our drinks are crafted from the finest organic produce, pressed and blended fresh daily. We use cold-press technology to extract maximum nutrients without heat damage — preserving every enzyme, vitamin, and natural antioxidant. From smoothies to kombuchas, each bottle is a complete wellness ritual in itself.',
    highlights: ['Cold-pressed daily', 'No added sugars', 'Dairy-free options', 'Probiotic varieties'],
    features: [
      { icon: '❄️', title: 'Cold-Press Technology', text: 'Our hydraulic cold press extracts juice at zero heat, preserving all vitamins and live enzymes.' },
      { icon: '🌿', title: 'No Added Sugar', text: 'Every drink is sweetened only by nature — the fruit, the coconut, the oat.' },
      { icon: '🦠', title: 'Live Probiotics', text: 'Our fermented drinks contain billions of live cultures to support gut health and immunity.' },
      { icon: '🌊', title: 'Deep Hydration', text: 'Electrolyte-rich blends designed to hydrate at the cellular level, not just the surface.' },
    ],
    accent: 'bg-[#B3E5C9]',
    badge: 'bg-[#B3E5C9] text-green-800',
  },
  fruits: {
    tagline: 'Farm to Doorstep, Same Day',
    description: 'We partner exclusively with certified organic farms to bring you fruit harvested at true peak ripeness — never picked early and gassed on arrival. Our same-day delivery network means your strawberries, mangoes, and blueberries are as fresh as the moment they left the farm. No cold storage, no compromise.',
    highlights: ['Certified pesticide-free', 'Same-day delivery', 'Peak-ripeness harvest', 'Seasonal varieties'],
    features: [
      { icon: '🌱', title: 'Certified Organic', text: 'Every farm in our network is certified pesticide-free with full soil and water testing.' },
      { icon: '🌅', title: 'Dawn Harvest', text: 'Our produce is picked at dawn when sugar and nutrient content are at their natural peak.' },
      { icon: '🚚', title: 'Same-Day Delivery', text: 'Zero cold-storage policy — from orchard to your door within hours of harvest.' },
      { icon: '🍓', title: 'Seasonal Rotation', text: 'We follow natural growing seasons to ensure the best variety and flavor year-round.' },
    ],
    accent: 'bg-[#FFCAB3]',
    badge: 'bg-[#FFCAB3] text-orange-800',
  },
  'organic-nuts': {
    tagline: 'Nature\'s Most Powerful Snack',
    description: 'Our organic nuts are sourced from the world\'s premier growing regions — California almonds, Iranian pistachios, Amazon Brazil nuts, and Georgian pecans. Every variety is carefully selected for size, freshness, and nutrient density. Whether raw, roasted, or blended, our nuts are a daily ritual for the health-conscious and the flavor-driven alike.',
    highlights: ['World-sourced premium quality', 'Raw & roasted varieties', 'Nitrogen-sealed freshness', 'Keto & paleo friendly'],
    features: [
      { icon: '🌍', title: 'Global Sourcing', text: 'Each nut variety is sourced from its optimal origin — where climate and soil produce the finest quality.' },
      { icon: '🔒', title: 'Nitrogen Sealed', text: 'Our packaging uses food-grade nitrogen to displace oxygen and lock in freshness for months.' },
      { icon: '💪', title: 'Protein Dense', text: 'A handful of our mixed nuts delivers up to 7g of complete protein and all essential fatty acids.' },
      { icon: '🌿', title: '100% Organic', text: 'No pesticides, no synthetic fertilizers — certified organic from orchard to packaging.' },
    ],
    accent: 'bg-yellow-100',
    badge: 'bg-yellow-100 text-yellow-800',
  },
  'organic-juices': {
    tagline: 'Every Drop, Maximum Nutrition',
    description: 'Our cold-pressed juices start with certified organic produce and end in your glass with every vitamin, enzyme, and antioxidant intact. We press in small batches, bottle immediately, and deliver same-day. No HPP processing, no pasteurization — just living juice the way nature intended it.',
    highlights: ['HPP-free & unpasteurized', 'Pressed in small batches', 'No concentrates', 'Same-day bottling'],
    features: [
      { icon: '⚡', title: 'Live Enzymes', text: 'Our cold-press process never exceeds 4°C, keeping all natural enzymes completely active.' },
      { icon: '🍊', title: 'Whole Fruit Only', text: 'We press entire fruits and vegetables — skin, pulp, and all — for maximum fiber and phytonutrients.' },
      { icon: '🚫', title: 'No Concentrates', text: 'Never reconstituted, never diluted. What you drink is exactly what we pressed.' },
      { icon: '✨', title: 'Therapeutic Blends', text: 'Our signature blends are formulated by nutritionists for specific wellness outcomes.' },
    ],
    accent: 'bg-[#B3E5C9]',
    badge: 'bg-[#B3E5C9] text-green-800',
  },
  'wholesome-breakfast': {
    tagline: 'Start Right, Stay Right',
    description: 'Breakfast is the most important ritual of the day — and we take it seriously. Our wholesome breakfast range is designed to fuel your morning with slow-release energy, gut-supporting fiber, and complete nutrition. From overnight oats to granola and chia puddings, every product is prepared fresh and ready to enjoy the moment you open it.',
    highlights: ['No refined sugars', 'High fiber & protein', 'Ready-to-eat options', 'Plant-based & vegan'],
    features: [
      { icon: '🌅', title: 'Prepared Overnight', text: 'Most of our breakfast products are prepped the night before for perfect texture and taste.' },
      { icon: '🔋', title: 'Slow-Release Energy', text: 'Complex carbohydrates and healthy fats keep you energized and focused until lunch.' },
      { icon: '🫶', title: 'Gut-Friendly', text: 'Rich in prebiotic fiber and live cultures to support a balanced microbiome from morning.' },
      { icon: '🌾', title: 'Whole Grain Only', text: 'Every oat, grain, and seed is certified whole — never refined, never stripped.' },
    ],
    accent: 'bg-[#FFCAB3]',
    badge: 'bg-[#FFCAB3] text-orange-800',
  },
  'dried-fresh-fruits': {
    tagline: 'Concentrated Goodness, Zero Waste',
    description: 'Sun-drying is one of humanity\'s oldest preservation methods — and one of the best. Our dried fruits are slowly dehydrated under natural sun or controlled low heat to concentrate their natural sugars, flavors, and nutrients without any sulfur dioxide, artificial colors, or preservatives. From Medjool dates to Turkish apricots and white mulberries, each product carries centuries of tradition.',
    highlights: ['Sulfur dioxide-free', 'Sun-dried naturally', 'No added sugar', 'Ancient preservation methods'],
    features: [
      { icon: '☀️', title: 'Sun-Dried Naturally', text: 'We use slow, natural sun-drying to concentrate flavors and preserve all natural nutrients.' },
      { icon: '🚫', title: 'No Sulfur Dioxide', text: 'Unlike most commercial dried fruits, ours contain zero sulfite preservatives — ever.' },
      { icon: '🍬', title: 'Naturally Sweet', text: 'The drying process concentrates natural fruit sugars — no added sweeteners needed.' },
      { icon: '🌍', title: 'Origin Sourced', text: 'Turkish apricots from Malatya, Medjool dates from the Jordan Valley, figs from California.' },
    ],
    accent: 'bg-yellow-100',
    badge: 'bg-yellow-100 text-yellow-800',
  },
};

const DEFAULT_META = {
  tagline: 'Carefully Sourced, Thoughtfully Crafted',
  description: 'Every product in this category is selected with care from certified organic suppliers who share our commitment to quality, sustainability, and flavor. We work directly with farmers and producers to ensure the shortest path from source to your table.',
  highlights: ['Certified organic', 'Ethically sourced', 'No artificial additives', 'Fresh & seasonal'],
  features: [
    { icon: '🌿', title: 'Certified Organic', text: 'Every product meets strict organic certification standards from farm to shelf.' },
    { icon: '🤝', title: 'Direct from Farmers', text: 'We partner directly with producers, cutting out middlemen for maximum freshness.' },
    { icon: '🚚', title: 'Fast Delivery', text: 'Orders are packed fresh and dispatched within 24 hours of purchase.' },
    { icon: '💚', title: 'Sustainability First', text: 'Eco-friendly packaging and carbon-offset logistics across all deliveries.' },
  ],
  accent: 'bg-[#B3E5C9]',
  badge: 'bg-[#B3E5C9] text-green-800',
};

const PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect width="800" height="600" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" font-size="64" text-anchor="middle" dominant-baseline="middle"%3E🌿%3C/text%3E%3C/svg%3E';

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  let category: WCCategory | null = null;
  let products: WCProduct[] = [];

  try {
    const all = await getCategories();
    category = all.find(c => c.slug === slug) ?? null;
  } catch {}

  if (!category) return notFound();

  try {
    products = await getProducts({
      category: String(category.id),
      per_page: '24',
      status: 'publish',
    });
  } catch {}

  const meta = CATEGORY_META[slug] ?? DEFAULT_META;
  const heroImage = category.image?.src ?? PLACEHOLDER;

  return (
    <div className="min-h-screen bg-white mt-40">
      <div className="px-4 sm:px-6 lg:px-15 py-8 sm:py-12 lg:py-16 mt-8 sm:mt-12 lg:mt-16">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-10">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <span>/</span>
          <Link href="/categories" className="hover:text-black transition-colors">Categories</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{category.name}</span>
        </div>

        {/* ── Hero ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12 sm:mb-16">

          {/* Hero image */}
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden min-h-[300px] sm:min-h-[420px] bg-gray-100">
            <Image src={heroImage} alt={category.name} fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <span className={`inline-block px-3 py-1 ${meta.badge} text-xs font-semibold rounded-full`}>
                {category.count} product{category.count !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Hero text */}
          <div className="flex flex-col justify-center gap-6 py-4 lg:py-0 lg:pl-4">
            <div>
              <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-3">
                {category.name}
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-gray-900 mb-4">
                {meta.tagline}
              </h1>
              <p className="text-gray-500 text-base leading-relaxed">
                {meta.description}
              </p>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-2 gap-2">
              {meta.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${meta.accent} border border-gray-300`} />
                  <span className="text-sm text-gray-600 font-medium">{h}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex items-center gap-4 flex-wrap">
              <a href="#products"
                className="group inline-flex items-center gap-3 px-7 py-3.5 bg-black text-white text-sm font-bold rounded-full hover:bg-gray-900 hover:shadow-lg active:scale-95 transition-all duration-300">
                Shop {category.name}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
              </a>
              <Link href="/categories"
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-black transition-colors">
                <ArrowLeft size={14} />
                All Categories
              </Link>
            </div>
          </div>
        </div>

        {/* ── Features / Why This Category ── */}
        <div className="mb-12 sm:mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Why Choose Our {category.name}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {meta.features.map((f, i) => (
              <div key={i} className={`rounded-2xl p-6 ${i % 2 === 0 ? meta.accent : 'bg-gray-50'} flex flex-col gap-3`}>
                <span className="text-3xl">{f.icon}</span>
                <h3 className="font-bold text-gray-900 text-base">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Stats bar ── */}
        <div className="rounded-2xl sm:rounded-3xl border border-gray-100 bg-white shadow-sm p-6 sm:p-8 mb-12 sm:mb-16">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 divide-x divide-gray-100">
            {[
              { value: `${category.count}+`, label: 'Products' },
              { value: '100%', label: 'Organic Certified' },
              { value: '24h', label: 'Fresh Delivery' },
              { value: '4.8★', label: 'Average Rating' },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center justify-center text-center px-4 first:pl-0 last:pr-0">
                <span className="text-2xl sm:text-3xl font-bold text-gray-900">{value}</span>
                <span className="text-xs text-gray-400 mt-1 font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Products ── */}
        <div id="products">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              All {category.name}
              <span className="ml-2 text-base font-normal text-gray-400">({products.length})</span>
            </h2>
            <Link href="/shop"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-black transition-colors">
              View all products
              <ArrowRight size={14} className="group-hover:translate-x-1" />
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-5xl mb-4">🌿</p>
              <h3 className="text-xl font-bold mb-2">No products yet</h3>
              <p className="text-gray-500 text-sm mb-8">Check back soon or browse other categories.</p>
              <Link href="/categories"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-black text-white text-sm font-bold rounded-full hover:bg-gray-900 hover:shadow-lg active:scale-95 transition-all duration-300">
                Browse Categories
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
              {products.map(product => {
                const image = getProductImage(product);
                const organic = isOrganic(product);
                const rating = Number(product.average_rating);

                return (
                  <div key={product.id}
                    className="group flex flex-col rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg bg-white border border-gray-100">

                    <Link href={`/shop/${product.slug}`}>
                      <div className="relative overflow-hidden bg-gray-100 aspect-square">
                        <Image src={image} alt={product.name} fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105" />

                        {organic && (
                          <span className="absolute top-3 left-3 px-3 py-1 bg-[#B3E5C9] text-gray-800 text-xs font-semibold rounded-full">
                            Organic
                          </span>
                        )}
                        {product.on_sale && !organic && (
                          <span className="absolute top-3 left-3 px-3 py-1 bg-[#FFCAB3] text-gray-800 text-xs font-semibold rounded-full">
                            Sale
                          </span>
                        )}
                        {product.stock_status === 'outofstock' && (
                          <span className="absolute top-3 left-3 px-3 py-1 bg-[#FFCAB3] text-gray-800 text-xs font-semibold rounded-full">
                            Sold Out
                          </span>
                        )}

                        <div className="absolute top-3 right-3 p-2 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200">
                          <Heart size={16} className="text-gray-500" />
                        </div>
                        {product.stock_status !== 'outofstock' && (
                          <div className="absolute bottom-3 right-3 p-2.5 rounded-full bg-black text-white shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200">
                            <ShoppingCart size={16} />
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className="flex flex-col flex-1 p-4 sm:p-5">
                      {rating > 0 && (
                        <div className="flex items-center gap-2 mb-3">
                          <Image src="/icons/star.svg" alt="Star" width={14} height={14} />
                          <span className="text-sm font-semibold text-black">{rating.toFixed(1)}</span>
                          {product.rating_count > 0 && (
                            <span className="text-xs text-gray-500">({product.rating_count})</span>
                          )}
                        </div>
                      )}

                      <Link href={`/shop/${product.slug}`}>
                        <h3 className="text-base font-bold leading-snug mb-2 line-clamp-2 hover:text-yellow-500 transition-colors">
                          {product.name}
                        </h3>
                      </Link>

                      {product.short_description && (
                        <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-2 leading-relaxed">
                          {product.short_description.replace(/<[^>]*>/g, '').trim()}
                        </p>
                      )}

                      <div className="flex items-center gap-2 mt-auto">
                        <span className="text-lg font-bold text-black">${product.price}</span>
                        {product.on_sale && product.regular_price && (
                          <span className="text-sm text-gray-400 line-through">${product.regular_price}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Bottom CTA ── */}
        {products.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-16 sm:mt-20">
            <Link href="/shop"
              className="group w-full sm:w-auto sm:min-w-80 border border-black rounded-full flex items-center justify-between pl-6 sm:pl-8 pr-2 py-2 sm:py-3 transition-all duration-300 ease-out hover:bg-black hover:text-white hover:shadow-xl active:scale-95">
              <span className="text-sm sm:text-base font-bold tracking-wide">Browse All Products</span>
              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-black flex items-center justify-center group-hover:bg-white transition-all duration-300 group-hover:scale-110 flex-shrink-0">
                <ArrowRight className="text-white group-hover:text-black transition-all duration-300 group-hover:translate-x-1" size={20} strokeWidth={2.5} />
              </div>
            </Link>
            <Link href="/categories"
              className="group w-full sm:w-auto sm:min-w-60 border border-gray-200 rounded-full flex items-center justify-between pl-6 sm:pl-8 pr-2 py-2 sm:py-3 transition-all duration-300 ease-out hover:border-black active:scale-95">
              <span className="text-sm sm:text-base font-bold tracking-wide text-gray-600 group-hover:text-black">All Categories</span>
              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-black transition-all duration-300 flex-shrink-0">
                <ArrowLeft className="text-gray-500 group-hover:text-white transition-all duration-300" size={20} strokeWidth={2.5} />
              </div>
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}