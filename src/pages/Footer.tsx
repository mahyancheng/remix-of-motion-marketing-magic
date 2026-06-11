"use client"; 

import React, { useState } from "react";
import Logo from "@/image/Logo.webp";

const Footer: React.FC = () => {
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  return (
    <footer className="bg-background text-foreground py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Column 1: Logo & About */}
          <div>
            <img
              src={Logo}
              alt="Leadzap Marketing - Top Digital Marketing Agency Malaysia"
              className="h-8 md:h-10 w-auto object-contain mb-3 md:mb-4" 
            />
            <p className="mb-3 md:mb-4 text-sm md:text-base text-muted-foreground">
              Leadzap is a top digital marketing agency Malaysia trusted for SEO services pricing Malaysia, social media marketing Malaysia, and Google Ads agency Malaysia solutions.
            </p>
            <p className="text-xs text-muted-foreground">
              Digital marketing Kuala Lumpur • Malaysia SEO consultant • Free SEO analysis Malaysia
            </p>
          </div>

          {/* Column 2: Company Links */}
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">
              Company
            </h3>
            <ul className="space-y-1.5 md:space-y-2 text-sm md:text-base">
              <li>
                <a href="/" className="hover:text-accent hover:no-underline">
                  Home
                </a>
              </li>
              <li>
                <a href="/corporate-profile/" className="hover:text-accent hover:no-underline">
                  Company Profile
                </a>
              </li>
              
              <li 
                className="font-medium mt-1 cursor-pointer flex items-center gap-2 hover:text-accent select-none"
                onClick={() => setIsServicesOpen(!isServicesOpen)}
              >
                Services
                <span className="text-[10px] text-muted-foreground transition-transform">
                  {isServicesOpen ? "▲" : "▼"}
                </span>
              </li>
              
              {isServicesOpen && (
                <>
                  <li className="ml-3">
                    <a href="/sem/" className="hover:text-accent hover:no-underline block py-0.5">
                      SEO Services Malaysia
                    </a>
                  </li>
                  <li className="ml-3">
                    <a href="/social-media-ads/" className="hover:text-accent hover:no-underline block py-0.5">
                      Social Media Marketing Malaysia
                    </a>
                  </li>
                  <li className="ml-3">
                    <a href="/custom-software/" className="hover:text-accent hover:no-underline block py-0.5">
                      Custom Software Development
                    </a>
                  </li>
                </>
              )}

              <li>
                <a href="/blog/" className="hover:text-accent hover:no-underline mt-1 block">
                  Blog
                </a>
              </li>
              <li>
                <a href="/contact/" className="hover:text-accent hover:no-underline">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info & Map */}
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">
              Get In Touch
            </h3>

            <p className="mb-1 text-sm md:text-base">
              <a href="mailto:sales@leadzap.com.my" className="hover:text-accent hover:no-underline">
                sales@leadzap.com.my
              </a>
            </p>

            <p className="text-sm md:text-base mb-3">
              <a href="tel:+601111335119" className="hover:text-accent hover:no-underline">
                +60-111-1335119
              </a>
            </p>

            <address className="not-italic text-sm md:text-base mb-4 text-muted-foreground leading-relaxed">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Leadzap+Marketing+Sdn+Bhd"
                target="_blank"
                rel="noreferrer"
                className="hover:text-accent hover:no-underline"
              >
                Leadzap Marketing Sdn Bhd<br />
                16-1, Jln SS19/6, SS 19,<br />
                47500 Subang Jaya, Selangor, Malaysia
              </a>
            </address>

            {/* 新增的迷你地图区块 */}
            <div className="w-full h-32 md:h-40 rounded-lg overflow-hidden border border-foreground/20">
              <iframe
                // ⚠️ 注意：这里一定要换成你刚才在 Google Maps 拿到的 Embed 长链接！
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7968.220928114995!2d101.57687007531642!3d3.065133353662673!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc4d8ca7d43a6f%3A0xf969dd3aaa08482c!2sLeadzap%20Marketing%20Sdn%20Bhd!5e0!3m2!1sen!2smy!4v1781144580110!5m2!1sen!2smy"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Leadzap Marketing Office Location"
              />
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              Based in Subang Jaya, Selangor. Serving clients across Malaysia.
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-foreground/20 mt-8 md:mt-12 pt-4 md:pt-6 text-xs md:text-sm text-center text-muted-foreground">
          Copyright © 2025 | Powered by Leadzap Sdn Bhd | Top Digital Marketing Agency Malaysia
        </div>
      </div>
    </footer>
  );
};

export default Footer;