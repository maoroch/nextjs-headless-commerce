'use client'
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function Reviews() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const reviews = [
    {
      id: 1,
      name: "Miramda S.",
      image: "/img/review/Miramda.png",
      rating: 5.0,
      text: "Absolutely love the quality of the organic products! Everything is fresh, delicious, and packed with nutrients. The fast delivery is a huge plus!💖",
    },
    {
      id: 2,
      name: "Nuran T.",
      image: "/img/review/Nuran.png",
      rating: 5.0,
      text: "Finally, a store that offers truly organic and natural products! The selection is amazing, and I appreciate the transparency about ingredients and sourcing",
    },
    {
      id: 3,
      name: "Sarah M.",
      image: "/img/review/Sarah.png",
      rating: 4.8,
      text: "Exceptional quality and taste! I've noticed a real difference in my energy levels since switching to these organic products. Highly recommended!",
    },
    {
      id: 4,
      name: "John D.",
      image: "/img/review/John.png",
      rating: 4.9,
      text: "Best organic store I've found. Prices are fair, quality is outstanding, and customer service is responsive. Will definitely order again!",
    },
  ];

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  return (
    <section className="reviews px-4 sm:px-6 lg:px-15 py-12 sm:py-16 lg:py-20 mt-8 sm:mt-12 lg:mt-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-stretch">
        
        {/* Left Content */}
        <div className="flex flex-col gap-6">
          {/* Title & Description Card */}
          <div className="bg-gradient-to-br from-blue-50 to-green-50 p-8 sm:p-10 rounded-2xl border border-blue-100">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight font-bold leading-tight mb-4 text-gray-900">
              Reviews
            </h2>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              What our customers say about our organic products: quality, health, and sustainability
            </p>
          </div>

          {/* Stats Card */}
          <div className="bg-white p-8 sm:p-10 rounded-2xl border border-gray-200 shadow-sm">
            {/* Stars */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, idx) => (
                  <Star
                    key={idx}
                    size={22}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-700 ml-2">4.9/5</span>
            </div>

            {/* Stats Grid */}
            <div className="space-y-5">
              <div className="pb-5 border-b border-gray-100">
                <p className="text-2xl sm:text-3xl font-bold text-black">
                  22,000+
                </p>
                <p className="text-sm text-gray-600 mt-1">Customer Reviews</p>
              </div>

              <div>
                <p className="text-2xl sm:text-3xl font-bold text-black">
                  4.9/5
                </p>
                <p className="text-sm text-gray-600 mt-1">Average Rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Carousel */}
        <div className="relative flex flex-col">
          {/* Review Card */}
          <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-lg border border-gray-200 flex flex-col h-full">
            {/* Header with Stars */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, idx) => (
                  <Star
                    key={idx}
                    size={18}
                    className={`${
                      idx < Math.floor(reviews[currentIndex].rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-200"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm font-semibold text-gray-700">
                  {reviews[currentIndex].rating}
                </span>
              </div>
            </div>

            {/* Quote Icon */}
            <div className="w-10 h-10 text-gray-200 mb-6">
              <Image
                src="/icons/quote.svg"
                alt="Quote"
                width={40}
                height={40}
                className="w-10 h-10 gray-200 "
              />
            </div>

            {/* Review Text */}
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-8 flex-1 font-light">
              "{reviews[currentIndex].text}"
            </p>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-gray-200 via-gray-200 to-transparent mb-8" />

            {/* User Info */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-gray-200 border-2 border-blue-100">
                <Image
                  src={reviews[currentIndex].image}
                  alt={reviews[currentIndex].name}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-bold text-base text-gray-900">
                  {reviews[currentIndex].name}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">Verified Customer</p>
              </div>
            </div>
          </div>

          {/* Navigation Section */}
          <div className="mt-8">
            {/* Dots Navigation with Arrow Buttons */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={goToPrevious}
                className="
                  p-2
                  rounded-full
                  bg-gray-100
                  hover:bg-black
                  text-black
                  hover:text-white
                  transition-all
                  duration-300
                  active:scale-90
                  border border-gray-200
                  hover:border-black
                  flex-shrink-0
                "
                aria-label="Previous review"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex items-center gap-2.5">
                {reviews.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`
                      h-2 rounded-full transition-all duration-300 ease-out
                      ${
                        idx === currentIndex
                          ? "w-8 bg-black"
                          : "w-2 bg-gray-300 hover:bg-gray-400"
                      }
                    `}
                    aria-label={`Go to review ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={goToNext}
                className="
                  p-2
                  rounded-full
                  bg-black
                  hover:bg-gray-900
                  text-white
                  transition-all
                  duration-300
                  active:scale-90
                  shadow-md
                  hover:shadow-lg
                  flex-shrink-0
                "
                aria-label="Next review"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Counter */}
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600 font-medium">
                {currentIndex + 1} <span className="text-gray-400">/ {reviews.length}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}