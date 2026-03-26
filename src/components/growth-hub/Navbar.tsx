import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles } from "lucide-react"; // 移除了 Home 图标

const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "How We Work", href: "#delivery" },
  { label: "Packages", href: "#packages" },
  { label: "Calculator", href: "#calculator" },
  { label: "FAQ", href: "#faq" },
];

const GrowthHubNavbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = useCallback((href: string) => {
    const element = document.querySelector(href);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-[100] transition-all duration-500 ${
        isScrolled
          ? "bg-primary/90 shadow-xl backdrop-blur-md py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo 部分 */}
        <a 
          href="/growth-hub" 
          className="font-display text-2xl font-bold tracking-tighter text-primary-foreground group"
        >
          Leadzap
          <span className="text-accent transition-all duration-300 group-hover:pl-1">.</span>
        </a>

        {/* 桌面端导航 */}
        <div className="hidden items-center gap-8 md:flex">
          {/* 🚀 修正：Home 链接在样式上与 NAV_LINKS 完全统一 */}
          <button
            onClick={() => navigate("/")}
            // 使用了完全相同的 CSS Class
            className="group relative text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground"
          >
            Home
            {/* 🚀 加入了完全相同的下划线金色动画 */}
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-accent transition-all duration-300 group-hover:w-full" />
          </button>
          
          {/* 分隔线 */}
          <div className="h-4 w-[1px] bg-white/10" />

          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              onClick={() => scrollToSection(link.href)}
              className="group relative text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-accent transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </div>

        {/* 桌面端操作按钮 */}
        <div className="hidden items-center gap-4 md:flex">
          <Button
            variant="accent"
            size="sm"
            className="shadow-lg shadow-accent/20 hover:shadow-accent/40"
            onClick={() => navigate('/contact/')}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Get Started
          </Button>
        </div>

        {/* 移动端菜单开关 */}
        <button
          className="rounded-lg p-2 text-primary-foreground hover:bg-white/10 md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* 移动端下拉菜单 */}
      {isMobileMenuOpen && (
        <div className="absolute left-0 right-0 top-[100%] border-t border-white/10 bg-primary/98 p-6 shadow-2xl backdrop-blur-xl animate-in slide-in-from-top-5 duration-300 md:hidden">
          <div className="flex flex-col gap-5">
            {/* 🚀 移动端修正：Home 链接在样式上完全统一 */}
            <button
              onClick={() => { navigate("/"); setIsMobileMenuOpen(false); }}
              // 移除了粗体、图标和特定颜色
              className="text-left text-lg font-medium text-primary-foreground/70 transition-colors hover:text-primary-foreground"
            >
              Back to HomePage
            </button>
            
            <hr className="border-white/10" />

            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollToSection(link.href)}
                className="text-lg font-medium text-primary-foreground/70 transition-colors hover:text-primary-foreground"
              >
                {link.label}
              </button>
            ))}
            
            <hr className="border-white/10" />
            
            <Button
              variant="accent"
              size="lg"
              className="w-full"
              onClick={() => { 
                navigate('/contact/'); 
                setIsMobileMenuOpen(false); 
              }}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Get Started
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default GrowthHubNavbar;