import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoveRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Cover } from "@/components/ui/cover";
import { Link } from "react-router-dom";

interface AnimatedHeroProps {
  badge?: string;
  titlePrefix?: string;
  rotatingWords?: string[];
  description?: string;
  primaryCTA?: { label: string; href: string };
  secondaryCTA?: { label: string; href: string };
}

// 提取默认值到外部，确保内存地址稳定，杜绝父组件内联带来的无限死循环
const DEFAULT_WORDS = ["automating", "scaling", "winning", "growing", "thriving"];
const DEFAULT_PRIMARY = { label: "Get Free Consultation", href: "/contact/" };
const DEFAULT_SECONDARY = { label: "See How It Works", href: "/custom-software/" };

function AnimatedHero({
  badge = "We build systems that print money",
  titlePrefix = "Your competitors are",
  rotatingWords = DEFAULT_WORDS,
  description = "Every hour your team wastes on manual processes is an hour your competitor uses to serve more customers, make fewer errors, and grow faster. We build custom software that ends the chaos.",
  primaryCTA = DEFAULT_PRIMARY,
  secondaryCTA = DEFAULT_SECONDARY,
}: AnimatedHeroProps) {
  const [titleNumber, setTitleNumber] = useState(0);

  // 🚀 性能优化（如果父组件未提取常量）
  // 确保 map 循环使用的词数组引用地址锁定
  const memoizedRotatingWords = useMemo(() => rotatingWords, [rotatingWords]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // 🚨 修复死循环：使用状态更新回调，避免 timeout 重复执行，彻底掐断死循环的可能。
      setTitleNumber((prev) => (prev + 1) % memoizedRotatingWords.length);
    }, 1200);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, memoizedRotatingWords.length]); // 监听索引和长度，不监听引用

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col w-full min-w-0">
          
          {/* Badge 部分 */}
          <div className="w-full max-w-full min-w-0 flex justify-center px-1">
            <Button
              variant="secondary"
              size="sm"
              className="h-auto min-h-9 max-w-full w-full gap-2 py-2.5 rounded-full sm:w-auto px-6"
            >
              <span className="break-words font-medium">{badge}</span>
              <SparklesIcon className="h-4 w-4 shrink-0 text-accent" />
            </Button>
          </div>
          
          {/* Main Title Area */}
          <div className="flex gap-2 flex-col items-center w-full">
            <h1 className="text-4xl sm:text-5xl md:text-7xl max-w-4xl tracking-tighter text-center font-black flex flex-col items-center leading-tight">
              
              {/* 🚨 核心修复：将上方前缀改为金色/黄色 text-accent */}
              <span className="text-accent">{titlePrefix}</span>
              
              <span className="relative inline-flex items-center justify-center overflow-hidden w-full h-[1.1em] md:h-[1.2em]">
                &nbsp;
                <AnimatePresence mode="popLayout">
                  {memoizedRotatingWords.map((word, index) => (
                    titleNumber === index && (
                      <motion.span
                        key={word}
                        // 🚨 核心修复：将转动的词改为白色 text-foreground
                        className="absolute font-semibold text-foreground text-2xl sm:text-3xl md:text-5xl tracking-normal whitespace-nowrap"
                        initial={{ opacity: 0, y: 30 }}  // 初始位置：从下方滑入
                        animate={{ opacity: 1, y: 0 }}   // 滚入原位
                        exit={{ opacity: 0, y: -30 }}    // 退出位置：向后滚出上方
                        transition={{
                          y: { type: "spring", stiffness: 350, damping: 25 },
                          opacity: { duration: 0.2 },
                        }}
                      >
                        {word.toUpperCase()}
                      </motion.span>
                    )
                  ))}
                </AnimatePresence>
              </span>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center mt-4">
              {description}
            </p>
          </div>
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-center mt-6">
            <Link to={secondaryCTA.href} className="w-full sm:w-auto">
              <Button size="xl" className="gap-4 w-full sm:w-auto" variant="outline">
                {secondaryCTA.label} <MoveRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to={primaryCTA.href} className="w-full sm:w-auto">
              <Cover variant="button">
                <Button size="xl" className="gap-4 w-full sm:w-auto">
                  <PhoneCall className="w-4 h-4" />
                  {primaryCTA.label}
                </Button>
              </Cover>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}

export { AnimatedHero };