import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Download, Printer, X } from 'lucide-react';

export interface InvoiceRecord {
  id: string;
  invoice_number: string;
  client_name: string | null;
  customer_id: string | null;
  quotation_number: string | null;
  total_amount: number;
  currency: string;
  monthly_installment: number | null;
  installment_count: number | null;
  status: string;
  issued_at: string;
  due_date: string | null;
  paid_at: string | null;
  notes: string | null;
}

const fmtMoney = (v: number, currency = 'MYR') =>
  new Intl.NumberFormat('en-MY', { style: 'currency', currency, minimumFractionDigits: 2 }).format(v);

interface Props {
  invoice: InvoiceRecord | null;
  open: boolean;
  onClose: () => void;
}

const InvoiceView = ({ invoice, open, onClose }: Props) => {
  if (!invoice) return null;

  const handlePrint = () => {
    const node = document.getElementById('invoice-printable');
    if (!node) return;
    const win = window.open('', '_blank', 'width=900,height=1200');
    if (!win) return;
    win.document.write(`<!doctype html><html><head><title>${invoice.invoice_number}</title>
      <style>
        body{font-family:Inter,system-ui,sans-serif;color:#0a0a0a;background:#fff;padding:40px;}
        .header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #facc15;padding-bottom:24px;margin-bottom:32px;}
        .brand{font-size:28px;font-weight:800;letter-spacing:-0.5px;}
        .brand span{color:#facc15;}
        .meta{text-align:right;font-size:13px;line-height:1.6;}
        .meta .num{font-size:20px;font-weight:700;letter-spacing:1px;color:#0a0a0a;}
        .badge{display:inline-block;padding:4px 10px;border-radius:6px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;background:#fef3c7;color:#92400e;margin-top:6px;}
        .badge.paid{background:#d1fae5;color:#065f46;}
        .badge.overdue{background:#fee2e2;color:#991b1b;}
        .grid{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-bottom:32px;}
        .label{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#737373;font-weight:600;margin-bottom:6px;}
        .value{font-size:14px;line-height:1.5;}
        table{width:100%;border-collapse:collapse;margin:24px 0;}
        th{text-align:left;padding:12px;background:#f5f5f5;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#525252;border-bottom:2px solid #e5e5e5;}
        td{padding:14px 12px;border-bottom:1px solid #f0f0f0;font-size:14px;}
        .total-row{border-top:3px solid #0a0a0a;}
        .total-row td{padding:16px 12px;font-size:18px;font-weight:700;}
        .right{text-align:right;}
        .notes{margin-top:32px;padding:16px;background:#fafafa;border-radius:8px;font-size:13px;color:#525252;line-height:1.6;}
        .footer{margin-top:48px;padding-top:24px;border-top:1px solid #e5e5e5;font-size:11px;color:#a3a3a3;text-align:center;}
        @media print { body{padding:20px;} }
      </style></head><body>${node.innerHTML}<script>window.onload=()=>{window.print();}</script></body></html>`);
    win.document.close();
  };

  const status = invoice.status.toLowerCase();

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 bg-white text-neutral-900">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-3">
          <div className="text-sm font-medium text-neutral-600">Invoice {invoice.invoice_number}</div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />Print
            </Button>
            <Button size="sm" onClick={handlePrint}>
              <Download className="h-4 w-4 mr-2" />Download PDF
            </Button>
            <Button size="sm" variant="ghost" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div id="invoice-printable" className="p-10">
          <div className="header flex justify-between items-start border-b-4 border-yellow-400 pb-6 mb-8">
            <div>
              <div className="brand text-3xl font-extrabold tracking-tight">
                Lead<span className="text-yellow-500">zap</span>
              </div>
              <div className="text-sm text-neutral-500 mt-2">Digital Marketing Agency</div>
              <div className="text-xs text-neutral-400 mt-1">Malaysia</div>
            </div>
            <div className="meta text-right">
              <div className="text-xs uppercase tracking-widest text-neutral-500 font-semibold">Invoice</div>
              <div className="num text-2xl font-bold tracking-wider mt-1">{invoice.invoice_number}</div>
              <div className={`badge ${status} inline-block mt-2 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                status === 'overdue' ? 'bg-red-100 text-red-800' :
                'bg-amber-100 text-amber-800'
              }`}>{invoice.status}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 mb-8">
            <div>
              <div className="label text-xs uppercase tracking-widest text-neutral-500 font-semibold mb-2">Bill To</div>
              <div className="value text-base font-semibold">{invoice.client_name || '—'}</div>
              {invoice.customer_id && <div className="text-xs font-mono text-neutral-500 mt-1">Customer ID: {invoice.customer_id}</div>}
              {invoice.quotation_number && <div className="text-xs font-mono text-neutral-500">Quote: {invoice.quotation_number}</div>}
            </div>
            <div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="label text-xs uppercase tracking-widest text-neutral-500 font-semibold mb-1">Issued</div>
                  <div className="text-sm">{format(new Date(invoice.issued_at), 'dd MMM yyyy')}</div>
                </div>
                <div>
                  <div className="label text-xs uppercase tracking-widest text-neutral-500 font-semibold mb-1">Due Date</div>
                  <div className="text-sm">{invoice.due_date ? format(new Date(invoice.due_date), 'dd MMM yyyy') : '—'}</div>
                </div>
              </div>
              {invoice.paid_at && (
                <div className="mt-3">
                  <div className="label text-xs uppercase tracking-widest text-emerald-700 font-semibold mb-1">Paid</div>
                  <div className="text-sm">{format(new Date(invoice.paid_at), 'dd MMM yyyy')}</div>
                </div>
              )}
            </div>
          </div>

          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-3 bg-neutral-100 text-xs uppercase tracking-widest font-semibold border-b-2 border-neutral-200">Description</th>
                <th className="right text-right p-3 bg-neutral-100 text-xs uppercase tracking-widest font-semibold border-b-2 border-neutral-200">Qty</th>
                <th className="right text-right p-3 bg-neutral-100 text-xs uppercase tracking-widest font-semibold border-b-2 border-neutral-200">Rate</th>
                <th className="right text-right p-3 bg-neutral-100 text-xs uppercase tracking-widest font-semibold border-b-2 border-neutral-200">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border-b border-neutral-100">
                  <div className="font-medium">Digital Marketing Services</div>
                  <div className="text-xs text-neutral-500 mt-1">
                    Full package: {invoice.installment_count || 1} month(s) of services
                    {invoice.quotation_number && ` per quotation ${invoice.quotation_number}`}
                  </div>
                </td>
                <td className="right text-right p-3 border-b border-neutral-100">{invoice.installment_count || 1}</td>
                <td className="right text-right p-3 border-b border-neutral-100">
                  {invoice.monthly_installment ? fmtMoney(Number(invoice.monthly_installment), invoice.currency) : '—'}
                </td>
                <td className="right text-right p-3 border-b border-neutral-100 font-semibold">
                  {fmtMoney(Number(invoice.total_amount), invoice.currency)}
                </td>
              </tr>
              <tr className="total-row">
                <td colSpan={3} className="right text-right p-4 border-t-4 border-neutral-900 text-base uppercase tracking-wider font-bold">Total Due</td>
                <td className="right text-right p-4 border-t-4 border-neutral-900 text-xl font-extrabold">
                  {fmtMoney(Number(invoice.total_amount), invoice.currency)}
                </td>
              </tr>
            </tbody>
          </table>

          {invoice.notes && (
            <div className="notes mt-8 p-4 bg-neutral-50 rounded-lg text-sm text-neutral-600 leading-relaxed">
              <div className="label text-xs uppercase tracking-widest text-neutral-500 font-semibold mb-2">Notes</div>
              {invoice.notes}
            </div>
          )}

          <div className="footer mt-12 pt-6 border-t border-neutral-200 text-center text-xs text-neutral-400">
            Thank you for your business. Please reference invoice number {invoice.invoice_number} when making payment.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceView;
