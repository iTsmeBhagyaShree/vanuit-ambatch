import { jsPDF } from 'jspdf';

/**
 * Vanuit Ambacht — Direct Client-Side Vector PDF File Generator
 * Generates an official, beautiful branded PDF document matching the preview 100%
 * and calls doc.save("Quote-{number} {customer}.pdf") to trigger an actual file download.
 */
export function downloadDirectPdfFile(quoteData = {}) {
  // Extract properties supporting both raw params or full quote object
  const quote = quoteData.quote || quoteData;
  const quoteId = quote.id || quote.quoteId || 'OF-2026331';
  
  const rawCustomer = typeof quote.customer === 'object' ? quote.customer.name : quote.customer;
  const customerName = rawCustomer || quote.customerName || 'Sonu Jain';
  const customerEmail = quote.customerEmail || quote.email || 'klant@vanuitambacht.nl';
  const customerPhone = quote.customerPhone || quote.phone || '+31 6 12345678';

  const category = quote.category || quote.project || 'Buitenkeukens';
  const woodType = quote.woodType || quote.configuration?.woodType || 'Thermo Fraké';
  const dimensions = quote.dimensions || quote.configuration?.dimensions || '240 × 80 cm';

  // Exact File Naming Rule: Quote-{number} {customer}.pdf
  const cleanCustomerName = String(customerName)
    .replace(/[\\/:*?"<>|]/g, '')
    .trim();

  const fileName = `Quote-${quoteId} ${cleanCustomerName}.pdf`;

  // Itemized breakdown & totals
  const items = (quote.items && quote.items.length > 0)
    ? quote.items
    : (quote.investment?.lineItems && quote.investment.lineItems.length > 0)
    ? quote.investment.lineItems
    : [
        {
          description: `Outdoor Kitchen ${woodType} (${dimensions})`,
          quantity: 1,
          unitPrice: typeof quote.amount === 'number' ? quote.amount : parseFloat(String(quote.amount || '3495').replace(/[^0-9.]/g, '')) || 3495
        }
      ];

  const subtotalExcl = items.reduce((acc, i) => {
    const qty = Number(i.quantity || 1);
    const prc = Number(i.unitPrice || i.priceInclVat || 0);
    return acc + (qty * prc);
  }, 0);

  const totalIncl = typeof quote.amount === 'number'
    ? quote.amount
    : (parseFloat(String(quote.amount || '0').replace(/[^0-9.]/g, '')) || subtotalExcl || 3495);

  const totalExcl = Math.round((totalIncl / 1.21) * 100) / 100;
  const vatAmount = Math.round((totalIncl - totalExcl) * 100) / 100;

  const doc = new jsPDF();
  
  // Color Palette
  const primaryColor = [62, 78, 54];   // #3E4E36 Forest Green
  const darkColor = [43, 48, 40];     // #2B3028 Dark Gray
  const accentColor = [217, 119, 6];   // #D97706 Amber
  const warmBg = [245, 242, 235];     // #F5F2EB Cream

  // 1. BRAND HEADER
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...primaryColor);
  doc.text('VANUIT AMBACHT', 20, 24);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...accentColor);
  doc.text('OFFICIËLE COMMERCIËLE MAATOFFERTE', 20, 31);

  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.8);
  doc.line(20, 35, 190, 35);

  // 2. METADATA HEADER BOX (4 COLUMNS)
  doc.setFillColor(...warmBg);
  doc.roundedRect(20, 42, 170, 24, 2, 2, 'F');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 100, 100);
  doc.text('OFFERTENUMMER', 25, 49);
  doc.text('DATUM', 70, 49);
  doc.text('GELDIG T/M', 110, 49);
  doc.text('STATUS', 150, 49);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text(quoteId, 25, 57);
  doc.text(quote.date || new Date().toLocaleDateString('nl-NL'), 70, 57);
  doc.text(quote.validUntil || 'In overleg', 110, 57);

  doc.setTextColor(...accentColor);
  doc.text(quote.status || 'Concept', 150, 57);

  // 3. CUSTOMER & PROJECT SPECIFICATION CARDS
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('KLANTGEGEVENS', 20, 75);
  doc.text('SPECIFICATIES', 105, 75);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...darkColor);
  doc.text(`Naam: ${customerName}`, 20, 83);
  doc.text(`E-mail: ${customerEmail}`, 20, 89);
  doc.text(`Telefoon: ${customerPhone}`, 20, 95);

  doc.text(`Project: ${category}`, 105, 83);
  doc.text(`Houtsoort: ${woodType}`, 105, 89);
  doc.text(`Afmeting: ${dimensions}`, 105, 95);

  // 4. FINANCIAL ITEMS TABLE
  doc.setFillColor(...primaryColor);
  doc.rect(20, 106, 170, 9, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('OMSCHRIJVING', 25, 112);
  doc.text('AANTAL', 125, 112);
  doc.text('BEDRAG', 160, 112);

  let y = 122;
  items.forEach((item, idx) => {
    const desc = item.description || item.title || `Maatwerk item ${idx + 1}`;
    const qty = item.quantity || 1;
    const price = Number(item.unitPrice || item.priceInclVat || totalIncl);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...darkColor);
    doc.text(desc, 25, y);

    doc.setFont('helvetica', 'normal');
    doc.text(String(qty), 130, y);

    const priceText = item.isIncluded || price === 0
      ? 'Inbegrepen'
      : `EUR ${price.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}`;
    doc.text(priceText, 160, y);

    y += 10;
    doc.setDrawColor(230, 225, 215);
    doc.line(20, y - 4, 190, y - 4);
  });

  // 5. TOTALS SUMMARY BOX
  y += 5;
  doc.setFillColor(...warmBg);
  doc.roundedRect(105, y, 85, 36, 2, 2, 'F');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...darkColor);
  doc.text('Totaal excl. btw:', 110, y + 9);
  doc.text(`EUR ${totalExcl.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}`, 155, y + 9);

  doc.text('Btw (21%):', 110, y + 17);
  doc.text(`EUR ${vatAmount.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}`, 155, y + 17);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  doc.text('Totaal incl. btw:', 110, y + 28);
  doc.setTextColor(...accentColor);
  doc.text(`EUR ${totalIncl.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}`, 150, y + 28);

  // 6. PAYMENT TERMS & INSTALMENTS
  y += 48;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...primaryColor);
  doc.text('BETALINGSVOORWAARDEN (50% / 50%)', 20, y);

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(214, 207, 194);
  doc.roundedRect(20, y + 5, 80, 18, 2, 2, 'DF');
  doc.roundedRect(110, y + 5, 80, 18, 2, 2, 'DF');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...accentColor);
  doc.text('50% Aanbetaling bij akkoord', 25, y + 12);
  doc.text('50% Eindfactuur bij oplevering', 115, y + 12);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...darkColor);
  doc.text(`EUR ${(totalIncl * 0.5).toLocaleString('nl-NL', { minimumFractionDigits: 2 })}`, 25, y + 18);
  doc.text(`EUR ${(totalIncl * 0.5).toLocaleString('nl-NL', { minimumFractionDigits: 2 })}`, 115, y + 18);

  // 7. FOOTER BRANDING & FILE STAMP
  doc.setFontSize(8);
  doc.setTextColor(140, 140, 140);
  doc.text(`Vanuit Ambacht • Koningshof 33, 3451 LM Vleuten • KVK 93097429 • BTW NL866264863B01`, 20, 280);
  doc.text(`Bestand: ${fileName}`, 20, 285);

  // DIRECT AUTOMATIC FILE DOWNLOAD TO USER'S DOWNLOADS FOLDER
  doc.save(fileName);
  return fileName;
}
