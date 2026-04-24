import { lazy, Suspense } from 'react';
import { OrderProvider } from '@/contexts/OrderContext';
import { Navbar } from './Index';
import Footer from './Footer';
import CustomSoftwareHero from '@/components/custom-software/Hero';

// 🚀 性能优化：首屏以下的组件全部改为懒加载，减少初始 bundle 体积
const LeadForm = lazy(() => import('@/components/LeadForm'));
const ServicesSection = lazy(() => import('@/components/custom-software/Services'));
const BenefitsSection = lazy(() => import('@/components/custom-software/Benefits'));
const ProcessSection = lazy(() => import('@/components/custom-software/Process'));
const FAQSection = lazy(() => import('@/components/custom-software/FAQ'));
const CTASection = lazy(() => import('@/components/custom-software/CTA'));
const BlogSection = lazy(() => import('@/components/BlogSection'));

import { Helmet } from "react-helmet-async";

// ==========================================
// 🚀 性能修复：提取静态数组到组件外部
// 杜绝引用地址变化导致的 useEffect 无限死循环
// ==========================================
const BLOG_TAGS = ['custom software', 'software development', 'automation', 'business systems', 'erp', 'crm integration'];

// 🚨 FAQ Schema 提取到组件外部（避免每次渲染重新创建对象）
const FAQ_SCHEMA_DATA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What are custom software development solutions?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Custom software development solutions are tailored applications built to your exact business needs—ensuring better fit, efficiency, and ROI.'
      }
    },
    {
      '@type': 'Question',
      name: 'Are you a software development company in Malaysia?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, we are a software company in Malaysia providing full-cycle custom software development services for local and international clients.'
      }
    },
    {
      '@type': 'Question',
      name: 'How do custom business systems improve efficiency?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'By aligning to your workflows, custom business systems reduce manual work through business automation software and software automation tools.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can you integrate with existing platforms?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'As a software provider we integrate CRMs, ERPs, and other platforms to create efficient software ecosystems.'
      }
    },
    {
      '@type': 'Question',
      name: 'How do you approach cost optimization?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We design for maintainability, automate where it matters, and prioritize high-impact features to optimize total cost of ownership.'
      }
    }
  ]
};

// 🚨 Service Schema 提取到组件外部
const SOFTWARE_SERVICE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Custom Software Development Solutions Malaysia",
  "serviceType": [
    "Custom Software Development",
    "Business Automation",
    "ERP Development",
    "CRM Integration",
    "Web Application Development"
  ],
  "provider": {
    "@type": "LocalBusiness",
    "name": "Leadzap Marketing",
    "url": "https://leadzap.com.my/custom-software/", // ✅ 修复：加入 url 字段解决 structured data 错误
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "2-22, Jln SS19/6, Ss 19",
      "addressLocality": "Subang Jaya",
      "addressRegion": "Selangor",
      "postalCode": "47500",
      "addressCountry": "MY"
    }
  },
  "areaServed": {
    "@type": "Country",
    "name": "Malaysia"
  },
  "description": "Software development company in Malaysia offering custom software development services, custom business systems, and automation tools for cost optimization.",
  "url": "https://leadzap.com.my/custom-software/"
};
// ==========================================

// 🚀 轻量级 Loading 占位符，避免布局抖动
const SectionSkeleton = () => (
  <div className="w-full py-20 flex justify-center items-center">
    <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
  </div>
);

const CustomerSoftware = () => {
  return (
    <OrderProvider>
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

        {/* SEO: Meta 标签、Canonical 和双重 Schema */}
        <Helmet>
          <title>Custom Software Development Solutions Malaysia | Leadzap</title>
          <meta
            name="description"
            content="Software development company in Malaysia offering custom software development services, custom business systems, and automation tools for cost optimization."
          />
          <link rel="canonical" href="https://leadzap.com.my/custom-software/" />

          {/* Open Graph */}
          <meta property="og:title" content="Custom Software Development Solutions Malaysia | Leadzap" />
          <meta property="og:description" content="Software development company in Malaysia offering custom software development services, custom business systems, and automation tools for cost optimization." />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://leadzap.com.my/custom-software/" />

          {/* 注入 FAQ Schema */}
          <script type="application/ld+json">
            {JSON.stringify(FAQ_SCHEMA_DATA)}
          </script>

          {/* 注入 Service Schema */}
          <script type="application/ld+json">
            {JSON.stringify(SOFTWARE_SERVICE_SCHEMA)}
          </script>
        </Helmet>

        <Navbar />

        <main>
          {/* ✅ 首屏 Hero：同步加载，确保 LCP 最快 */}
          <CustomSoftwareHero subtitle="Custom software, automation tools, and systems engineered for efficiency and cost optimization." />

          {/* ✅ 以下全部懒加载，减少首屏 JS 体积 */}
          <Suspense fallback={<SectionSkeleton />}>
            <ServicesSection />
          </Suspense>

          <Suspense fallback={<SectionSkeleton />}>
            <BenefitsSection />
          </Suspense>

          <Suspense fallback={<SectionSkeleton />}>
            <ProcessSection />
          </Suspense>

          {/* BlogSection 会请求 Firebase，单独 Suspense 隔离 */}
          <Suspense fallback={<SectionSkeleton />}>
            <BlogSection
              tags={BLOG_TAGS}
              title="Software Development Insights"
              subtitle="Explore the latest trends and best practices in custom software development"
            />
          </Suspense>

          <Suspense fallback={<SectionSkeleton />}>
            <CTASection />
          </Suspense>

          <Suspense fallback={<SectionSkeleton />}>
            <FAQSection />
          </Suspense>

          <Suspense fallback={<SectionSkeleton />}>
            <LeadForm
              heading="Get Your Custom Software Quote"
              subheading="Tell us about your project and we'll get back to you with a tailored proposal — no obligations."
              defaultService="order"
            />
          </Suspense>

          <Footer />
        </main>
      </div>
    </OrderProvider>
  );
};

export default CustomerSoftware;