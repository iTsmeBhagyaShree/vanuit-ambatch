/**
 * Bookkeeping & Allocation Processing — Vanuit Ambacht
 * ABN AMRO Statement Parser & Categorization Engine (Developer Briefing v1.2 - STEP 1)
 */

export const BOOKKEEPING_CATEGORIES = [
  'Revenue — Outdoor Kitchens',
  'Revenue — bol.com',
  'bol.com sales costs / barcodes',
  'Purchasing',
  'Transport',
  'Shipping costs',
  'Advertising',
  'Software',
  'Payment provider fees',
  'Bank charges',
  'VAT remittance',
  'Internal Transfer / Kruispost',
  'Credit Card / Suspense',
  'Office supplies',
  'Travel expenses',
  'Entertainment',
  'Customer gifts',
  'Review Item / Vraagpost'
];

export const COMPANY_SAVINGS_IBAN = 'NL44ABNA0987654321';

// Fixed Counterparties Recognition Dictionary (Decision Tree Rule 2)
export const FIXED_COUNTERPARTIES = [
  { keywords: ['Ruben Verbeij', 'Meubels Op Maat'], category: 'Purchasing' },
  { keywords: ['Houtslagers'], category: 'Purchasing' },
  { keywords: ['BOLCOM', 'bol.com'], category: 'Revenue — bol.com', hasBolSpec: true },
  { keywords: ['PayPal', 'PayPal Europe', 'DE8937040044', 'PayPal S.a.r.l'], category: 'Advertising' },
  { keywords: ['Google Cloud', 'Google'], category: 'Software' },
  { keywords: ['TransIP'], category: 'Software' },
  { keywords: ['SkillSource', 'e-Boekhouden'], category: 'Software' },
  { keywords: ['Dubline'], category: 'Software' },
  { keywords: ['Buckaroo'], category: 'Payment provider fees' },
  { keywords: ['Smart Fulfilment'], category: 'Transport' }, // IMPORTANT: NOT Purchasing!
  { keywords: ['PostNL'], category: 'Shipping costs' },
  { keywords: ['GS1', 'GS1 Nederland'], category: 'bol.com sales costs / barcodes' }, // CORRECT: GS1 = bol.com sales costs / barcodes
  { keywords: ['ABN AMRO Bank', 'ABN AMRO Cost', 'Correspondent Fee', 'Bankkosten'], category: 'Bank charges' },
  { keywords: ['Belastingdienst'], category: 'VAT remittance' },
  { keywords: ['Int Card Services', 'ICS'], category: 'Credit Card / Suspense' },
  { keywords: ['Alibaba', 'Alibaba.com'], category: 'Purchasing' }, // IMPORTANT: NO separate Kliko Purchasing category!
  { keywords: ['Md. Joni Hossain', 'Joni Hossain'], category: 'Purchasing' },
  { keywords: ['WordPress', 'Jetpack'], category: 'Software' },
  { keywords: ['Canva'], category: 'Software' },
  { keywords: ['Coolblue'], category: 'Office supplies' },
  { keywords: ['Beef.Steak', 'Luxury Meat'], category: 'Customer gifts' }
];

// Customer Payment Patterns (Decision Tree Rule 3) - Tolerant of typos & whitespace
const CUSTOMER_PAYMENT_PATTERNS = [
  /2025-?\d{3}/i,
  /FA-2026-?\d{3}/i,
  /OF-2026-?\d{3}/i,
  /Q-\d{4}/i,
  /INV-\d{4}/i,
  /aan\s*betaling/i,
  /slot\s*betaling/i,
  /slot\s*factuur/i,
  /50\s*procent/i,
  /90\s*procent/i,
  /50\s*%/i,
  /90\s*%/i
];

/**
 * Classifies a single transaction based on Briefing v1.2 Decision-Tree Logic
 */
