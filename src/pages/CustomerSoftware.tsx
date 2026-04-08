import { OrderProvider } from '@/contexts/OrderContext';
import { Navbar } from './Index';
import Footer from './Footer';
import CustomSoftwareHero from '@/components/custom-software/Hero';
import LeadForm from '@/components/LeadForm';
import ServicesSection from '@/components/custom-software/Services';
import BenefitsSection from '@/components/custom-software/Benefits';
import ProcessSection from '@/components/custom-software/Process';
import FAQSection from '@/components/custom-software/FAQ';
import CTASection from '@/components/custom-software/CTA';
import BlogSection from '@/components/BlogSection';

// 🚨 新增：导入 Helmet (同时移除了 useEffect，因为不再需要手动操作 DOM)
import { Helmet } from "react-helmet-async";
import PageBreadcrumb from "@/components/PageBreadcrumb";

// ==========================================
// 🚨 性能修复：提取静态数组到外部
// 杜绝引用地址变化导致的 useEffect 无限死循环 (Error 5)
// ==========================================
const BLOG_TAGS = ['custom software', 'software development', 'automation', 'business systems', 'erp', 'crm integration'];

// 🚨 新增：将 FAQ Schema 提取到组件外部
const FAQ_SCHEMA_DATA = {
  '@context': 'https://schema.org', 
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What are custom software development solutions?', acceptedAnswer: { '@type': 'Answer', text: 'Custom software development solutions are tailored applications built to your exact business needs—ensuring better fit, efficiency, and ROI.' } },
    { '@type': 'Question', name: 'Are you a software development company in Malaysia?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, we are a software company in Malaysia providing full-cycle custom software development services for local and international clients.' } },
    { '@type': 'Question', name: 'How do custom business systems improve efficiency?', acceptedAnswer: { '@type': 'Answer', text: 'By aligning to your workflows, custom business systems reduce manual work through business automation software and software automation tools.' } },
    { '@type': 'Question', name: 'Can you integrate with existing platforms?', acceptedAnswer: { '@type': 'Answer', text: 'As a software provider we integrate CRMs, ERPs, and other platforms to create efficient software ecosystems.' } },
    { '@type': 'Question', name: 'How do you approach cost optimization?', acceptedAnswer: { '@type': 'Answer', text: 'We design for maintainability, automate where it matters, and prioritize high-impact features to optimize total cost of ownership.' } }
  ]
};

// 🚨 新增：专为 Custom Software 页面定制的 Service Schema
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
  "url": "https://leadzap.com.my/custom-software/" // ⚠️ 记得换成你的真实链接
};
// ==========================================

const CustomerSoftware = () => {
  return (
    <OrderProvider>
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
        
        {/* 🚨 替换：使用 Helmet 声明 Meta 标签、Canonical 和双重 Schema */}
        <Helmet>
          <title>Custom Software Development Solutions Malaysia | Leadzap</title>
          <meta name="description" content="Software development company in Malaysia offering custom software development services, custom business systems, and automation tools for cost optimization." />
          {/* ⚠️ 记得将 href 替换为真实的线上域名 */}
          <link rel="canonical" href="https://leadzap.com.my/custom-software/" />
          
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
        <PageBreadcrumb items={[{ label: "Custom Software" }]} />
        <main>
          <CustomSoftwareHero subtitle="Custom software, automation tools, and systems engineered for efficiency and cost optimization." />
          <ServicesSection />
          <BenefitsSection />
          <ProcessSection />
          <BlogSection
            tags={BLOG_TAGS}
            title="Software Development Insights"
            subtitle="Explore the latest trends and best practices in custom software development"
          />
          <CTASection />
          <FAQSection />
          <LeadForm
            heading="Get Your Custom Software Quote"
            subheading="Tell us about your project and we'll get back to you with a tailored proposal — no obligations."
            defaultService="order"
          />
          <Footer />
        </main>
      </div>
    </OrderProvider>
  );
};

export default CustomerSoftware;