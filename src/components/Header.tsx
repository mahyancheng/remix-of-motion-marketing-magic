import { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useOrder } from "@/contexts/OrderContext";
import { RulerCarousel, type CarouselItem } from "@/components/ui/ruler-carousel";

const Header = () => {
  const { activeSection } = useOrder();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  
  // 1. 创建一个 ref 来引用我们的 "哨兵" 元素
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 2. 如果哨兵不存在，直接返回
    if (!sentinelRef.current) return;

    // 3. 创建 IntersectionObserver，监听哨兵是否离开可视区域
    const observer = new IntersectionObserver(
      ([entry]) => {
        // 当哨兵不与视口相交时（即被滚出屏幕），说明滚动超过了哨兵的高度
        setScrolled(!entry.isIntersecting);
      },
      {
        root: null, // 默认为视口
        rootMargin: "0px",
        threshold: 0, // 哪怕只要有 1px 离开视口也会触发
      }
    );

    // 开始观察哨兵
    observer.observe(sentinelRef.current);

    // 清理函数
    return () => {
      observer.disconnect();
    };
  }, []); // 依赖项为空，只在组件挂载时运行一次

  const scrollToSection = (id: number) => {
    const section = document.getElementById(`section-${id}`);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const items: CarouselItem[] = [
    { id: 1, title: "Overview" },
    { id: 2, title: "Orders" },
    { id: 3, title: "Inventory" },
    { id: 4, title: "Customers" },
    { id: 5, title: "Automation" },
    { id: 6, title: "Reports" },
  ];

  return (
    <>
      {/* 
        🚀 性能优化：添加一个高 50px 的隐形“哨兵”。
        绝对定位在页面最顶部，不影响原有的布局。
      */}
      <div 
        ref={sentinelRef} 
        className="absolute top-0 w-full pointer-events-none" 
        style={{ height: "50px", zIndex: -1 }} 
      />

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-background/90 backdrop-blur-sm shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="container flex flex-col gap-2 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-xl font-bold text-accent">
              OrderFlow Demo
            </Link>
          </div>

          {scrolled && (
            <div className="hidden md:block">
              <RulerCarousel
                originalItems={items}
                onSelect={(item) => scrollToSection(item.id)}
              />
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;