export function categorizeTransaction(tx) {
  const counterName = (tx.counterName || '').trim();
  const counterIban = (tx.counterIban || '').replace(/\s+/g, '');
  const description = (tx.description || tx.remi || '').trim();
  const fullText = `${counterName} ${counterIban} ${description}`.toLowerCase();

  // SPECIAL CASE: €0.10 Verification payment/refund (Nets to zero)
  const val = Number(tx.debit || tx.credit || tx.numericAmount || 0);
  if (val === 0.10 || fullText.includes('verificatie') || fullText.includes('1 cent') || fullText.includes('0.10')) {
    return {
      category: 'Internal Transfer / Kruispost',
      status: 'Recognized',
      reviewReason: null,
      isInternal: true
    };
  }

  // SPECIAL CASE: Refunds / Stornos (Returns to original category, NOT revenue)
  if (fullText.includes('refund') || fullText.includes('terugbetaling') || fullText.includes('storno') || fullText.includes('retour')) {
    for (const item of FIXED_COUNTERPARTIES) {
      if (item.keywords.some(kw => fullText.includes(kw.toLowerCase()))) {
        return {
          category: item.category,
          status: 'Recognized',
          reviewReason: null,
          isInternal: false
        };
      }
    }
  }

  // FIRST: Internal Transfers (Zakelijk Flexibel Sparen / Company Savings)
  if (
    counterIban === COMPANY_SAVINGS_IBAN ||
    fullText.includes('zakelijk flexibel sparen') ||
    (counterName.toUpperCase().includes('VANUIT AMBACHT') && fullText.includes('sparen'))
  ) {
    return {
      category: 'Internal Transfer / Kruispost',
      status: 'Internal Transfer',
      reviewReason: null,
      isInternal: true
    };
  }

  // SECOND: Fixed Counterparties Recognition Table
  for (const item of FIXED_COUNTERPARTIES) {
    const isMatch = item.keywords.some(kw => fullText.includes(kw.toLowerCase()));
    if (isMatch) {
      return {
        category: item.category,
        status: 'Recognized',
        reviewReason: null,
        isInternal: false
      };
    }
  }

  // THIRD: Customer Payment Recognition (Outdoor Kitchens)
  const isCustomerPayment = CUSTOMER_PAYMENT_PATTERNS.some(pat => pat.test(description) || pat.test(counterName));
  if (isCustomerPayment) {
    return {
      category: 'Revenue — Outdoor Kitchens',
      status: 'Recognized',
      reviewReason: null,
      isInternal: false
    };
  }

  // FOURTH: Other Fixed Assignments (BEA / iDEAL without invoice pattern)
  if (tx.type === 'BEA card payment' || tx.type === 'iDEAL') {
    if (fullText.includes('restaurant') || fullText.includes('hotel') || fullText.includes('cafe')) {
      return { category: 'Entertainment', status: 'Recognized', reviewReason: null };
    }
    if (fullText.includes('parkeren') || fullText.includes('garage') || fullText.includes('q-park')) {
      return { category: 'Travel expenses', status: 'Recognized', reviewReason: null };
    }
    // High Value Equipment > €450 excl. VAT check
    if (val > 450 && (fullText.includes('laptop') || fullText.includes('apple') || fullText.includes('computer'))) {
      return { category: 'Fixed Asset / Depreciated', status: 'Recognized', reviewReason: null };
    }
  }

  // FIFTH: UNKNOWN TRANSACTIONS -> Review Item / Vraagpost
  return {
    category: 'Review Item / Vraagpost',
    status: 'Review Needed',
    reviewReason: `Onbekende tegenpartij "${counterName || 'Onbekend'}" zonder herkenbaar factuurnummer of kenmerk.`,
    isInternal: false
  };
}

/**
 * Normalizes raw transaction input into unified ABN AMRO Transaction object
 */
