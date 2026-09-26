import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Clock, Calendar } from 'lucide-react';
import {
  getPosts,
  getPostBySlug,
  getPostImage,
  getPostCategory,
  getPostTags,
  formatDate,
  readTime,
  stripHtml,
  type WPPost,
  type WPTerm,
} from '@/lib/wordpress';

const CATEGORY_COLORS: Record<string, string> = {
  Health:        'bg-[#B3E5C9] text-gray-800',
  Recipes:       'bg-[#FFCAB3] text-gray-800',
  Education:     'bg-yellow-100 text-gray-800',
  Nutrition:     'bg-[#B3E5C9] text-gray-800',
  Lifestyle:     'bg-[#FFCAB3] text-gray-800',
  Uncategorized: 'bg-gray-100 text-gray-700',
};

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const posts: WPPost[] = await getPosts(100);
    return posts.map((p: WPPost) => ({ slug: p.slug }));
  } catch (error) {
    console.warn('Failed to fetch posts for static generation:', error);
    return []; // возвращаем пустой массив, страницы будут генерироваться динамически
  }
}
export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post: WPPost | null = await getPostBySlug(slug);

  if (!post) return notFound();

  const category = getPostCategory(post);
  const tags: WPTerm[] = getPostTags(post);

  // Похожие посты той же категории
  const allPosts: WPPost[] = await getPosts(20);
  const related: WPPost[] = allPosts
    .filter((p: WPPost) => p.slug !== slug && getPostCategory(p) === category)
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-white mt-40">
      <div className="px-4 sm:px-6 lg:px-15 py-8 sm:py-12 lg:py-16 mt-8 sm:mt-12 lg:mt-16">

        {/* Back */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors mb-10 group font-medium"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform duration-200" />
          Back to Blog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10 lg:gap-16 items-start">

          {/* Article */}
          <article>

            {/* Hero image */}
            <div className="relative w-full h-64 sm:h-80 md:h-[420px] rounded-2xl sm:rounded-3xl overflow-hidden mb-8">
              <Image
                src={getPostImage(post)}
                alt={post.title.rendered}
                fill
                sizes="(max-width: 1024px) 100vw, 70vw"
                className="object-cover"
                priority
                unoptimized
              />
            </div>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${CATEGORY_COLORS[category] ?? 'bg-gray-100 text-gray-700'}`}>
                {category}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-400">
                <Calendar size={12} /> {formatDate(post.date)}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-400">
                <Clock size={12} /> {readTime(post)}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
              {post.title.rendered}
            </h1>

            {/* Excerpt lead */}
            <p className="text-base sm:text-lg text-gray-500 leading-relaxed mb-8 border-l-4 border-[#B3E5C9] pl-5">
              {stripHtml(post.excerpt.rendered)}
            </p>

            {/* WP HTML content */}
            <div
              className="prose prose-sm sm:prose-base max-w-none text-gray-700 leading-[1.9]
                prose-headings:font-bold prose-headings:text-gray-900
                prose-a:text-black prose-a:underline prose-a:underline-offset-2
                prose-blockquote:border-l-4 prose-blockquote:border-[#B3E5C9] prose-blockquote:pl-4 prose-blockquote:text-gray-500
                prose-img:rounded-2xl prose-img:w-full"
              dangerouslySetInnerHTML={{ __html: post.content.rendered }}
            />

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-gray-100">
                {tags.map((tag: WPTerm) => (
                  <span
                    key={tag.slug}
                    className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full"
                  >
                    #{tag.slug}
                  </span>
                ))}
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="flex flex-col gap-6">

            {/* About */}
            <div className="bg-[#B3E5C9] rounded-2xl p-6">
              <p className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-3">About the blog</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                Tips, recipes and stories from the world of organic living — written for curious, health-conscious people.
              </p>
            </div>

            {/* Related posts */}
            {related.length > 0 && (
              <div>
                <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-5">Related Articles</p>
                <div className="flex flex-col gap-4">
                  {related.map((p: WPPost) => (
                    <Link key={p.id} href={`/blog/${p.slug}`}>
                      <div className="group flex gap-4 items-start">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image
                            src={getPostImage(p)}
                            alt={p.title.rendered}
                            fill
                            sizes="64px"
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-400 mb-1">{formatDate(p.date)}</p>
                          <h4 className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-yellow-500 transition-colors leading-snug">
                            {p.title.rendered}
                          </h4>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Shop CTA */}
            <div className="bg-[#FFCAB3] rounded-2xl p-6 flex flex-col gap-4">
              <p className="text-xs font-bold tracking-widest text-gray-500 uppercase">Shop Organic</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                Put these tips into practice — browse our curated range of organic products.
              </p>
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white text-xs font-bold rounded-full hover:bg-gray-900 active:scale-95 transition-all duration-300 w-fit"
              >
                Visit Shop
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

          </aside>
        </div>

        {/* Bottom CTA */}
        <div className="flex justify-center mt-16 sm:mt-20">
          <Link
            href="/blog"
            className="group w-full sm:w-auto sm:min-w-80 border border-black rounded-full flex items-center justify-between pl-6 sm:pl-8 pr-2 py-2 sm:py-3 transition-all duration-300 ease-out hover:bg-black hover:text-white hover:shadow-xl active:scale-95"
          >
            <span className="text-sm sm:text-base font-bold tracking-wide">More Articles</span>
            <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-black flex items-center justify-center group-hover:bg-white transition-all duration-300 group-hover:scale-110 flex-shrink-0">
              <ArrowRight className="text-white group-hover:text-black transition-all duration-300 group-hover:translate-x-1" size={20} strokeWidth={2.5} />
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}