import { jsPDF } from 'jspdf';

/**
 * Vanuit Ambacht — Direct Client-Side Vector PDF File Generator
 * Uses jsPDF to generate a real PDF document and triggers doc.save(fileName)
 * directly downloading the file into the user's Downloads folder with 0 print dialogs.
 */
export function downloadDirectPdfFile({
  quoteId = 'OF-2026331',
  customerName = 'Sonu Jain',
  customerEmail = 'sonu.jain@example.com',
  category = 'Buitenkeukens',
  size = '8,00 × 4,00 m',
  material = 'Douglas wood with concrete countertop',
  priceExclVat = 34200,
  vatRate = 21,
  vatAmount = 7182,
  totalInclVat = 41382,
  isDraft = false
}) {
  const cleanCustomerSlug = (customerName || 'Sonu-Jain')
    .replace(/[^a-zA-Z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  const fileName = isDraft
    ? `Quote-${quoteId}-${cleanCustomerSlug}-DRAFT.pdf`
    : `Quote-${quoteId}-${cleanCustomerSlug}.pdf`;

  const doc = new jsPDF();
  
  // Colors
  const primaryColor = [62, 78, 54]; // #3E4E36
  const darkColor = [30, 30, 30];
  const accentColor = [112, 98, 79];

  // Brand Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...primaryColor);
  doc.text('VANUIT AMBACHT', 20, 25);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...accentColor);
  doc.text(isDraft ? 'INTERNE CONCEPT OFFERTE (NIET VERZONDEN)' : 'OFFICIËLE MAATOFFERTE', 20, 32);

  // Divider Line
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(1);
  doc.line(20, 36, 190, 36);

  // Quote Metadata
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...primaryColor);
  doc.text(`Offerte ID: ${quoteId}`, 20, 48);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...darkColor);
  doc.text(`Klantnaam: ${customerName}`, 20, 56);
  doc.text(`E-mailadres: ${customerEmail}`, 20, 62);
  doc.text(`Datum: ${new Date().toLocaleDateString('nl-NL')}`, 20, 68);

  // Specifications Box
  doc.setFillColor(248, 247, 244); // #F8F7F4
  doc.roundedRect(20, 75, 170, 25, 3, 3, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...accentColor);
  doc.text('PROJECT SPECIFICATIES:', 25, 84);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  doc.text(`Maatwerk ${category} (${size})`, 25, 92);
  doc.text(`Afwerking: ${material}`, 25, 97);

  // Financial Table Header
  doc.setFillColor(237, 232, 223); // #EDE8DF
  doc.rect(20, 110, 170, 10, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...primaryColor);
  doc.text('OMSCHRIJVING', 25, 116.5);
  doc.text('BEDRAG', 145, 116.5);

  // Financial Table Rows
  const fmt = (num) => `EUR ${(num || 0).toLocaleString('nl-NL')}`;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...darkColor);

  doc.text(`Bespoke ${category} (${size})`, 25, 128);
  doc.text(fmt(priceExclVat), 145, 128);

  doc.setDrawColor(214, 207, 194);
  doc.line(20, 133, 190, 133);

  doc.text(`BTW (${vatRate}%)`, 25, 142);
  doc.text(fmt(vatAmount), 145, 142);

  doc.line(20, 147, 190, 147);

  // Total Row
  doc.setFillColor(248, 247, 244);
  doc.rect(20, 150, 170, 12, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...primaryColor);
  doc.text('Totaal Incl. BTW', 25, 158);
  doc.text(fmt(totalInclVat), 145, 158);

  // Status Disclaimer Badge Box
  if (isDraft) {
    doc.setFillColor(254, 243, 199); // amber
    doc.roundedRect(20, 175, 170, 15, 3, 3, 'F');
    doc.setFontSize(10);
    doc.setTextColor(146, 64, 14);
    doc.text('DRAFT - NIET VERZONDEN NAAR KLANT (Conceptfase)', 35, 184);
  } else {
    doc.setFillColor(240, 253, 244); // green
    doc.roundedRect(20, 175, 170, 15, 3, 3, 'F');
    doc.setFontSize(10);
    doc.setTextColor(22, 101, 52);
    doc.text('OFFICIEEL GOEDGEKEURDE OFFERTE DOOR VANUIT AMBACHT', 35, 184);
  }

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text(`Gegenereerd door Vanuit Ambacht Cloud Management • ${fileName}`, 35, 270);

  // DIRECT AUTOMATIC FILE DOWNLOAD TO USER'S DOWNLOADS FOLDER (0 PRINT DIALOGS)
  doc.save(fileName);
  return fileName;
}
