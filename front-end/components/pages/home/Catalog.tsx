import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Catalog() {
  const categories = [
    {
      id: 1,
      title: "Wholesome Breakfast",
      image: "/img/catalog/WholesomeBreakfast.png",
      href: "/categories/wholesome-breakfast",
    },
    {
      id: 2,
      title: "Organic Juices",
      image: "/img/catalog/OrganicJuices.png",
      href: "/categories/organic-juices",
    },
    {
      id: 3,
      title: "Dried & Fresh Fruits",
      image: "/img/catalog/DriedFreshFruits.png",
      href: "/categories/dried-fresh-fruits",
    },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-15 py-8 sm:py-12 lg:py-20 mt-8 sm:mt-12 lg:mt-16">
      {/* Catalog Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 mb-12 sm:mb-16">
        
        {/* Left Box */}
        <div
          className="
            lg:col-span-1
            p-8 sm:p-10 lg:p-12
            rounded-2xl sm:rounded-3xl
            flex flex-col
            justify-between
            min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]
            relative
            overflow-hidden
            group
          "
          style={{
            backgroundImage: "url('/img/catalog/OrganicNuts.png')",
            backgroundSize: "cover",
            backgroundPosition: "right",
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-white/10 group-hover:bg-white/5 transition-all duration-300" />

          {/* Content */}
          <div className="relative z-10 text-gray-900">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              It's your<br />first time?
            </h2>
            <p className="text-base sm:text-lg text-gray-700 lg:mb-12 mb-8">
              Discover our categories!
            </p>
          </div>
          <Link href="/categories/organic-nuts">

          <button className="
            group/btn
            relative
            z-10
            inline-flex
            items-center
            gap-2
            px-6
            sm:px-8
            py-3
            sm:py-4
            bg-black
            text-white
            font-semibold
            rounded-full
            hover:bg-gray-900
            transition-all
            duration-300
            active:scale-95
            w-fit
            shadow-md
            hover:shadow-lg
          ">
            <span className="text-sm sm:text-base">Organic Nuts</span>
            <ArrowRight
              size={18}
              className="group-hover/btn:translate-x-1 transition-transform duration-300"
            />
          </button>
          </Link>
        </div>

        {/* Middle Column */}
        <div className="lg:col-span-1 space-y-5 sm:space-y-6">
          {categories.slice(0, 2).map((category) => (
            <div
              key={category.id}
              className="relative rounded-2xl sm:rounded-3xl overflow-hidden h-[220px] sm:h-[260px] lg:h-[290px] group cursor-pointer"
              style={{
                backgroundImage: `url('${category.image}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-300" />

              <div className="absolute inset-0 flex items-center justify-center">
                <Link href={category.href}>
                  <button className="group/btn inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-black text-white font-semibold rounded-full hover:bg-gray-900 transition-all duration-300 active:scale-95 shadow-md hover:shadow-lg">
                    <span className="text-sm sm:text-base">{category.title}</span>
                    <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>


        {/* Right Box */}
        <div
          className="lg:col-span-1 relative rounded-2xl sm:rounded-3xl overflow-hidden min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] group cursor-pointer"
          style={{
            backgroundImage: `url('${categories[2].image}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-300" />

          <div className="absolute inset-0 flex items-center justify-center">
            <Link href={categories[2].href}>
              <button className="group/btn inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-black text-white font-semibold rounded-full hover:bg-gray-900 transition-all duration-300 active:scale-95 shadow-md hover:shadow-lg">
                <span className="text-sm sm:text-base">{categories[2].title}</span>
                <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
              </button>
            </Link>
          </div>
        </div>
      </div>


      {/* CTA Button */}
      <div className="flex justify-center">
        <Link href="/shop">
          <button className="
            group
            w-full
            sm:w-auto
            sm:min-w-80
            border-1
            border-black
            rounded-full
            flex
            items-center
            justify-between
            pl-6
            sm:pl-8
            pr-2
            py-2
            sm:py-3
            transition-all
            duration-300
            ease-out
            hover:bg-black
            hover:text-white
            hover:shadow-xl
            active:scale-95
          ">
            <span className="text-sm sm:text-base font-bold tracking-wide">
              See Products
            </span>

            <div className="
              w-10
              sm:w-12
              h-10
              sm:h-12
              rounded-full
              bg-black
              flex
              items-center
              justify-center
              group-hover:bg-white
              transition-all
              duration-300
              group-hover:scale-110
              flex-shrink-0
            ">
              <ArrowRight
          className="
            text-white
            group-hover:text-black
            transition-all
            duration-300
            group-hover:translate-x-1
          "
          size={20}
          strokeWidth={2.5}
              />
            </div>
          </button>
        </Link>
      </div>
    </div>
  );
}