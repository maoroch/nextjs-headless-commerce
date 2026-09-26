import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from 'lucide-react';
import {
  getPosts,
  getPostImage,
  getPostCategory,
  formatDate,
  readTime,
  stripHtml,
  type WPPost,
} from '@/lib/wordpress';



const CATEGORY_COLORS: Record<string, string> = {
  Health:        'bg-[#B3E5C9] text-gray-800',
  Recipes:       'bg-[#FFCAB3] text-gray-800',
  Education:     'bg-yellow-100 text-gray-800',
  Nutrition:     'bg-[#B3E5C9] text-gray-800',
  Lifestyle:     'bg-[#FFCAB3] text-gray-800',
  Uncategorized: 'bg-gray-100 text-gray-700',
};

const FEATURED_CARD_COLORS = ['bg-[#FFCAB3]', 'bg-[#B3E5C9]'];

    export default async function Blog() {

      const posts: WPPost[] = await getPosts(20);
    
      const featured = posts.filter((p: WPPost) => p.sticky);
      const rest = posts.filter((p: WPPost) => !p.sticky);
      const categories = [
        'All',
        ...Array.from(new Set(posts.map((p: WPPost) => getPostCategory(p)))),
      ];
    
    return (
        <div className="px-4 sm:px-6 lg:px-15 py-8 sm:py-12 lg:py-16 mt-8 sm:mt-12 lg:mt-16">

        {/* Header */}
        <div className="mb-10 sm:mb-12 lg:mb-16 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">Food Blog</h2>
            <p className="text-sm sm:text-base text-gray-500 mt-3 leading-relaxed max-w-xl">
              Tips, recipes and stories from the world of organic living.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat: string, i: number) => (
              <span
                key={cat}
                className={`px-4 py-2 rounded-full text-sm font-semibold cursor-pointer transition-all duration-200 ${
                  i === 0 ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Featured (sticky) posts */}
        {featured.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 mb-12 sm:mb-16">
            {featured.map((post: WPPost, i: number) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <div className="flex flex-col gap-4 sm:gap-6 group cursor-pointer">
                  <div className={`${i % 2 === 0 ? 'order-1' : 'order-2'} h-52 sm:h-64 md:h-80 overflow-hidden rounded-xl sm:rounded-2xl`}>
                    <Image
                      src={getPostImage(post)}
                      width={800}
                      height={500}
                      alt={post.title.rendered}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className={`${i % 2 === 0 ? 'order-2' : 'order-1'} ${FEATURED_CARD_COLORS[i % 2]} rounded-xl sm:rounded-2xl p-6 sm:p-8 flex flex-col transition-all duration-300 group-hover:shadow-lg`}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-bold tracking-widest text-gray-500 uppercase">
                        {getPostCategory(post)}
                      </span>
                      <span className="text-gray-400 text-xs">·</span>
                      <span className="text-xs text-gray-500">{readTime(post)}</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold leading-tight mb-3 text-gray-900">
                      {post.title.rendered}
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed line-clamp-3 flex-1 mb-6">
                      {stripHtml(post.excerpt.rendered)}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{formatDate(post.date)}</span>
                      <button className="group/btn inline-flex items-center gap-2 px-6 py-2.5 bg-black text-white text-sm font-bold rounded-full hover:bg-gray-900 active:scale-95 transition-all duration-300">
                        Read More
                        <ArrowRight size={15} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        </div>
    );
}