import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Banner() {
    return (
<div
  className="
    banner
    md:mt-[156px]
    mt-20
    min-h-[560px]
    sm:min-h-96
    md:min-h-[450px]
    lg:min-h-[600px]
    2xl:min-h-[800px]
    flex
    md:items-center
    pt-30
    md:pt-0
    px-4 sm:px-6 lg:px-15

    bg-[url('/img/banner/bg-mobile.png')]
    md:bg-[url('/img/banner/bg-tablet.png')]
    lg:bg-[url('/img/banner/banner.png')]

    bg-cover
    bg-bottom
    md:bg-right
    lg:bg-center
  "
>

            <div className="content w-full md:w-1/2 text-center xl:text-left">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-bold leading-tight">
                    Organic Products For Your Health
                </h1>
                <p className="mt-4 sm:mt-5 text-base sm:text-lg text-gray-700 leading-relaxed max-w-md">
                    Fresh, natural and certified products for your health and nature care
                </p>

                <button className="
                    mt-6
                    sm:mt-8
                    group
                    inline-flex
                    items-center
                    gap-3
                    px-6
                    sm:px-8
                    py-3
                    sm:py-4
                    bg-black
                    text-white
                    text-sm
                    sm:text-base
                    font-bold
                    rounded-full
                    transition-all
                    duration-300
                    ease-out
                    hover:bg-gray-900
                    hover:shadow-black/30
                    active:scale-95
                    hover:pr-4
                ">
                    <Link href="/shop" className="flex items-center gap-3">
                        <b>See products</b>
                        <ArrowRight
                            className="
                                transition-all
                                duration-300
                                group-hover:translate-x-1
                            "
                            size={20}
                            strokeWidth={2.5}
                        />
                    </Link>
                </button>
            </div>
        </div>
    );
}