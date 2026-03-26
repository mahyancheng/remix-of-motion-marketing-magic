import { useParams, Link, Navigate } from 'react-router-dom';
import { useContent } from '@/contexts/ContentContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Cover } from '@/components/ui/cover';
import { Calendar, User, ArrowLeft, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Navbar } from './Index';
import Footer from './Footer'; // 引入通用的 Footer 保持风格一致

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const { blogPosts } = useContent();
  
  // 查找对应的文章
  const post = blogPosts.find(p => p.id === id);
  
  // 🚀 核心修复：处理 Firebase 异步加载状态
  // 如果当前没有找到文章，但 blogPosts 也是空的，说明可能正在加载中，先显示加载骨架/提示
  if (!post) {
    if (blogPosts.length === 0) {
      return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            <p className="text-muted-foreground">Loading article...</p>
          </div>
        </div>
      );
    }
    // 如果 blogPosts 有数据，但还是没找到这篇文章，说明 ID 错误，踢回列表页
    return <Navigate to="/blog/" replace />;
  }

  // 格式化段落，过滤掉纯空行，防止多余的大量留白
  const formattedContent = post.content
    .split('\n')
    .map(p => p.trim())
    .filter(p => p.length > 0);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      {/* 顶部 Hero 区域 */}
      {post.imageUrl ? (
        <div className="relative h-[40vh] md:h-[50vh] overflow-hidden mt-16">
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>
      ) : (
        <div className="mt-24" /> // 无图时的顶部占位
      )}

      {/* 文章主体 */}
      <article className="max-w-4xl mx-auto px-4 py-12 flex-grow w-full relative z-10 -mt-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
        >
          {/* 返回按钮 */}
          <Link to="/blog/" className="inline-flex items-center text-accent hover:text-accent/80 mb-8 transition-colors font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Articles
          </Link>

          {/* 标签 */}
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags?.map((tag) => (
              <Badge key={tag} className="bg-accent/10 text-accent border-accent/20 text-sm py-1 px-3">
                {tag}
              </Badge>
            ))}
          </div>

          {/* 标题 */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-6 leading-tight tracking-tight">
            {post.title}
          </h1>

          {/* 元数据与分享 */}
          <div className="flex flex-wrap items-center justify-between gap-6 mb-10 pb-8 border-b border-border text-muted-foreground">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-accent" />
                <span className="font-medium text-foreground">{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-accent" />
                <span>
                  {post.publishedAt instanceof Date 
                    ? post.publishedAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                    : new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="border-border hover:bg-accent/10 hover:text-accent hover:border-accent/30 transition-all"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: post.title, text: post.excerpt, url: window.location.href }).catch(console.error);
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!'); // 简单降级提示
                }
              }}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Article
            </Button>
          </div>

          {/* 摘要引用 */}
          {post.excerpt && (
            <div className="bg-secondary/50 border-l-4 border-accent rounded-r-lg p-6 mb-10">
              <p className="text-xl text-foreground font-medium leading-relaxed italic">
                "{post.excerpt}"
              </p>
            </div>
          )}

          {/* 正文内容 */}
          <div className="prose prose-lg prose-invert max-w-none mb-16">
            {formattedContent.map((paragraph, index) => (
              <p key={index} className="text-muted-foreground leading-relaxed mb-6">
                {paragraph}
              </p>
            ))}
          </div>

          {/* CTA 区块 */}
          <div className="mt-16 bg-gradient-to-br from-secondary via-background to-accent/5 border border-border rounded-2xl p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 shadow-lg">
            <div className="max-w-xl">
              <h3 className="text-2xl md:text-3xl font-bold font-display mb-4">
                Ready to <Cover>Transform</Cover> Your Lead Generation?
              </h3>
              <p className="text-muted-foreground text-lg">
                Stop leaving money on the table. Automate your sales funnel and start closing more deals with Leadzap today.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link to="/contact/">
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8 py-6 rounded-full shadow-xl hover:shadow-accent/20 transition-all">
                  Get Free Demo
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </article>

      {/* 相关文章 */}
      {blogPosts.length > 1 && (
        <section className="py-20 bg-secondary/30 border-t border-border">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold font-display mb-10">More Growth Insights</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {blogPosts
                .filter(p => p.id !== post.id)
                .slice(0, 2)
                .map((relatedPost) => (
                  <Link key={relatedPost.id} to={`/blog/${relatedPost.id}/`} className="group">
                    <div className="h-full bg-background border border-border rounded-xl overflow-hidden hover:border-accent transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                      {relatedPost.imageUrl && (
                        <div className="aspect-video overflow-hidden">
                          <img 
                            src={relatedPost.imageUrl} 
                            alt={relatedPost.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex flex-wrap gap-2 mb-4">
                          {relatedPost.tags?.slice(0, 2).map((tag) => (
                            <Badge key={tag} className="text-[10px] bg-accent/10 text-accent uppercase tracking-wider">{tag}</Badge>
                          ))}
                        </div>
                        <h3 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                        <div className="text-xs text-muted-foreground font-medium">
                          {new Date(relatedPost.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* 使用全局统一的 Footer */}
      <Footer />
    </div>
  );
}