import { Globe } from "lucide-react";

const GrowthHubFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-primary py-12">
      <div className="container px-4">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <h3 className="mb-4 font-display text-2xl font-bold text-primary-foreground">
              Leadzap<span className="text-accent">.</span>
            </h3>
            <p className="mb-4 max-w-md text-primary-foreground/60">
              Your one-stop digital marketing solution. We focus on measurable
              growth through Google Ads, SEO, and Social Media paid advertising.
            </p>
            <div className="flex flex-col gap-2 text-sm text-primary-foreground/60">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-accent" />
                <a href="https://leadzap.com.my/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-foreground">
                  leadzap.com.my
                </a>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-primary-foreground">Services</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/60">
              <li><a href="#services" className="hover:text-primary-foreground">Google Ads</a></li>
              <li><a href="#services" className="hover:text-primary-foreground">SEO Management</a></li>
              <li><a href="#services" className="hover:text-primary-foreground">Social Media Ads</a></li>
              <li><a href="#packages" className="hover:text-primary-foreground">Packages</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-primary-foreground">Quick Links</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/60">
              <li><a href="#delivery" className="hover:text-primary-foreground">How We Work</a></li>
              <li><a href="#calculator" className="hover:text-primary-foreground">Budget Calculator</a></li>
              <li><a href="#faq" className="hover:text-primary-foreground">FAQ</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-primary-foreground/10 pt-8 text-sm text-primary-foreground/50 md:flex-row">
          <p>© {currentYear} Leadzap Marketing. All rights reserved.</p>
          <p>KPI Focus: Leads & E-commerce Sales</p>
        </div>
      </div>
    </footer>
  );
};

export default GrowthHubFooter;