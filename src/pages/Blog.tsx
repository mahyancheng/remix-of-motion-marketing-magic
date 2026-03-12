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


export default function Blog() {
  const { blogPosts, getFeaturedPost } = useContent();
  const featuredPost = getFeaturedPost();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <header className="hero-gradient relative overflow-hidden">
        <HeroBackground />
        <div className="relative z-10">
          <AnimatedHero
            badge="Learn from the best in digital marketing"
            titlePrefix="Marketing insights that are"
            rotatingWords={["actionable", "data-driven", "proven", "game-changing"]}
            description="Discover proven strategies, expert insights, and actionable tips to accelerate your digital marketing success."
            primaryCTA={{ label: "Get Free Consultation", href: "/contact" }}
            secondaryCTA={{ label: "View Our Services", href: "/growth-hub" }}
          />
        </div>
      </header>

      {featuredPost && (
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
              <h2 className="text-3xl font-bold font-display mb-8 text-center">Featured Article</h2>
              <Link to={`/blog/${featuredPost.id}`} className="group">
                <div className="bg-secondary rounded-2xl overflow-hidden border border-border hover:border-accent transition-all duration-300 hover:-translate-y-2">
                  <div className="grid md:grid-cols-2 gap-0">
                    {featuredPost.imageUrl && (
                      <div className="overflow-hidden [aspect-ratio:16/9] group/image">
                        <img src={featuredPost.imageUrl} alt={featuredPost.title} className="w-full h-full object-cover transition-transform duration-300 group-hover/image:scale-105 group-hover:scale-100" loading="lazy" />
                      </div>
                    )}
                    <div className="p-8 flex flex-col justify-center">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {featuredPost.tags.map((tag) => (
                          <Badge key={tag} className="bg-accent/20 text-accent border-accent/30">{tag}</Badge>
                        ))}
                      </div>
                      <h3 className="text-3xl font-bold font-display mb-4 group-hover:text-accent transition-colors">{featuredPost.title}</h3>
                      <p className="text-muted-foreground mb-6 text-lg leading-relaxed">{featuredPost.excerpt}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                        <div className="flex items-center gap-2"><User className="w-4 h-4" /><span>{featuredPost.author}</span></div>
                        <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /><span>{featuredPost.publishedAt.toLocaleDateString()}</span></div>
                      </div>
                      <Button variant="ghost" className="group/btn p-0 h-auto font-semibold text-accent hover:text-accent/80 w-fit">
                        Read Full Article
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      <section className="py-16 bg-secondary">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-bold font-display mb-12 text-center">Latest Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.filter(post => !post.featured).map((post, index) => (
                <motion.div key={post.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }}>
                  <Link to={`/blog/${post.id}`} className="group">
                    <Card className="group bg-background border-border hover:border-accent transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                      {post.imageUrl && (
                        <div className="overflow-hidden rounded-t-lg" style={{ aspectRatio: 16 / 9 }}>
                          <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {post.tags.map((tag) => (
                            <Badge key={tag} className="text-xs bg-accent/20 text-accent border-accent/30">{tag}</Badge>
                          ))}
                        </div>
                        <CardTitle className="text-xl mb-2 group-hover:text-accent transition-colors text-foreground">{post.title}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1"><User className="w-3 h-3" /><span>{post.author}</span></div>
                          <div className="flex items-center gap-1"><Calendar className="w-3 h-3" /><span>{post.publishedAt.toLocaleDateString()}</span></div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                        <Button variant="ghost" className="group/btn p-0 h-auto font-semibold text-accent hover:text-accent/80">
                          Read More
                          <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-accent/10 to-transparent">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-bold font-display mb-4">Don't fall behind — <Cover>Stay Updated</Cover></h2>
            <p className="text-xl text-muted-foreground mb-8">
              Get the latest marketing insights and strategies delivered to your inbox.
            </p>
            <Link to="/contact">
              <Cover variant="button">
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8 py-3">
                  Subscribe to Newsletter
                </Button>
              </Cover>
            </Link>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}