import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const navLinks = [
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

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: "smooth" });
    setIsMobileMenuOpen(false);
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
        <a href="/growth-hub" className="font-display text-2xl font-bold text-primary-foreground">
          Leadzap<span className="text-accent">.</span>
        </a>

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

        <div className="hidden items-center gap-2 md:flex">
          <Button
            variant="accent"
            size="default"
            onClick={() => navigate('/contact')}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Get Started
          </Button>
        </div>

        <button
          className="text-primary-foreground md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

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
            <Button
              variant="accent"
              size="lg"
              className="w-full"
              onClick={() => { navigate('/contact'); setIsMobileMenuOpen(false); }}
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