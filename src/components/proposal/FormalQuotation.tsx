import { ProposalData } from '@/types/proposal';
import leadzapLogo from '@/assets/leadzap-logo.png';

interface FormalQuotationProps {
  data: ProposalData;
  formatCurrency: (value: number) => string;
  formatDate: (dateStr: string) => string;
  quotationNumber?: string | null;
  customerId?: string | null;
  docHash?: string | null;
}

/**
 * Formal printable quotation block — appended below the visual infographic.
 * Mirrors the legal quotation format. Signing this is binding.
 */
export const FormalQuotation = ({
  data,
  formatCurrency,
  formatDate,
  quotationNumber,
  customerId,
  docHash,
}: FormalQuotationProps) => {
  const lineItems = (() => {
    if (data.selectedPackage === 'custom' && data.customLineItems?.length) {
      return data.customLineItems.map((i) => ({
        description: i.description,
        original: i.monthlyAmount,
        net: i.monthlyAmount,
      }));
    }
    const items: { description: string; original: number; net: number }[] = [];
    if (data.selectedPackage === 'google-seo' || data.selectedPackage === 'both') {
      items.push({ description: 'Google Ads + SEO Management', original: 2400, net: 2400 });
    }
    if (data.selectedPackage === 'social' || data.selectedPackage === 'both') {
      items.push({
        description: `Social Media Management${data.extraPlatforms ? ` (+${data.extraPlatforms} extra platform${data.extraPlatforms > 1 ? 's' : ''})` : ''}`,
        original: 2100 + data.extraPlatforms * 300,
        net: 2100 + data.extraPlatforms * 300,
      });
    }
    return items;
  })();

  const subtotal = lineItems.reduce((s, i) => s + i.original, 0);
  const discountAmount = subtotal * (data.discountPercentage / 100);
  const netMonthly = subtotal - discountAmount;
  const months = data.contractMonths ?? data.paymentSchedule?.length ?? 12;
  const totalContract = netMonthly * months;
  const validUntil = (() => {
    const d = data.date ? new Date(data.date) : new Date();
    d.setDate(d.getDate() + 30);
    return d;
  })();

  return (
    <section
      className="bg-white text-black rounded-2xl p-10 md:p-14 print:rounded-none print:p-8 print:bg-white print:text-black border border-border"
      data-formal-quotation
    >
      {/* Letterhead */}
      <div className="flex items-start justify-between gap-6 border-b-2 border-black pb-6">
        <div className="flex items-start gap-4">
          <img src={leadzapLogo} alt="Leadzap" className="h-14 w-auto" />
          <div className="text-[11px] leading-snug">
            <div className="font-bold text-base">LEADZAP MARKETING SDN BHD</div>
            <div>(201901013497 (1322825-P))</div>
            <div>NO. 6 JALAN BP 5/6, BANDAR BUKIT PUCHONG</div>
            <div>47100 PUCHONG, SELANGOR DARUL EHSAN, MALAYSIA.</div>
            <div>TEL: +603-8062 4180 &nbsp; FAX: +603-8062 4186</div>
            <div>Email: sales@leadzap.com.my</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold tracking-tight">QUOTATION</div>
          <table className="text-[11px] mt-3 ml-auto">
            <tbody>
              <tr><td className="pr-2 text-right font-semibold">DATE:</td><td>{formatDate(data.date)}</td></tr>
              <tr><td className="pr-2 text-right font-semibold">QUOTE NO:</td><td className="font-mono">{quotationNumber || '— pending —'}</td></tr>
              <tr><td className="pr-2 text-right font-semibold">CUSTOMER ID:</td><td className="font-mono">{customerId || '—'}</td></tr>
              <tr><td className="pr-2 text-right font-semibold">VALID UNTIL:</td><td>{formatDate(validUntil.toISOString())}</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer */}
      <div className="mt-6">
        <div className="text-[11px] font-semibold tracking-wider text-black/60">CUSTOMER</div>
        <div className="font-bold text-base mt-1">{data.clientName || '—'}</div>
        {data.businessType && <div className="text-sm">{data.businessType}</div>}
        {data.targetLocation && <div className="text-sm">{data.targetLocation}</div>}
      </div>

      {/* Subject */}
      <div className="mt-6 text-sm">
        <div className="font-bold">Re: DIGITAL MARKETING SERVICES</div>
        <div className="mt-1">
          This quotation outlines a {months}-month digital marketing engagement designed to enhance brand visibility and lead generation.
        </div>
      </div>

      {/* Scope of Service Table */}
      <div className="mt-6">
        <div className="text-sm font-bold mb-2">SCOPE OF SERVICE</div>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-black">
              <th className="text-left py-2 font-semibold">Description</th>
              <th className="text-right py-2 font-semibold w-32">Original Monthly Fee (RM)</th>
              <th className="text-right py-2 font-semibold w-28">Monthly Discount (RM)</th>
              <th className="text-right py-2 font-semibold w-32">Net Monthly Fee (RM)</th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map((item, i) => {
              const itemDiscount = item.original * (data.discountPercentage / 100);
              const itemNet = item.original - itemDiscount;
              return (
                <tr key={i} className="border-b border-black/20">
                  <td className="py-2">{item.description}</td>
                  <td className="py-2 text-right font-mono">{item.original.toFixed(2)}</td>
                  <td className="py-2 text-right font-mono">{itemDiscount > 0 ? `(${itemDiscount.toFixed(2)})` : '0.00'}</td>
                  <td className="py-2 text-right font-mono">{itemNet.toFixed(2)}</td>
                </tr>
              );
            })}
            <tr className="border-b-2 border-black font-bold bg-black/5">
              <td className="py-2">TOTAL MONTHLY INSTALLMENT</td>
              <td className="py-2 text-right font-mono">{subtotal.toFixed(2)}</td>
              <td className="py-2 text-right font-mono">{discountAmount > 0 ? `(${discountAmount.toFixed(2)})` : '0.00'}</td>
              <td className="py-2 text-right font-mono">{netMonthly.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Payment Schedule */}
      <div className="mt-6 text-sm">
        <div className="font-bold mb-1">PAYMENT SCHEDULE ({months} MONTHS)</div>
        <p className="mb-2">Payments are to be made on a monthly installment basis. Please note that this is a monthly arrangement and not a fixed-term contract.</p>
        <ul className="list-disc pl-6 space-y-0.5">
          <li>Installment 1 – {months}: {formatCurrency(netMonthly)} per month</li>
          <li>Total Project Value ({months} Months): <span className="font-bold">{formatCurrency(totalContract)}</span></li>
        </ul>
      </div>

      {/* Scope of Inclusion */}
      <div className="mt-6 text-sm">
        <div className="font-bold mb-1">SCOPE OF INCLUSION</div>
        <ul className="list-disc pl-6 space-y-0.5">
          {(data.selectedPackage === 'google-seo' || data.selectedPackage === 'both') && (
            <li><span className="font-semibold">Google Ads &amp; SEO:</span> Professional management of search marketing and organic discovery to capture high-intent leads.</li>
          )}
          {(data.selectedPackage === 'social' || data.selectedPackage === 'both') && (
            <li><span className="font-semibold">Social Media:</span> Ongoing management and brand awareness across {data.selectedPlatforms?.join(', ') || 'Meta platforms (Facebook/Instagram)'}.</li>
          )}
          {data.selectedPackage === 'custom' && data.customLineItems?.map((i) => (
            <li key={i.id}><span className="font-semibold">{i.description}</span></li>
          ))}
          <li><span className="font-semibold">Reporting:</span> Monthly performance updates tracking KPIs such as lead generation and secondary metrics.</li>
        </ul>
      </div>

      {/* Terms & Conditions */}
      <div className="mt-6 text-sm">
        <div className="font-bold mb-1">TERMS &amp; CONDITIONS</div>
        <ol className="list-decimal pl-6 space-y-0.5">
          <li><span className="font-semibold">Non-Contractual:</span> This agreement operates on a monthly basis without a long-term contract commitment.</li>
          <li><span className="font-semibold">Exclusions:</span> Ad spend budget is separate and managed directly by the client.</li>
          <li><span className="font-semibold">Validity:</span> This quotation is valid for 30 days from the date of issuance.</li>
          <li><span className="font-semibold">Acceptance:</span> Digital signing of this quotation constitutes a legally binding confirmation of order in lieu of an official Purchase Order (PO), and triggers issuance of an invoice.</li>
        </ol>
      </div>

      {docHash && (
        <div className="mt-8 pt-4 border-t border-black/30 text-[10px] text-black/60 break-all">
          Document hash (SHA-256): <span className="font-mono">{docHash}</span>
        </div>
      )}

      <div className="mt-8 pt-4 border-t border-black/30 text-center text-xs text-black/60">
        Should you have any enquiries concerning this quotation, please contact sales@leadzap.com.my
        <div className="font-bold mt-1">Thank You For Your Business!</div>
      </div>
    </section>
  );
};
