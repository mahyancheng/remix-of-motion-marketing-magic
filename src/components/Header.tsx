import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useOrder } from "@/contexts/OrderContext";
import { RulerCarousel, type CarouselItem } from "@/components/ui/ruler-carousel";

// ==========================================
// 🚀 性能优化：将静态导航菜单提取到组件外部
// 确保引用地址唯一，避免滚动时重复创建导致内存波动
// ==========================================
const CAROUSEL_ITEMS: CarouselItem[] = [
  { id: 1, title: "Overview" },
  { id: 2, title: "Orders" },
  { id: 3, title: "Inventory" },
  { id: 4, title: "Customers" },
  { id: 5, title: "Automation" },
  { id: 6, title: "Reports" },
];

const Header = () => {
  const { activeSection } = useOrder(); // 接入当前的活跃章节 ID
  const [scrolled, setScrolled] = useState(false);
  
  // 监听滚动，决定是否切换 Header 背景样式及显示分段导航
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 🚀 性能优化：使用 useCallback 缓存滚动函数
  // 避免将此函数作为 Prop 传给 RulerCarousel 时导致其不必要的重渲染
  const scrollToSection = useCallback((id: number) => {
    const section = document.getElementById(`section-${id}`);
    if (section) {
      // 这里的偏移量可根据 Header 高度微调
      const yOffset = -80; 
      const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-background/90 backdrop-blur-sm shadow-sm py-2" 
          : "bg-transparent py-4"
      }`}
    >
      <div className="container flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="text-xl font-display font-bold text-accent tracking-tight hover:opacity-80 transition-opacity"
          >
            OrderFlow <span className="text-foreground">Demo</span>
          </Link>
          
          {/* 右侧可以放置联系按钮或菜单图标 */}
          <div className="flex items-center gap-4">
            <Link to="/contact" className="text-sm font-medium hover:text-accent transition-colors">
              Support
            </Link>
          </div>
        </div>

        {/* 当页面滚动超过 50px 时显示刻度盘导航 */}
        {scrolled && (
          <div className="hidden md:block animate-in fade-in slide-in-from-top-1 duration-300">
            <RulerCarousel
              originalItems={CAROUSEL_ITEMS}
              onSelect={(item) => scrollToSection(item.id)}
              activeId={activeSection} // 实时高亮当前滚动到的位置
            />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;