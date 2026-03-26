import { OrderProvider } from '@/contexts/OrderContext';
import { Navbar } from './Index';
import Footer from './Footer';
import { useEffect } from 'react';
import CustomSoftwareHero from '@/components/custom-software/Hero';
import LeadForm from '@/components/LeadForm';
import ServicesSection from '@/components/custom-software/Services';
import BenefitsSection from '@/components/custom-software/Benefits';
import ProcessSection from '@/components/custom-software/Process';
import FAQSection from '@/components/custom-software/FAQ';
import CTASection from '@/components/custom-software/CTA';
import BlogSection from '@/components/BlogSection';

// ==========================================
// 🚨 性能修复：提取静态数组到外部
// 杜绝引用地址变化导致的 useEffect 无限死循环 (Error 5)
// ==========================================
const BLOG_TAGS = ['custom software', 'software development', 'automation', 'business systems', 'erp', 'crm integration'];

const CustomerSoftware = () => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'Custom Software Development Solutions Malaysia';

    const ensureMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement('meta'); el.setAttribute('name', name); document.head.appendChild(el); }
      el.setAttribute('content', content);
      return el;
    };

    ensureMeta('description', 'Software development company in Malaysia offering custom software development services, custom business systems, and automation tools for cost optimization.');

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) { link = document.createElement('link'); link.setAttribute('rel', 'canonical'); document.head.appendChild(link); }
    link.setAttribute('href', `${window.location.origin}/custom-software/`);

    const faqJson = {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'What are custom software development solutions?', acceptedAnswer: { '@type': 'Answer', text: 'Custom software development solutions are tailored applications built to your exact business needs—ensuring better fit, efficiency, and ROI.' } },
        { '@type': 'Question', name: 'Are you a software development company in Malaysia?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, we are a software company in Malaysia providing full-cycle custom software development services for local and international clients.' } },
        { '@type': 'Question', name: 'How do custom business systems improve efficiency?', acceptedAnswer: { '@type': 'Answer', text: 'By aligning to your workflows, custom business systems reduce manual work through business automation software and software automation tools.' } },
        { '@type': 'Question', name: 'Can you integrate with existing platforms?', acceptedAnswer: { '@type': 'Answer', text: 'As a software provider we integrate CRMs, ERPs, and other platforms to create efficient software ecosystems.' } },
        { '@type': 'Question', name: 'How do you approach cost optimization?', acceptedAnswer: { '@type': 'Answer', text: 'We design for maintainability, automate where it matters, and prioritize high-impact features to optimize total cost of ownership.' } }
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(faqJson);
    document.head.appendChild(script);

    return () => { document.title = prevTitle; script.remove(); };
  }, []);

  return (
    <OrderProvider>
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
        <Navbar />
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