export const SITE_URL = "https://leadzap.com.my";

/**
 * 核心机构信息 (作为所有 Schema 的基石)
 */
export const organizationSchema = {
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#organization`,
  "name": "Leadzap Marketing",
  "url": SITE_URL,
  "logo": {
    "@type": "ImageObject",
    "@id": `${SITE_URL}/#logo`,
    "url": `${SITE_URL}/assets/Logo-BtIJ7fab.webp`,
    "contentUrl": `${SITE_URL}/assets/Logo-BtIJ7fab.webp`,
    "caption": "Leadzap Marketing"
  },
  "image": { "@id": `${SITE_URL}/#logo` },
  "telephone": "+60-111-1335119",
  "email": "sales@leadzap.com.my",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "16-1, Jln SS19/6, SS 19",
    "addressLocality": "Subang Jaya",
    "addressRegion": "Selangor",
    "postalCode": "47500",
    "addressCountry": "MY"
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "opens": "09:00",
    "closes": "18:00"
  },
  "sameAs": [
    // 这里放你的社交媒体链接
    "https://www.facebook.com/leadzapmarketing",
    "https://www.linkedin.com/company/leadzap-marketing"
  ]
};

/**
 * 首页专用 Schema (包含搜索框)
 */
export const getHomeSchema = () => ({
  "@context": "https://schema.org",
  "@graph": [
    organizationSchema,
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      "url": `${SITE_URL}/`,
      "name": "Leadzap Marketing",
      "publisher": { "@id": `${SITE_URL}/#organization` },
      "potentialAction": [
        {
          "@type": "SearchAction",
          "target": `${SITE_URL}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      ]
    }
  ]
});

/**
 * 服务页通用 Schema 生成器
 */
export const getServiceSchema = (name: string, description: string, path: string) => ({
  "@context": "https://schema.org",
  "@graph": [
    { "@id": `${SITE_URL}/#organization` }, // 引用机构 ID
    {
      "@type": "Service",
      "name": name,
      "description": description,
      "url": `${SITE_URL}${path}`,
      "provider": { "@id": `${SITE_URL}/#organization` },
      "areaServed": "MY",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Digital Marketing Services",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "SEO" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Google Ads" } }
        ]
      }
    }
  ]
});

/**
 * 自动生成面包屑 Schema
 */
export const getBreadcrumbSchema = (items: { name: string, item: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": `${SITE_URL}${item.item}`
  }))
});

export const getSEMSchema = () => {
  return {
    "@context": "https://schema.org",
    "@graph": [
      // 1. 引用机构信息
      organizationSchema,

      // 2. 服务详情信息
      {
        "@type": "Service",
        "@id": `${SITE_URL}/sem/#service`,
        "name": "Search Engine Marketing (SEM) & SEO Services Malaysia",
        "serviceType": ["SEO", "Google Ads Management", "SEM", "Local SEO"],
        "provider": { "@id": `${SITE_URL}/#organization` },
        "areaServed": { "@type": "Country", "name": "Malaysia" },
        "description": "Expert SEO, GEO, and Google Ads management services in Malaysia to outrank competitors and drive high-intent leads.",
        "offers": {
          "@type": "Offer",
          "name": "Free SEO Audit Malaysia",
          "price": "0",
          "priceCurrency": "MYR",
          "url": `${SITE_URL}/sem/`
        }
      },

      // 3. 面包屑导航 (非常推荐，对排名有益)
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_URL}/sem/#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": SITE_URL
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "SEO & Google Ads",
            "item": `${SITE_URL}/sem/`
          }
        ]
      }
    ]
  };
};

export const getSocialMediaAdsSchema = () => {
  return {
    "@context": "https://schema.org",
    "@graph": [
      // 1. 引用核心机构信息
      organizationSchema,

      // 2. 社交媒体广告服务详情
      {
        "@type": "Service",
        "@id": `${SITE_URL}/social-media-ads/#service`,
        "name": "Social Media Marketing & Paid Ads Malaysia",
        "serviceType": [
          "Social Media Marketing",
          "Facebook Ads Management",
          "Instagram Marketing",
          "TikTok Advertising",
          "RedNote (Xiaohongshu) Marketing",
          "Paid Social Funnels"
        ],
        "provider": { "@id": `${SITE_URL}/#organization` },
        "areaServed": { "@type": "Country", "name": "Malaysia" },
        "description": "Leading social media marketing agency in Malaysia. We build conversion-optimized funnels using Facebook, Instagram, TikTok, and RedNote ads to drive high-intent buyers.",
        "offers": {
          "@type": "Offer",
          "name": "Free Social Media Ad Strategy Session",
          "price": "0",
          "priceCurrency": "MYR",
          "url": `${SITE_URL}/social-media-ads/`
        }
      },

      // 3. 面包屑导航
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_URL}/social-media-ads/#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": SITE_URL
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Social Media Ads",
            "item": `${SITE_URL}/social-media-ads/`
          }
        ]
      }
    ]
  };
};

// src/lib/schema.ts

/**
 * 获取定制软件开发页面专用 Schema
 * 包含：Service + FAQ + SoftwareApplication (Howkee CRM)
 */
