// lib/seo.ts
import type { Metadata } from 'next';
import { getProductBySlug } from '@/lib/wordpress';

// Базовые метаданные для всего сайта (используй в корневом layout.tsx)
export const defaultMetadata: Metadata = {
  title: {
    default: 'Coom Endem — Organic Products for Health & Nature Care',
    template: '%s | Coom Endem',
  },
  description:
    'Discover fresh, natural and certified organic products for your health. Coom Endem offers eco-friendly solutions that care for your body and the planet.',
  keywords: ['organic', 'natural', 'health', 'eco-friendly', 'sustainable', 'wellness'],
  authors: [{ name: 'Coom Endem' }],
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Coom Endem',
    title: 'Coom Endem — Organic Products',
    description:
      'Discover fresh, natural and certified organic products for your health.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Coom Endem Organic Products',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Coom Endem — Organic Products',
    description:
      'Discover fresh, natural and certified organic products for your health.',
    images: ['/og-image.jpg'],
  },
};
export const viewport = {
  width: 'device-width',
  initialScale: 1,
};
// Метаданные для статических страниц
export const pageMetadata = {
  login: {
    title: 'Sign In',
    description:
      'Log in to your Coom Endem account to access your orders, favourites, and exclusive organic products.',
  },
  register: {
    title: 'Create Account',
    description:
      'Join Coom Endem to discover organic products, track orders, and get member-only discounts.',
  },
  'forgot-password': {
    title: 'Reset Password',
    description:
      'Enter your email to receive a password reset link and regain access to your Coom Endem account.',
  },
  shop: {
    title: 'Shop Organic Products',
    description:
      'Browse our curated collection of certified organic, eco-friendly products for health and nature care.',
  },
  cart: {
    title: 'Your Shopping Cart',
    description:
      'Review your selected organic items, update quantities, and proceed to checkout.',
  },
  favourites: {
    title: 'My Favourites',
    description:
      'View and manage your saved favourite organic products for quick access and purchase.',
  },
  orders: {
    title: 'My Orders',
    description:
      'Track your order history, view details, and reorder your favourite organic products.',
  },
  search: {
    title: 'Search Products',
    description:
      'Find your favourite organic products quickly using our search tool.',
  },
  discounts: {
    title: 'Discounts & Offers',
    description:
      'Explore current discounts, special offers, and seasonal promotions on organic products.',
  },
  blog: {
    title: 'Blog',
    description:
      'Read articles about organic living, health tips, and sustainable lifestyle.',
  },
  categories: {
    title: 'Product Categories',
    description:
      'Browse organic products by category: fruits, vegetables, supplements, and more.',
  },
  terms: {
    title: 'Terms of Service',
    description:
      'Read our terms of service and conditions for using Coom Endem.',
  },
  privacy: {
    title: 'Privacy Policy',
    description:
      'Learn how we collect, use, and protect your personal information.',
  },
  support: {
    title: 'Get Help & Support',
    description:
      'Find answers to your questions, contact customer support, and get assistance with your Coom Endem account.',
  },
  faq: {
    title: 'Frequently Asked Questions',
    description:
      'Browse our FAQ to find quick answers about shipping, products, payments, and orders.',
  },
  contact: {
    title: 'Contact Us',
    description:
      'Get in touch with the Coom Endem team for inquiries, feedback, or customer support.',
  },
  'business-contact': {
    title: 'Contact Sales & Partnerships',
    description:
      'Reach out to our business development team for bulk orders, wholesale partnerships, and corporate inquiries.',
  },
  'business-faq': {
    title: 'Business & Wholesale FAQ',
    description:
      'Find answers to questions about wholesale orders, vendor accounts, bulk shipping, and business accounts.',
  },
} as const;

// Тип для ключей страниц
export type PageKey = keyof typeof pageMetadata;

// Вспомогательная функция для получения метаданных статической страницы
export function getPageMetadata(pageKey: PageKey): Metadata {
  const { title, description } = pageMetadata[pageKey];
  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
    twitter: {
      title,
      description,
    },
  };
}

// Динамические метаданные для продукта (использовать в generateMetadata на странице продукта)
export async function generateProductMetadata(slug: string): Promise<Metadata> {
  const product = await getProductBySlug(slug);
  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
    };
  }

  const plainDescription =
    product.short_description?.replace(/<[^>]*>/g, '') ||
    product.description?.replace(/<[^>]*>/g, '') ||
    '';
  const title = `${product.name}`;
  const description = plainDescription.slice(0, 160);
  const image = product.images?.[0]?.src || '/og-image.jpg';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
    twitter: {
      title,
      description,
      images: [image],
    },
  };
}