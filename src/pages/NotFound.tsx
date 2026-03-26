"use client";

import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // 仅在开发环境下记录，或者你可以接入类似 Sentry 的日志系统
    console.error(
      "404 Error: Path not found ->",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        {/* 视觉图标 */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="absolute inset-0 bg-accent/20 blur-3xl rounded-full"
            />
            <AlertCircle className="h-24 w-24 text-accent relative z-10" />
          </div>
        </div>

        <h1 className="text-7xl font-black font-display mb-2 tracking-tighter">404</h1>
        <h2 className="text-2xl font-bold mb-4">Lost in the System?</h2>
        
        <p className="text-muted-foreground mb-10 leading-relaxed">
          The page you are looking for <code className="text-accent bg-accent/10 px-1 rounded">{location.pathname}</code> does not exist or has been moved to a new coordinate.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {/* 使用 useNavigate 实现不刷新的后退 */}
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => navigate(-1)}
            className="gap-2 border-border hover:bg-secondary"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>

          {/* 使用 Link 实现不刷新的跳转 */}
          <Link to="/">
            <Button size="lg" className="gap-2 w-full sm:w-auto shadow-lg shadow-accent/10">
              <Home className="h-4 w-4" />
              Return Home
            </Button>
          </Link>
        </div>

        {/* 底部装饰 */}
        <div className="mt-16 pt-8 border-t border-border/50 text-xs text-muted-foreground tracking-widest uppercase">
          Leadzap Digital Infrastructure
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;