export const getCustomSoftwareSchema = () => {
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationSchema,

      // 1. 定制开发服务
      {
        "@type": "Service",
        "@id": `${SITE_URL}/custom-software/#service`,
        "name": "Custom Software Development & Business Automation Malaysia",
        "provider": { "@id": `${SITE_URL}/#organization` },
        "description": "Leading software development company in Malaysia specializing in ERP systems, Healthcare solutions, and CRM automation.",
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Software Solutions",
          "itemListElement": [
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Healthcare Software" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "ERP Systems" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "CRM & Sales Systems" } }
          ]
        }
      },

      // 2. 旗舰产品：Howkee CRM (以 SoftwareApplication 形式增强权重)
      {
        "@type": "SoftwareApplication",
        "name": "Howkee CRM",
        "operatingSystem": "Web, Cloud",
        "applicationCategory": "BusinessApplication",
        "description": "A powerful CRM designed for Malaysian sales teams to automate pipelines and recover lost leads.",
        "publisher": { "@id": `${SITE_URL}/#organization` }
      },

      // 3. FAQ 页面 (必须与 FAQSection.tsx 文字 100% 对应)
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/custom-software/#faq`,
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How much does custom software cost?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "It depends on complexity, but custom software costs less than you think when you factor in the cost of NOT having it. We offer flexible pricing and can start with an MVP."
            }
          },
          {
            "@type": "Question",
            "name": "How long does it take to build?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Most MVPs launch in 6-8 weeks. Full systems take 3-6 months. We can start with a prototype in 2 weeks so you see progress immediately."
            }
          },
          {
            "@type": "Question",
            "name": "Are you really a software company in Malaysia?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. We're based in Malaysia, we understand Malaysian business workflows, local compliance, and we communicate in your timezone."
            }
          }
        ]
      },

      // 4. 面包屑
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
          { "@type": "ListItem", "position": 2, "name": "Custom Software", "item": `${SITE_URL}/custom-software/` }
        ]
      }
    ]
  };
};

export const getBlogSchema = (posts: any[]) => {
  return {
    "@context": "https://schema.org",
    "@graph": [
      // 1. 引用机构
      organizationSchema,

      // 2. 博客主体信息
      {
        "@type": "Blog",
        "@id": `${SITE_URL}/blog/#blog`,
        "name": "Digital Marketing Blog Malaysia | Leadzap Marketing",
        "description": "Expert SEO tips, Google Ads strategies, and digital marketing guides for Malaysian businesses.",
        "publisher": { "@id": `${SITE_URL}/#organization` },
        "url": `${SITE_URL}/blog/`,
        // 将列表中的文章映射到 Schema 中
        "blogPost": posts.map(post => ({
          "@type": "BlogPosting",
          "@id": `${SITE_URL}/blog/${post.slug}/#post`,
          "headline": post.title,
          "url": `${SITE_URL}/blog/${post.slug}/`,
          "datePublished": post.publishedAt,
          "author": {
            "@type": "Person",
            "name": post.author || "Leadzap Team"
          }
        }))
      },

      // 3. 面包屑
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_URL}/blog/#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
          { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${SITE_URL}/blog/` }
        ]
      }
    ]
  };
};

export const getBlogPostSchema = (post: any) => {
  const postUrl = `${SITE_URL}/blog/${post.slug}/`;
  const publishDate = post.publishedAt instanceof Date
    ? post.publishedAt.toISOString()
    : new Date(post.publishedAt).toISOString();

  return {
    "@context": "https://schema.org",
    "@graph": [
      // 1. 引用机构信息
      organizationSchema,

      // 2. 文章主体信息
      {
        "@type": "BlogPosting",
        "@id": `${postUrl}#post`,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": postUrl
        },
        "headline": post.title,
        "description": post.excerpt || post.title,
        "image": post.imageUrl ? [post.imageUrl] : [],
        "datePublished": publishDate,
        "dateModified": publishDate, // 如果有修改日期字段可以替换
        "author": {
          "@type": "Person",
          "name": post.author || "Leadzap Marketing",
          "url": SITE_URL // 或者作者详情页链接
        },
        "publisher": { "@id": `${SITE_URL}/#organization` },
        "articleBody": post.content?.replace(/<[^>]*>?/gm, '').substring(0, 500) // 抓取纯文本前500字
      },

      // 3. 面包屑导航 (Home > Blog > Article Name)
      {
        "@type": "BreadcrumbList",
        "@id": `${postUrl}#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": SITE_URL
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Blog",
            "item": `${SITE_URL}/blog/`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": post.title,
            "item": postUrl
          }
        ]
      }
    ]
  };
};

// src/lib/schema.ts (最终完整版追加)

/**
 * 获取联系页面专用 Schema
 */
export const getContactSchema = () => {
  return {
    "@context": "https://schema.org",
    "@graph": [
      // 1. 引用核心机构/本地业务信息
      {
        ...organizationSchema,
        "@type": "ProfessionalService", // 在联系页强化其业务属性
        "contactPoint": [
          {
            "@type": "ContactPoint",
            "telephone": "+60-111-1335119",
            "contactType": "sales",
            "areaServed": "MY",
            "availableLanguage": ["English", "Malay", "Chinese"]
          }
        ]
      },

      // 2. 联系页面主体
      {
        "@type": "ContactPage",
        "@id": `${SITE_URL}/contact/#webpage`,
        "url": `${SITE_URL}/contact/`,
        "name": "Contact Leadzap Marketing | Free Digital Marketing Consultation Malaysia",
        "description": "Get free SEO analysis, social media marketing consultation, or custom software quotes from Leadzap Marketing Malaysia.",
        "breadcrumb": { "@id": `${SITE_URL}/contact/#breadcrumb` },
        "mainEntity": { "@id": `${SITE_URL}/#organization` }
      },

      // 3. 面包屑
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_URL}/contact/#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": SITE_URL
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Contact Us",
            "item": `${SITE_URL}/contact/`
          }
        ]
      }
    ]
  };
};