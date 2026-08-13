import React from 'react';
import { Calendar } from 'lucide-react';

export default function FactuurPDFTemplate({ invoice }) {
  // Dynamic Props Extraction with Fallbacks
  const invId = invoice?.id || invoice?.invoiceNumber || 'F-2026-108';
  const customerName = invoice?.customer || invoice?.customerName || 'Bjorn Valk';
  const firstName = invoice?.firstName || (customerName ? customerName.trim().split(' ')[0] : 'Bjorn');
  
  const addressLine1 = invoice?.address || 'Dangeheuvel 3';
  const addressLine2 = invoice?.zipCity || '5101 WE Dongen';
  const phone = invoice?.phone || '+31 6 53962542';
  
  const invoiceDate = invoice?.date || invoice?.invoiceDate || '1 augustus 2026';
  const dueDate = invoice?.dueDate || invoice?.vervaldatum || '15 augustus 2026';
  const quoteRef = invoice?.quoteRef || invoice?.reference || 'Offerte OF-2026325';

  // Amount Calculations
  const numericAmount = typeof invoice?.amount === 'number'
    ? invoice.amount
    : parseFloat(String(invoice?.amount || '3495').replace(/[^0-9,.]/g, '').replace(',', '.')) || 3495;

  const totalIncl = numericAmount;
  const totalExcl = Math.round((totalIncl / 1.21) * 100) / 100;
  const vat21 = Math.round((totalIncl - totalExcl) * 100) / 100;

  const formatDutchCurrency = (num) => {
    return '€ ' + num.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Line items
  const items = (invoice?.items && invoice.items.length > 0)
    ? invoice.items
    : [
        {
          description: 'Buitenkeuken Thermo Fraké - 240 × 80 cm',
          subtext: 'Houten bovenblad met keramische stenen en uitsparing voor Big Green Egg Large · drie kastjes met twee inlegplanken · zes zwenkwielen · afgewerkt met twee lagen olie (naturel). Conform offerte-OF-2026325.',
          quantity: 1,
          price: formatDutchCurrency(totalIncl)
        },
        {
          description: `Bezorging ${invoice?.customer ? invoice.customer.split(' ')[0] : 'Dongen'}`,
          subtext: 'Geleverd op locatie.',
          quantity: 1,
          price: 'Inbegrepen'
        }
      ];

  return (
    <div id="printable-factuur" className="bg-white text-[#2B3028] font-body p-4 sm:p-8 max-w-4xl mx-auto rounded-2xl shadow-xl border border-[#D6CFC2] space-y-4 select-text print:shadow-none print:border-none print:p-0">
      
      {/* 1. HEADER LOGO & FACTUUR PILL BADGE */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src="/pdf_logo_dark.png" alt="Vanuit Ambacht" className="h-8 sm:h-10 w-auto object-contain" />
        </div>
        <span className="px-3.5 py-1 rounded-full border border-[#33422C]/40 text-[#33422C] text-[11px] font-bold uppercase tracking-widest">
          FACTUUR
        </span>
      </div>

      {/* 2. SUBHEADER / GREETING */}
      <div className="space-y-0.5 pt-0.5">
        <p className="text-[9.5px] font-bold text-dark/40 uppercase tracking-widest">FACTUUR {invId}</p>
        <h1 className="text-xl sm:text-2xl font-heading font-bold text-[#33422C]">
          Bedankt voor je vertrouwen, {firstName}.
        </h1>
      </div>

      {/* 3. 4-COLUMN SUMMARY METADATA CARD */}
      <div className="grid grid-cols-4 gap-2.5 p-3.5 bg-[#F5F2EB] rounded-xl border border-[#E5E0D5]">
        <div>
          <p className="text-[8.5px] font-bold uppercase text-dark/40 tracking-wider">FACTUURNUMMER</p>
          <p className="font-bold text-dark text-xs mt-0.5">{invId}</p>
        </div>
        <div>
          <p className="text-[8.5px] font-bold uppercase text-dark/40 tracking-wider">FACTUURDATUM</p>
          <p className="font-bold text-dark text-xs mt-0.5">{invoiceDate}</p>
        </div>
        <div>
          <p className="text-[8.5px] font-bold uppercase text-dark/40 tracking-wider">VERVALDATUM</p>
          <p className="font-bold text-dark text-xs mt-0.5">{dueDate}</p>
        </div>
        <div>
          <p className="text-[8.5px] font-bold uppercase text-dark/40 tracking-wider">REFERENTIE</p>
          <p className="font-bold text-dark text-xs mt-0.5">{quoteRef}</p>
        </div>
      </div>

      {/* 4. ADDRESSES 2-COLUMN SECTION */}
      <div className="grid grid-cols-2 gap-4 text-[11px]">
        <div className="space-y-0.5">
          <p className="text-[9.5px] font-bold uppercase text-dark/40 tracking-widest mb-0.5">FACTUUR AAN</p>
          <p className="font-bold text-dark text-xs">{customerName}</p>
          <p className="text-dark/70">{addressLine1}</p>
          <p className="text-dark/70">{addressLine2}</p>
          <p className="text-dark/60 font-mono text-[10px]">{phone}</p>
        </div>

        <div className="space-y-0.5">
          <p className="text-[9.5px] font-bold uppercase text-dark/40 tracking-widest mb-0.5">FACTUUR VAN</p>
          <p className="font-bold text-dark text-xs">Vanuit Ambacht</p>
          <p className="text-dark/70">Koningshof 33, 3451 LM Vleuten</p>
          <p className="text-dark/60 font-mono text-[10px]">KVK 93097429 · BTW NL866264863B01</p>
          <p className="text-dark/60 font-mono text-[10px]">info@vanuitambacht.nl · 06 82 00 80 25</p>
        </div>
      </div>

      {/* 5. LINE ITEMS TABLE */}
      <div className="pt-0.5">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-t-2 border-[#33422C] text-[9.5px] uppercase text-dark/60 font-bold tracking-widest">
              <th className="py-2 pr-3">OMSCHRIJVING</th>
              <th className="py-2 px-3 text-center">AANTAL</th>
              <th className="py-2 pl-3 text-right">BEDRAG</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E0D5]">
            {items.map((item, idx) => (
              <tr key={idx} className="align-top">
                <td className="py-2.5 pr-3 space-y-0.5">
                  <p className="font-bold text-dark text-xs">{item.description}</p>
                  {item.subtext && <p className="text-[10px] text-dark/60 leading-tight">{item.subtext}</p>}
                </td>
                <td className="py-2.5 px-3 text-center font-mono font-bold text-[11px]">{item.quantity || 1}</td>
                <td className="py-2.5 pl-3 text-right font-mono font-bold text-dark text-xs whitespace-nowrap">
                  {item.price}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 6. BOTTOM SPLIT SECTION — STRICT SIDE-BY-SIDE (grid-cols-2) */}
      <div className="grid grid-cols-2 gap-4 pt-1 items-start">
        
        {/* LEFT BOX: BETAALINFORMATIE */}
        <div className="bg-[#F5F2EB] p-4 rounded-xl border border-[#E5E0D5] space-y-2">
          <p className="text-[9.5px] font-bold uppercase text-dark/50 tracking-widest">BETAALINFORMATIE</p>
          <p className="text-[11px] text-dark/70">Maak het totaalbedrag binnen 14 dagen over op:</p>
          <p className="font-mono font-bold text-dark text-base">NL27 ABNA 0132 2698 56</p>
          <p className="text-[11px] text-dark/70">ten name van <strong className="text-dark font-bold">Vanuit Ambacht</strong></p>
          
          <div className="inline-block bg-[#E8E3D8] text-[#33422C] px-3 py-1 rounded-md text-[11px] font-mono font-bold border border-[#D6CFC2]">
            o.v.v. factuurnummer {invId}
          </div>
        </div>

        {/* RIGHT BOX: TOTALS CARD & REMINDER BAR */}
        <div className="space-y-2">
          <div className="bg-[#33422C] text-[#FDFBF7] p-4 rounded-xl shadow-md space-y-2 font-body">
            <div className="flex justify-between items-center text-[11px] text-cream/80 font-mono">
              <span>Totaal excl. btw</span>
              <span className="font-bold">{formatDutchCurrency(totalExcl)}</span>
            </div>
            <div className="flex justify-between items-center text-[11px] text-cream/80 font-mono">
              <span>Btw 21%</span>
              <span className="font-bold">{formatDutchCurrency(vat21)}</span>
            </div>

            <div className="h-px bg-white/20"></div>

            <div className="flex justify-between items-center">
              <span className="font-bold text-xs">Te betalen</span>
              <span className="font-heading font-bold text-xl sm:text-2xl text-cream">{formatDutchCurrency(totalIncl)}</span>
            </div>
            <p className="text-[9px] text-cream/60 font-mono text-right">Betalingstermijn 14 dagen</p>
          </div>

          <div className="bg-[#F5F2EB] p-2 rounded-lg border border-[#E5E0D5] text-center text-[11px] font-semibold text-[#33422C] flex items-center justify-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-700" />
            <span>Graag betalen vóór {dueDate}</span>
          </div>
        </div>
      </div>

      {/* 7. PERSONAL NOTE BOX */}
      <div className="bg-[#F5F2EB] p-3 rounded-lg border-l-4 border-l-[#33422C] space-y-0.5">
        <p className="font-heading italic text-xs text-[#33422C]">
          Veel plezier van je buitenkeuken. Vragen of iets nodig? Je weet ons te vinden.
        </p>
        <p className="text-[9px] font-bold uppercase tracking-wider text-dark/50 font-mono">
          TIM & BRAM · VANUIT AMBACHT
        </p>
      </div>

      {/* 8. FOOTER */}
      <div className="pt-2 border-t border-[#E5E0D5] flex justify-between items-center text-[9.5px] text-dark/40 font-mono">
        <span className="font-bold text-dark/60">VANUIT AMBACHT</span>
        <span>Koningshof 33, 3451 LM Vleuten · info@vanuitambacht.nl · vanuitambacht.nl</span>
        <span>1/1</span>
      </div>
    </div>
  );
}
