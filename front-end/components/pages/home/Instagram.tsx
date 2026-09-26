'use client'
import Image from "next/image";
import { useEffect, useState } from "react";
import { Instagram, ArrowRight } from "lucide-react";

export default function InstagramFollow() {
  const [offset, setOffset] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const images = [
    { id: 1, src: "/img/instagram/1.png", alt: "Instagram post 1" },
    { id: 2, src: "/img/instagram/2.png", alt: "Instagram post 2" },
    { id: 3, src: "/img/instagram/3.png", alt: "Instagram post 3" },
    { id: 4, src: "/img/instagram/4.png", alt: "Instagram post 4" },
  ];

  // Infinite carousel animation
  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prev) => (prev - 415) % (415 * 8));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-15 py-12 sm:py-16 lg:py-24 mt-8 sm:mt-12 lg:mt-16">
      {/* Header Section */}
      <div className="text-center mb-5 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          Follow us on Instagram
        </h2>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Join our community and discover the latest organic products, behind-the-scenes moments, and exclusive offers
        </p>
      </div>

      {/* Carousel Container */}
      <div className="rounded-2xl overflow-hidden bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="overflow-hidden rounded-xl">
          <div
            className="flex gap-4 sm:gap-6 transition-transform duration-1000 ease-out"
            style={{ transform: `translateX(${offset}px)` }}
          >
            {[...images, ...images].map((image, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-full sm:w-[280px] lg:w-[380px] aspect-square rounded-lg overflow-hidden relative group cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={415}
                  height={415}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Hover Overlay */}
                <div
                  className={`
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black/80
                    via-black/40
                    to-transparent
                    flex
                    flex-col
                    items-center
                    justify-center
                    gap-4
                    transition-all
                    duration-500
                    ${hoveredIndex === idx ? "translate-y-0" : "translate-y-full"}
                  `}
                >
                  <Instagram size={56} className="text-white drop-shadow-lg" strokeWidth={1.5} />
                  <p className="text-white text-sm font-semibold opacity-90">View on Instagram</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center mt-12 sm:mt-16">
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="
            inline-flex
            items-center
            gap-3
            px-8
            sm:px-10
            py-4
            sm:py-5
            bg-black
            text-white
            font-semibold
            rounded-full
            hover:bg-gray-900
            transition-all
            duration-300
            hover:shadow-lg
            active:scale-95
            group
          "
        >
          Visit Our Instagram
          <ArrowRight
            size={20}
            className="group-hover:translate-x-1 transition-transform duration-300"
          />
        </a>
      </div>
    </div>
  );
}