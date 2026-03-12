import { useParams, Link, Navigate } from 'react-router-dom';
import { useContent } from '@/contexts/ContentContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Cover } from '@/components/ui/cover';
import { Calendar, User, ArrowLeft, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Navbar } from './Index';

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const { blogPosts } = useContent();
  
  const post = blogPosts.find(p => p.id === id);
  
  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {post.imageUrl && (
        <div className="relative h-96 overflow-hidden">
          <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
        </div>
      )}

      <article className="max-w-4xl mx-auto px-4 py-12 pt-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-accent/20 text-accent border-accent/30">
                {tag}
              </Badge>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold font-display mb-6 leading-tight">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-6 mb-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{post.publishedAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <Button 
              variant="ghost" size="sm" 
              className="text-muted-foreground hover:text-accent p-0"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: post.title, text: post.excerpt, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                }
              }}
            >
              <Share2 className="w-4 h-4 mr-1" />Share
            </Button>
          </div>

          <div className="bg-secondary border border-border rounded-lg p-6 mb-8">
            <p className="text-xl text-muted-foreground italic leading-relaxed">{post.excerpt}</p>
          </div>

          <div className="prose prose-lg prose-invert max-w-none">
            {post.content.split('\n').map((paragraph, index) => (
              <p key={index} className="text-muted-foreground leading-relaxed mb-6 text-lg">{paragraph}</p>
            ))}
          </div>

          <div className="mt-12 bg-gradient-to-r from-accent/10 to-transparent border border-accent/20 rounded-lg p-8">
            <h3 className="text-2xl font-bold font-display mb-4 text-accent">Ready to Transform Your Marketing?</h3>
            <p className="text-muted-foreground mb-6">
              Don't let your competitors get ahead. Contact us today for a free consultation and discover how our proven strategies can accelerate your business growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/contact">
                <Cover variant="button">
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-medium">Get Free Consultation</Button>
                </Cover>
              </Link>
              <Link to="/blog">
                <Button variant="outline" className="border-border text-muted-foreground hover:bg-secondary">Read More Articles</Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </article>

      <section className="py-16 bg-secondary">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold font-display mb-8 text-center">Related Articles</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {blogPosts.filter(p => p.id !== post.id).slice(0, 2).map((relatedPost) => (
              <Link key={relatedPost.id} to={`/blog/${relatedPost.id}`} className="group">
                <div className="bg-background border border-border rounded-lg overflow-hidden hover:border-accent/30 transition-all duration-300">
                  {relatedPost.imageUrl && (
                    <div className="aspect-video overflow-hidden">
                      <img src={relatedPost.imageUrl} alt={relatedPost.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex flex-wrap gap-1 mb-3">
                      {relatedPost.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs bg-accent/20 text-accent">{tag}</Badge>
                      ))}
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors">{relatedPost.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{relatedPost.excerpt}</p>
                    <div className="text-sm text-muted-foreground">{relatedPost.publishedAt.toLocaleDateString()}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 Leadzap Marketing. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}