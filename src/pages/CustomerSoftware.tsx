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
import SEO from "@/components/SEO";
import { getCustomSoftwareSchema } from '@/lib/schema';
// ✅ 修改1: 删除未使用的 PageBreadcrumb import
// ✅ 修改2: 删除未使用的 OrderProvider import（检查子组件是否需要）

// ==========================================
// 静态配置数据
// ==========================================

// ✅ 修改3: BLOG_TAGS 加入马来西亚关键词
const BLOG_TAGS = [
  'custom software',
  'software development Malaysia',
  'business automation Malaysia',
  'business systems',
  'erp malaysia',
  'crm integration',
  'software company malaysia'
];

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

// ✅ 修改4: Schema provider 加入 url、telephone、email，删掉行内注释
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
    "url": "https://leadzap.com.my",
    "telephone": "+60-111-1335119",
    "email": "sales@leadzap.com.my",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "16-1, Jln SS19/6, SS 19",
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

const CustomerSoftware = () => {
  return (
    // ✅ 修改5: 删除不必要的 OrderProvider 包裹
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* ✅ 修改6: Title 缩短到 53 字符 */}
      <SEO
        title="Custom Software | ERP Software Malaysia | Leadzap Marketing Sdn Bhd"
        // ✅ 修改7: Meta Description 更有力，加入行动号召
        description="Leadzap Marketing provides custom software and ERP solutions in Malaysia to help businesses improve operations, workflow and digital efficiency."
        path="/custom-software/"
        schema={getCustomSoftwareSchema()}
      />

      <Navbar />

      {/* ✅ 修改8: Footer 移到 main 外面，语义正确 */}
      <main>
        <CustomSoftwareHero
          subtitle="Custom software, automation tools, and systems engineered for efficiency and cost optimization."
        />
        <ServicesSection />
        <BenefitsSection />
        <ProcessSection />
        {/* ✅ 修改9: 调整顺序 — FAQ 在 CTA 前，解答疑虑后再促转化 */}
        <FAQSection />
        <CTASection />
        {/* 博客移到 CTA 后，不打断转化流程 */}
        <BlogSection
          tags={BLOG_TAGS}
          title="Software Development Insights"
          subtitle="Explore the latest trends and best practices in custom software development"
        />
        <LeadForm
          heading="Get Your Custom Software Quote"
          subheading="Tell us about your project and we'll get back to you with a tailored proposal — no obligations."
          defaultService="order"
        />
      </main>

      <Footer />
    </div>
  );
};

export default CustomerSoftware;