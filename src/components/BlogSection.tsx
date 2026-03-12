import { motion } from "framer-motion";
import { useContent, BlogPost } from "@/contexts/ContentContext";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface BlogSectionProps {
  tags: string[];
  title?: string;
  subtitle?: string;
}

const BlogSection = ({ tags, title = "Latest Insights", subtitle = "Stay updated with our latest blog posts and industry insights" }: BlogSectionProps) => {
  const { blogPosts } = useContent();

  const filteredPosts = blogPosts.filter(post =>
    post.tags.some(tag =>
      tags.some(filterTag =>
        tag.toLowerCase().includes(filterTag.toLowerCase()) ||
        filterTag.toLowerCase().includes(tag.toLowerCase())
      )
    )
  ).slice(0, 3);

  if (filteredPosts.length === 0) {
    return null;
  }

  return (
    <div className="py-16">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4 text-foreground">{title}</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, index) => (
            <motion.article
              key={post.id}
              className="bg-secondary rounded-xl overflow-hidden shadow-lg hover:shadow-xl hover:border-accent transition-all duration-300 border border-border"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              viewport={{ once: true }}
            >
              {post.imageUrl && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <time dateTime={post.publishedAt.toISOString()}>
                      {post.publishedAt.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </time>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{post.author}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold font-display mb-3 text-foreground transition-colors">
                  <Link to={`/blog/${post.id}`} className="line-clamp-2">
                    {post.title}
                  </Link>
                </h3>

                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="bg-accent/10 text-accent text-xs px-2 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    to={`/blog/${post.id}`}
                    className="text-accent hover:text-accent/80 transition-colors flex items-center gap-1 text-sm font-medium"
                  >
                    Read More
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {filteredPosts.length > 0 && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-md font-medium hover:bg-accent/90 transition-colors"
            >
              View All Articles
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BlogSection;