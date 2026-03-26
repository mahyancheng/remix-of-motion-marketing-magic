
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useOrder } from "@/contexts/OrderContext";
import { RulerCarousel, type CarouselItem } from "@/components/ui/ruler-carousel";

const Header = () => {
  const { activeSection } = useOrder();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
  );
};

export default Header;