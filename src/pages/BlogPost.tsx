import { useParams, Link, Navigate } from 'react-router-dom';
import { useContent } from '@/contexts/ContentContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Cover } from '@/components/ui/cover';
import { Calendar, User, ArrowLeft, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Navbar } from './Index';
import Footer from './Footer';
import { toast } from 'sonner'; // ✅ 修改1: 用 toast 替代 alert

import SEO from "@/components/SEO";
import PageBreadcrumb from "@/components/PageBreadcrumb";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { blogPosts } = useContent();

  const post = blogPosts.find(p => p.slug === slug);

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
    return <Navigate to="/blog/" replace />;
  }

  // ✅ 修改2: SEO Title 截断逻辑，防止超过 60 字符
  const seoTitle = post.title.length > 40
    ? `${post.title.substring(0, 37)}... | Leadzap`
    : `${post.title} | Leadzap Marketing`;

  // ✅ 修改3: Meta Description 限制在 155 字符以内
  const seoDescription = post.excerpt
    ? post.excerpt.substring(0, 155) + (post.excerpt.length > 155 ? '...' : '')
    : `Read our latest digital marketing insights on ${post.title}. Expert tips and guides for Malaysian businesses.`;

  // ✅ 修改4: Schema 加入 dateModified，去掉 console.log
  const articleSchemaData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": post.imageUrl ? [post.imageUrl] : [],
    "datePublished": new Date(post.publishedAt).toISOString(),
    "dateModified": new Date(post.publishedAt).toISOString(),
    "author": {
      "@type": "Person",
      "name": post.author || "Leadzap Marketing"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Leadzap Marketing",
      "logo": {
        "@type": "ImageObject",
        "url": "https://leadzap.com.my/assets/Logo-BtIJ7fab.webp"
      }
    },
    "description": seoDescription,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://leadzap.com.my/blog/${post.slug}/`
    }
  };

  const isHtmlContent = /<\/?[a-zA-Z][^>]*>/.test(post.content);

  // ✅ 修改5: 删除 console.log，只在 development 环境输出
  if (process.env.NODE_ENV === 'development') {
    console.log('[BlogPost] isHtmlContent:', isHtmlContent);
    console.log('[BlogPost] content preview:', post.content?.slice(0, 200));
  }

  const formattedContent = post.content
    .split('\n')
    .map(p => p.trim())
    .filter(p => p.length > 0);

  // ✅ 修改6: Share 功能用 toast 替代 alert
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        toast.success('Link copied to clipboard!');
      }).catch(() => {
        toast.error('Failed to copy link. Please copy manually.');
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">

      <SEO
        title={seoTitle}
        description={seoDescription}
        path={`/blog/${post.slug}/`}
        type="article"
        image={post.imageUrl || undefined}
        schema={articleSchemaData}
      />

      <Navbar />

      {/* 顶部封面图 */}
      {post.imageUrl ? (
        <div className="relative h-[40vh] md:h-[50vh] overflow-hidden mt-16">
          {/* ✅ 修改7: 加入 fetchPriority="high" 提升 LCP 分数 */}
          <img
            src={post.imageUrl}
            alt={post.title || 'Blog article cover image'}
            className="w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <Link
            to="/blog/"
            className="absolute bottom-4 left-4 md:left-8 z-10 inline-flex items-center text-accent hover:text-accent/80 transition-colors font-medium text-sm bg-background/60 backdrop-blur-sm rounded-full px-4 py-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Articles
          </Link>
        </div>
      ) : (
        <div className="mt-24" />
      )}

      <div className="relative z-20 mt-4">
        <PageBreadcrumb items={[{ label: "Blog", href: "/blog/" }, { label: post.title }]} />
      </div>

      {/* 文章主体 */}
      <article className="max-w-4xl mx-auto px-4 py-8 flex-grow w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >

          {/* 标签 */}
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags?.map((tag) => (
              <Badge key={tag} className="bg-accent/10 text-accent border-accent/20 text-sm py-1 px-3">
                {tag}
              </Badge>
            ))}
          </div>

          {/* H1 标题 */}
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

            {/* ✅ 修改8: 使用 handleShare 函数，toast 替代 alert */}
            <Button
              variant="outline"
              size="sm"
              className="border-border hover:bg-accent/10 hover:text-accent hover:border-accent/30 transition-all"
              onClick={handleShare}
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
          {isHtmlContent ? (
            <div
              className="blog-content prose prose-lg prose-invert max-w-none mb-16
                prose-headings:text-foreground prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight
                prose-h1:text-4xl prose-h1:mt-14 prose-h1:mb-5
                prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4
                prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-3
                prose-h4:text-xl prose-h4:mt-8 prose-h4:mb-2
                prose-h5:text-lg prose-h5:mt-6 prose-h5:mb-2
                prose-h6:text-base prose-h6:mt-6 prose-h6:mb-2 prose-h6:uppercase prose-h6:tracking-wider
                prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4
                prose-a:text-accent prose-a:no-underline hover:prose-a:underline
                prose-strong:text-foreground
                prose-ul:text-muted-foreground prose-ul:my-4 prose-ul:pl-6 prose-ul:list-disc
                prose-ol:text-muted-foreground prose-ol:my-4 prose-ol:pl-6 prose-ol:list-decimal
                prose-li:text-muted-foreground prose-li:my-1 prose-li:leading-relaxed
                prose-blockquote:border-accent prose-blockquote:text-muted-foreground prose-blockquote:bg-secondary/30 prose-blockquote:rounded-r-lg prose-blockquote:py-2 prose-blockquote:px-4
                prose-img:rounded-xl prose-img:shadow-lg
                prose-code:text-accent prose-pre:bg-secondary prose-pre:border prose-pre:border-border
                prose-table:w-full prose-table:border-collapse prose-table:my-6
                prose-th:bg-secondary prose-th:text-foreground prose-th:font-semibold prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:border prose-th:border-border
                prose-td:px-4 prose-td:py-3 prose-td:border prose-td:border-border prose-td:text-muted-foreground
                prose-tr:even:bg-secondary/20
                prose-hr:border-border prose-hr:my-8"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          ) : (
            <div className="prose prose-lg prose-invert max-w-none mb-16">
              {formattedContent.map((paragraph, index) => (
                <p key={index} className="text-muted-foreground leading-relaxed mb-6">
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          {/* ✅ 修改9: CTA 标题从 H3 改成 H2，语义更正确 */}
          <div className="mt-16 bg-gradient-to-br from-secondary via-background to-accent/5 border border-border rounded-2xl p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 shadow-lg">
            <div className="max-w-xl">
              <h2 className="text-2xl md:text-3xl font-bold font-display mb-4">
                Ready to <Cover>Transform</Cover> Your Digital Marketing?
              </h2>
              <p className="text-muted-foreground text-lg">
                Get a free consultation from Malaysia's trusted digital marketing agency. SEO, Google Ads, Social Media — we do it all.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link to="/contact/">
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8 py-6 rounded-full shadow-xl hover:shadow-accent/20 transition-all">
                  Get Free Consultation
                </Button>
              </Link>
            </div>
          </div>

        </motion.div>
      </article>

      {/* ✅ 修改10: 相关文章标题加入关键词，图片加备用 alt */}
      {blogPosts.length > 1 && (
        <section className="py-20 bg-secondary/30 border-t border-border">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold font-display mb-10">
              More Digital Marketing Articles
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {blogPosts
                .filter(p => p.id !== post.id)
                .slice(0, 2)
                .map((relatedPost) => (
                  <Link key={relatedPost.id} to={`/blog/${relatedPost.slug}/`} className="group">
                    <div className="h-full bg-background border border-border rounded-xl overflow-hidden hover:border-accent transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                      {relatedPost.imageUrl && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={relatedPost.imageUrl}
                            // ✅ 修改11: 加备用 alt text 防止空值
                            alt={relatedPost.title || 'Related digital marketing article'}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex flex-wrap gap-2 mb-4">
                          {relatedPost.tags?.slice(0, 2).map((tag) => (
                            <Badge key={tag} className="text-[10px] bg-accent/10 text-accent uppercase tracking-wider">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <h3 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                        <div className="text-xs text-muted-foreground font-medium">
                          {new Date(relatedPost.publishedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}