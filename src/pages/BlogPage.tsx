import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, User, ArrowRight } from "lucide-react";
import { BlogPost } from "@/types";
import { getBlogPosts } from "@/lib/database";
import { useAppSelector } from "@/lib/hooks";
import { formatDate } from "@/lib/utils";
import { LoadingSkeleton } from "@/components/ui/Loading";

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const language = useAppSelector((state) => state.language.current);

  useEffect(() => {
    async function fetchBlogPosts() {
      try {
        const data = await getBlogPosts(true); // Only published posts
        setPosts(data);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="container text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            {language === "en" ? "Blog & News" : "Tinklaraštis ir naujienos"}
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            {language === "en"
              ? "Stay updated with the latest trends, tips, and news from our store."
              : "Sekite naujausias tendencijas, patarimus ir naujienas iš mūsų parduotuvės."}
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16">
        <div className="container">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <LoadingSkeleton key={index} />
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => {
                const title = language === "en" ? post.title_en : post.title_lt;
                const excerpt =
                  language === "en" ? post.excerpt_en : post.excerpt_lt;

                return (
                  <article
                    key={post.id}
                    className="bg-white rounded-xl shadow-soft overflow-hidden card-hover"
                  >
                    {post.featured_image && (
                      <div className="relative h-48 bg-gray-200">
                        <Image
                          src={post.featured_image}
                          alt={title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{formatDate(post.created_at)}</span>
                        <User className="w-4 h-4 ml-4 mr-2" />
                        <span>
                          {language === "en" ? "Admin" : "Administratorius"}
                        </span>
                      </div>

                      <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                        {title}
                      </h2>

                      {excerpt && (
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {excerpt}
                        </p>
                      )}

                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors"
                      >
                        {language === "en" ? "Read More" : "Skaityti daugiau"}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {language === "en"
                  ? "No blog posts yet"
                  : "Kol kas nėra tinklaraščio įrašų"}
              </h3>
              <p className="text-gray-600">
                {language === "en"
                  ? "Check back soon for updates and news."
                  : "Netrukus tikitės naujienų ir atnaujinimų."}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
