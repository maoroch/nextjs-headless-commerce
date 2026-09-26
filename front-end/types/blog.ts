// Структура поста — близко к WordPress REST API (wp/v2/posts)
// При интеграции с WP поля будут маппиться: title.rendered, excerpt.rendered, content.rendered и т.д.
export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
  featured: boolean;
  tags: string[];
  content: string[]; // параграфы; при WP интеграции заменится на HTML-строку content.rendered
}