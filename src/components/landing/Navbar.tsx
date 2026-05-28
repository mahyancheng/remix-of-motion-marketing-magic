import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles, LayoutDashboard, ChevronDown, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "How We Work", href: "#delivery" },
  { label: "Packages", href: "#packages" },
  { label: "Calculator", href: "#calculator" },
  { label: "FAQ", href: "#faq" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false); // 控制下拉菜单的状态
  
  const dropdownRef = useRef<HTMLDivElement>(null); // 用于检测点击外部关闭下拉菜单

  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 监听点击外部事件（用来关闭桌面端的下拉菜单）
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLoginDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
    setIsLoginDropdownOpen(false);
  };

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-primary/95 shadow-lg backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="container flex h-20 items-center justify-between px-4">
        {/* Logo */}
        <a href="#" className="font-display text-2xl font-bold text-primary-foreground">
          Leadzap<span className="text-accent">.</span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => scrollToSection(link.href)}
              className="text-sm font-medium text-primary-foreground/70 transition-colors hover:text-primary-foreground"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden items-center gap-2 md:flex">
          
          {/* Expandable Login Dropdown (Desktop) */}
          <div className="relative" ref={dropdownRef}>
            <Button
              variant="outline"
              size="default"
              onClick={() => setIsLoginDropdownOpen(!isLoginDropdownOpen)}
              className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <User className="mr-2 h-4 w-4" />
              Logins
              <ChevronDown className={`ml-2 h-4 w-4 transition-transform duration-200 ${isLoginDropdownOpen ? 'rotate-180' : ''}`} />
            </Button>

            {/* Dropdown Menu */}
            {isLoginDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 overflow-hidden rounded-md border border-primary-foreground/10 bg-primary shadow-xl backdrop-blur-md">
                <div className="flex flex-col">
                  <button
                    onClick={() => handleNavigate('/client/login')}
                    className="px-4 py-3 text-left text-sm font-medium text-primary-foreground/80 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  >
                    Client Login
                  </button>
                  <button
                    onClick={() => handleNavigate('/auth/')}
                    className="px-4 py-3 text-left text-sm font-medium text-primary-foreground/80 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  >
                    Admin Login
                  </button>
                </div>
              </div>
            )}
          </div>

          <Button
            variant="outline"
            size="default"
            onClick={() => handleNavigate('/dashboard')}
            className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Button>

          <Button
            variant="accent"
            size="default"
            onClick={() => handleNavigate('/tool')}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Sales Tool
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="text-primary-foreground md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute left-0 right-0 top-20 border-t border-primary-foreground/10 bg-primary p-4 shadow-lg md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollToSection(link.href)}
                className="py-2 text-left font-medium text-primary-foreground/70 transition-colors hover:text-primary-foreground"
              >
                {link.label}
              </button>
            ))}

            <div className="my-2 h-px w-full bg-primary-foreground/10" />

            {/* Expandable Login Accordion (Mobile) */}
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                size="lg"
                className="w-full justify-between border-primary-foreground/20 text-primary-foreground"
                onClick={() => setIsLoginDropdownOpen(!isLoginDropdownOpen)}
              >
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Logins
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isLoginDropdownOpen ? 'rotate-180' : ''}`} />
              </Button>

              {/* Mobile Sub-menu */}
              {isLoginDropdownOpen && (
                <div className="ml-4 flex flex-col gap-2 rounded-md border border-primary-foreground/10 bg-primary-foreground/5 p-2">
                  <button
                    onClick={() => handleNavigate('/client/login')}
                    className="rounded-md p-2 text-left text-sm font-medium text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  >
                    Client Login
                  </button>
                  <button
                    onClick={() => handleNavigate('/auth/')}
                    className="rounded-md p-2 text-left text-sm font-medium text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  >
                    Admin Login
                  </button>
                </div>
              )}
            </div>

            <Button
              variant="outline"
              size="lg"
              className="w-full border-primary-foreground/20 text-primary-foreground"
              onClick={() => handleNavigate('/dashboard')}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            
            <Button
              variant="accent"
              size="lg"
              className="w-full"
              onClick={() => handleNavigate('/tool')}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Sales Tool
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;