export function normalizeTransaction(raw) {
  const isDebit = Number(raw.debit) > 0 || raw.type === 'Expense';
  const debit = isDebit ? Math.abs(Number(raw.debit || raw.numericAmount || 0)) : 0;
  const credit = !isDebit ? Math.abs(Number(raw.credit || raw.numericAmount || 0)) : 0;
  const numericAmount = isDebit ? debit : credit;

  const baseTx = {
    id: raw.id || `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    date: raw.date || new Date().toISOString().split('T')[0],
    description: raw.description || raw.remi || 'ABN AMRO Transactie',
    debit,
    credit,
    numericAmount,
    amountStr: `€ ${numericAmount.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}`,
    counterIban: raw.counterIban || raw.iban || 'NL91 ABNA 0000 0000 00',
    counterName: raw.counterName || raw.name || 'Onbekend',
    remi: raw.remi || raw.description || '',
    eref: raw.eref || raw.reference || `REF-${Math.floor(Math.random() * 1000000)}`,
    type: raw.type || 'Transfer'
  };

  const catResult = categorizeTransaction(baseTx);
  return { ...baseTx, ...catResult };
}

/**
 * Statement Validation Engine:
 * Validates Opening Balance + Credits - Debits == Closing Balance
 * Validates Parsed Count == Header Expected Count
 */
export function validateStatement(header, transactionsList) {
  const opening = Number(header.openingBalance || 0);
  const closing = Number(header.closingBalance || 0);
  const expectedCredits = Number(header.totalCredits || 0);
  const expectedDebits = Number(header.totalDebits || 0);
  const expectedCount = Number(header.expectedCount || 0);

  const actualCount = transactionsList.length;
  const actualCredits = Math.round(transactionsList.reduce((acc, t) => acc + (Number(t.credit) || 0), 0) * 100) / 100;
  const actualDebits = Math.round(transactionsList.reduce((acc, t) => acc + (Number(t.debit) || 0), 0) * 100) / 100;
  const calculatedClosing = Math.round((opening + actualCredits - actualDebits) * 100) / 100;

  const baseMeta = { actualCount, actualCredits, actualDebits, calculatedClosing };

  // 1. Transaction Count Validation
  if (expectedCount > 0 && actualCount !== expectedCount) {
    return {
      isValid: false,
      errorType: 'COUNT_MISMATCH',
      errorMessage: `Transactietotaal afwijking: Afschrift header vermeldt ${expectedCount} transacties, maar er zijn ${actualCount} transacties ingelezen.`,
      ...baseMeta
    };
  }

  // 2. Total Credits Validation
  if (expectedCredits > 0 && Math.abs(actualCredits - expectedCredits) > 0.01) {
    return {
      isValid: false,
      errorType: 'CREDIT_TOTAL_MISMATCH',
      errorMessage: `Bijschrijvingen totaal afwijking: Verwacht € ${expectedCredits.toLocaleString('nl-NL')}, maar berekend € ${actualCredits.toLocaleString('nl-NL')}.`,
      ...baseMeta
    };
  }

  // 3. Total Debits Validation
  if (expectedDebits > 0 && Math.abs(actualDebits - expectedDebits) > 0.01) {
    return {
      isValid: false,
      errorType: 'DEBIT_TOTAL_MISMATCH',
      errorMessage: `Afschrijvingen totaal afwijking: Verwacht € ${expectedDebits.toLocaleString('nl-NL')}, maar berekend € ${actualDebits.toLocaleString('nl-NL')}.`,
      ...baseMeta
    };
  }

  // 4. Opening + Credits - Debits == Closing Balance Validation
  if (Math.abs(calculatedClosing - closing) > 0.01) {
    return {
      isValid: false,
      errorType: 'BALANCE_CHECKSUM_ERROR',
      errorMessage: `Saldo Controle Mismatch: Saldo Begin (€ ${opening.toLocaleString('nl-NL')}) + Bij (€ ${actualCredits.toLocaleString('nl-NL')}) - Af (€ ${actualDebits.toLocaleString('nl-NL')}) = € ${calculatedClosing.toLocaleString('nl-NL')}, maar Afschrift Eindsaldo is € ${closing.toLocaleString('nl-NL')}.`,
      ...baseMeta
    };
  }

  return {
    isValid: true,
    ...baseMeta
  };
}

/**
 * Dual ABN Format Parser: Parses both OLD and NEW ABN AMRO statement text formats
 */
export function parseABNStatementText(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const transactions = [];

  let currentTx = null;

  lines.forEach(line => {
    // NEW FORMAT tags: /TRTP/, /IBAN/, /NAME/, /REMI/, /EREF/
    if (line.startsWith('/TRTP/')) {
      if (currentTx) transactions.push(normalizeTransaction(currentTx));
      currentTx = {
        type: line.replace('/TRTP/', '').replace('/', '').trim() || 'Transfer',
        description: '',
        debit: 0,
        credit: 0
      };
    } else if (line.startsWith('/IBAN/') && currentTx) {
      currentTx.counterIban = line.replace('/IBAN/', '').replace('/', '').trim();
    } else if (line.startsWith('/NAME/') && currentTx) {
      currentTx.counterName = line.replace('/NAME/', '').replace('/', '').trim();
    } else if (line.startsWith('/REMI/') && currentTx) {
      currentTx.remi = line.replace('/REMI/', '').replace('/', '').trim();
      currentTx.description = currentTx.remi;
    } else if (line.startsWith('/EREF/') && currentTx) {
      currentTx.eref = line.replace('/EREF/', '').replace('/', '').trim();
    } else if (line.startsWith('/AMT/') && currentTx) {
      const amtVal = parseFloat(line.replace('/AMT/', '').replace('/', '').replace(',', '.'));
      if (amtVal < 0) currentTx.debit = Math.abs(amtVal);
      else currentTx.credit = Math.abs(amtVal);
    }
    // OLD FORMAT lines: SEPA Overboeking, IBAN:, Naam:, Omschrijving:, Kenmerk:
    else if (line.toLowerCase().includes('sepa overboeking') || line.toLowerCase().includes('ideal') || line.toLowerCase().includes('bea card')) {
      if (currentTx) transactions.push(normalizeTransaction(currentTx));
      currentTx = {
        type: line.includes('iDEAL') ? 'iDEAL' : line.includes('BEA') ? 'BEA card payment' : 'Transfer',
        description: line,
        debit: 0,
        credit: 0
      };
    } else if (line.startsWith('IBAN:') && currentTx) {
      currentTx.counterIban = line.replace('IBAN:', '').trim();
    } else if (line.startsWith('Naam:') && currentTx) {
      currentTx.counterName = line.replace('Naam:', '').trim();
    } else if (line.startsWith('Omschrijving:') && currentTx) {
      currentTx.remi = line.replace('Omschrijving:', '').trim();
      currentTx.description = currentTx.remi;
    } else if (line.startsWith('Kenmerk:') && currentTx) {
      currentTx.eref = line.replace('Kenmerk:', '').trim();
    } else if ((line.startsWith('Bedrag:') || line.startsWith('Bedrag (€):')) && currentTx) {
      const numStr = line.replace(/[^0-9,-]/g, '').replace(',', '.');
      const val = parseFloat(numStr);
      if (val < 0) currentTx.debit = Math.abs(val);
      else currentTx.credit = Math.abs(val);
    }
  });

  if (currentTx) transactions.push(normalizeTransaction(currentTx));

  return transactions;
}
