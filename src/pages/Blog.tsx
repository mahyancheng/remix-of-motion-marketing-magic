import { Link } from 'react-router-dom';
import HeroBackground from "@/components/HeroBackground";
import { useContent } from '@/contexts/ContentContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight, User } from 'lucide-react';
import { m } from 'framer-motion';
import { Navbar } from './Index';
import Footer from "./Footer";
import { AnimatedHero } from "@/components/ui/animated-hero";
import { Cover } from "@/components/ui/cover";
import SEO from "@/components/SEO";
import { getBlogSchema } from '@/lib/schema';

// ✅ 修改1: Hero 内容改成有关键词的版本
const HERO_ROTATING_WORDS = ["SEO Tips", "Google Ads Guides", "Growth Insights", "Marketing Strategies"];
const HERO_PRIMARY_CTA = { label: "Get Free SEO Consultation", href: "/contact/" };
const HERO_SECONDARY_CTA = { label: "View Our Services", href: "/#services" };

export default function LeadzapBlog() {
  const { blogPosts, getFeaturedPost } = useContent();
  const featuredPost = getFeaturedPost();

  // ✅ 修改2: Schema name 统一与 SEO title 一致

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ✅ 修改3: Title 缩短到63字符，去掉 Sdn Bhd */}
      <SEO
        title="Digital Marketing Blog Malaysia | SEO Tips | Leadzap Marketing"
        description="Expert SEO tips, Google Ads strategies, and digital marketing guides for Malaysian businesses. Learn how to grow your business online."
        path="/blog/"
        schema={getBlogSchema(blogPosts)}      />

      <Navbar />

      {/* ✅ 修改4: H1、badge、description 全部改成有关键词的内容 */}
      <header className="hero-gradient relative overflow-hidden">
        <HeroBackground />
        <div className="relative z-10">
          <AnimatedHero
            badge="Malaysia's Digital Marketing Knowledge Hub"
            titlePrefix="Malaysia Digital Marketing Blog for"
            rotatingWords={HERO_ROTATING_WORDS}
            description="Expert SEO tips, Google Ads strategies, and digital marketing guides for Malaysian businesses. Learn how to grow your business online."
            primaryCTA={HERO_PRIMARY_CTA}
            secondaryCTA={HERO_SECONDARY_CTA}
            breadcrumbs={[{ label: "Blog" }]}
          />
        </div>
      </header>

      {/* Featured Section */}
      {featuredPost && (
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <m.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold font-display mb-8 text-center">Featured Article</h2>
              <Link to={`/blog/${featuredPost.slug}/`} className="group">
                <div className="bg-secondary rounded-2xl overflow-hidden border border-border hover:border-accent transition-all duration-300 hover:-translate-y-2">
                  <div className="grid md:grid-cols-2 gap-0">
                    {featuredPost.imageUrl && (
                      <div className="overflow-hidden [aspect-ratio:16/9] group/image">
                        {/* ✅ 修改5: 首屏封面图改为 eager 加载，提升 LCP 分数 */}
                        <img
                          src={featuredPost.imageUrl}
                          alt={featuredPost.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover/image:scale-105"
                          loading="eager"
                          width="800"
                          height="450"
                        />
                      </div>
                    )}
                    <div className="p-8 flex flex-col justify-center">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {featuredPost.tags?.map((tag) => (
                          <Badge key={tag} className="bg-accent/20 text-accent border-accent/30">{tag}</Badge>
                        ))}
                      </div>
                      <h3 className="text-3xl font-bold font-display mb-4 group-hover:text-accent transition-colors">
                        {featuredPost.title}
                      </h3>
                      <p className="text-muted-foreground mb-6 text-lg leading-relaxed line-clamp-3">
                        {featuredPost.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{featuredPost.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(featuredPost.publishedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Button variant="ghost" className="group/btn p-0 h-auto font-semibold text-accent hover:text-accent/80 w-fit">
                        Read Full Article
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            </m.div>
          </div>
        </section>
      )}

      {/* Latest Articles Grid */}
      <section className="py-16 bg-secondary/50">
        <div className="max-w-6xl mx-auto px-4">
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold font-display mb-12 text-center">Latest Articles</h2>

            {blogPosts.length === 0 ? (
              <div className="text-center py-20 bg-background rounded-2xl border border-dashed border-border">
                <p className="text-muted-foreground text-lg mb-2">No articles published yet.</p>
                <p className="text-sm text-muted-foreground/60">
                  Once you add posts in your admin dashboard, they will appear here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.filter(post => !post.featured).map((post, index) => (
                  <m.div
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Link to={`/blog/${post.slug}/`} className="group">
                      <Card className="h-full bg-background border-border hover:border-accent transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                        {post.imageUrl && (
                          <div className="overflow-hidden rounded-t-lg aspect-video">
                            <img
                              src={post.imageUrl}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                              width="400"
                              height="225"
                            />
                          </div>
                        )}
                        <CardHeader>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {post.tags?.map((tag) => (
                              <Badge key={tag} className="text-[10px] bg-accent/10 text-accent border-accent/20 uppercase">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <CardTitle className="text-xl mb-2 group-hover:text-accent transition-colors line-clamp-2">
                            {post.title}
                          </CardTitle>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              <span>{post.author}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground mb-4 line-clamp-3 text-sm">{post.excerpt}</p>
                          <Button variant="ghost" className="group/btn p-0 h-auto text-sm font-bold text-accent">
                            View Article
                            <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  </m.div>
                ))}
              </div>
            )}
          </m.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-transparent to-accent/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <m.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold font-display mb-6">
              Ready to grow your business with <Cover>Digital Marketing?</Cover>
            </h2>
            {/* ✅ 修改6: 去掉虚假数字，改成真实描述 */}
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Get expert digital marketing insights and a free consultation from Malaysia's trusted digital marketing agency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* ✅ 修改7: 链接加上结尾斜杠 */}
              <Link to="/contact/">
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-10 py-6 rounded-full shadow-lg hover:shadow-accent/20 transition-all">
                  Get Free Consultation
                </Button>
              </Link>
            </div>
          </m.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}