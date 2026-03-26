import { Link } from 'react-router-dom';
import HeroBackground from "@/components/HeroBackground";
import { useContent } from '@/contexts/ContentContext'; 
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { Navbar } from './Index';
import Footer from "./Footer";
import { AnimatedHero } from "@/components/ui/animated-hero";
import { Cover } from "@/components/ui/cover";

const HERO_ROTATING_WORDS = ["automated", "scalable", "high-converting", "intelligent"];
const HERO_PRIMARY_CTA = { label: "Start Free Trial", href: "/contact/" };
const HERO_SECONDARY_CTA = { label: "Explore Features", href: "/growth-hub/" };

export default function LeadzapBlog() {
  const { blogPosts, getFeaturedPost } = useContent();
  const featuredPost = getFeaturedPost();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <header className="hero-gradient relative overflow-hidden">
        <HeroBackground />
        <div className="relative z-10">
          <AnimatedHero
            badge="Master the Art of Lead Generation"
            titlePrefix="Lead generation that is"
            rotatingWords={HERO_ROTATING_WORDS}
            description="Unlock the secrets to high-quality leads. Expert guides and data-driven tactics for modern sales teams."
            primaryCTA={HERO_PRIMARY_CTA}
            secondaryCTA={HERO_SECONDARY_CTA}
          />
        </div>
      </header>

      {/* Featured Section */}
      {featuredPost && (
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
              <h2 className="text-3xl font-bold font-display mb-8 text-center">Featured Strategy</h2>
              <Link to={`/blog/${featuredPost.id}/`} className="group">
                <div className="bg-secondary rounded-2xl overflow-hidden border border-border hover:border-accent transition-all duration-300 hover:-translate-y-2">
                  <div className="grid md:grid-cols-2 gap-0">
                    {featuredPost.imageUrl && (
                      <div className="overflow-hidden [aspect-ratio:16/9] group/image">
                        <img src={featuredPost.imageUrl} alt={featuredPost.title} className="w-full h-full object-cover transition-transform duration-300 group-hover/image:scale-105" loading="lazy" />
                      </div>
                    )}
                    <div className="p-8 flex flex-col justify-center">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {featuredPost.tags?.map((tag) => (
                          <Badge key={tag} className="bg-accent/20 text-accent border-accent/30">{tag}</Badge>
                        ))}
                      </div>
                      <h3 className="text-3xl font-bold font-display mb-4 group-hover:text-accent transition-colors">{featuredPost.title}</h3>
                      <p className="text-muted-foreground mb-6 text-lg leading-relaxed line-clamp-3">{featuredPost.excerpt}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                        <div className="flex items-center gap-2"><User className="w-4 h-4" /><span>{featuredPost.author}</span></div>
                        <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /><span>{new Date(featuredPost.publishedAt).toLocaleDateString()}</span></div>
                      </div>
                      <Button variant="ghost" className="group/btn p-0 h-auto font-semibold text-accent hover:text-accent/80 w-fit">
                        Read Full Strategy<ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Latest Articles Grid */}
      <section className="py-16 bg-secondary/50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-bold font-display mb-12 text-center">Growth Resources</h2>
            
            {/* 🛠️ 新增：如果数据库没有数据，显示这个提示 */}
            {blogPosts.length === 0 ? (
              <div className="text-center py-20 bg-background rounded-2xl border border-dashed border-border">
                <p className="text-muted-foreground text-lg mb-2">No articles published yet.</p>
                <p className="text-sm text-muted-foreground/60">Once you add posts in your admin dashboard, they will appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.filter(post => !post.featured).map((post, index) => (
                  <motion.div key={post.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }}>
                    <Link to={`/blog/${post.id}/`} className="group">
                      <Card className="h-full bg-background border-border hover:border-accent transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                        {post.imageUrl && (
                          <div className="overflow-hidden rounded-t-lg aspect-video">
                            <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                          </div>
                        )}
                        <CardHeader>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {post.tags?.map((tag) => (
                              <Badge key={tag} className="text-[10px] bg-accent/10 text-accent border-accent/20 uppercase">{tag}</Badge>
                            ))}
                          </div>
                          <CardTitle className="text-xl mb-2 group-hover:text-accent transition-colors line-clamp-2">{post.title}</CardTitle>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1"><User className="w-3 h-3" /><span>{post.author}</span></div>
                            <div className="flex items-center gap-1"><Calendar className="w-3 h-3" /><span>{new Date(post.publishedAt).toLocaleDateString()}</span></div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground mb-4 line-clamp-3 text-sm">{post.excerpt}</p>
                          <Button variant="ghost" className="group/btn p-0 h-auto text-sm font-bold text-accent">
                            View Article<ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-transparent to-accent/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-bold font-display mb-6">Ready to skyrocket your <Cover>Conversion Rate?</Cover></h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join 5,000+ marketers getting weekly insights on automation and lead generation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <Link to="/contact">
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-10 py-6 rounded-full shadow-lg hover:shadow-accent/20 transition-all">
                    Subscribe Now
                  </Button>
               </Link>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}