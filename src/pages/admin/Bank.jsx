import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { 
  Plus, Search, Filter, X, CheckCircle, RotateCcw, ArrowDownRight, ArrowUpRight, 
  Landmark, Percent, UploadCloud, FileSpreadsheet, FileText, Sparkles, Check, 
  FolderOpen, ChevronDown, AlertTriangle, ShieldCheck, Tag, Eye, RefreshCw
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { mockBankTransactions as defaultTransactions } from '../../utils/mockData';
import { parseABNStatementText, validateStatement, normalizeTransaction, categorizeTransaction, BOOKKEEPING_CATEGORIES } from '../../utils/abnParser';
import { matchPaymentToOrder, calculateOrderSettlement, calculateProjectMargin } from '../../utils/orderMatcher';
import { matchPurchaseToProject, calculateProjectMarginWithPurchasing, UNIFIED_PURCHASING_CATEGORY } from '../../utils/purchasingAllocator';
import { generateJournalEntries } from '../../utils/journalEngine';
import { mockInvoices } from '../../utils/mockData';

export default function Bank() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState('transactions'); // 'transactions' | 'import' | 'review'
  
  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [reviewStatusFilter, setReviewStatusFilter] = useState('All');

  const [modalOpen, setModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Dropdown & Allocation UI states
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [reclassifyModalTx, setReclassifyModalTx] = useState(null);
  const [newSelectedCategory, setNewSelectedCategory] = useState('');
  const [bolSpecModalTx, setBolSpecModalTx] = useState(null);
  const [manualAllocateTx, setManualAllocateTx] = useState(null);
  const [selectedTargetOrderId, setSelectedTargetOrderId] = useState('');
  const [journalModalTx, setJournalModalTx] = useState(null);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // =========================================================
  // STATEMENT IMPORT ENGINE STATE (ABN AMRO DUAL FORMAT)
  // =========================================================
  const [fileFormat, setFileFormat] = useState('PDF');
  const [importFile, setImportFile] = useState(null);
  const [rawTextContent, setRawTextContent] = useState('');
  const [parsedStatementTxns, setParsedStatementTxns] = useState([]);
  const [validationResult, setValidationResult] = useState(null);

  // Statement Header Controls (Default Sample)
  const [headerInfo, setHeaderInfo] = useState({
    openingBalance: 10000,
    totalCredits: 3495,
    totalDebits: 4910,
    closingBalance: 8585,
    expectedCount: 6
  });

  const importFileInputRef = useRef(null);

  // Pre-configured Sample ABN AMRO Statement Texts for Instant Testing
  const SAMPLE_OLD_FORMAT_TEXT = `SEPA Overboeking
IBAN: NL91 ABNA 0412 3456 78
Naam: Bjorn Valk
Omschrijving: 50% Aanbetaling Keuken Bjorn Valk (FA-2026-108)
Bedrag (€): +3495,00
Kenmerk: EREF-2026-9001

SEPA Overboeking
IBAN: NL44 ABNA 0987 6543 21
Naam: VANUIT AMBACHT
Omschrijving: Interne Overboeking Zakelijk Flexibel Sparen
Bedrag (€): -2000,00
Kenmerk: EREF-2026-9002

SEPA Overboeking
IBAN: NL12 ABNA 0555 4443 22
Naam: Ruben Verbeij Meubels Op Maat
Omschrijving: Houtbewerking eiken frame PRJ-101
Bedrag (€): -1250,00
Kenmerk: EREF-2026-9003

SEPA Overboeking
IBAN: NL88 INGB 0001 2345 67
Naam: Smart Fulfilment B.V.
Omschrijving: Transport & Koerier Levering Dongen
Bedrag (€): -450,00
Kenmerk: EREF-2026-9004

iDEAL
IBAN: NL03 RABO 0111 2223 33
Naam: Alibaba.com Singapore
Omschrijving: Order ALI-9821 RVS Beslag
Bedrag (€): -890,00
Kenmerk: EREF-2026-9005

BEA card payment
IBAN: GB99 BARK 1234 5678 90
Naam: Global Trading Direct Ltd
Omschrijving: Consulting Services Invoice 901
Bedrag (€): -320,00
Kenmerk: EREF-2026-9006`;

  const SAMPLE_NEW_FORMAT_TEXT = `/TRTP/SEPA OVERBOEKING/
/IBAN/NL91ABNA0412345678/
/NAME/Bjorn Valk/
/REMI/50% Aanbetaling Keuken Bjorn Valk (FA-2026-108)/
/AMT/3495,00/
/EREF/EREF-2026-9001/

/TRTP/SEPA OVERBOEKING/
/IBAN/NL44ABNA0987654321/
/NAME/VANUIT AMBACHT/
/REMI/Interne Overboeking Zakelijk Flexibel Sparen/
/AMT/-2000,00/
/EREF/EREF-2026-9002/

/TRTP/SEPA OVERBOEKING/
/IBAN/NL12ABNA0555444322/
/NAME/Ruben Verbeij Meubels Op Maat/
/REMI/Houtbewerking eiken frame PRJ-101/
/AMT/-1250,00/
/EREF/EREF-2026-9003/

/TRTP/SEPA OVERBOEKING/
/IBAN/NL88INGB0001234567/
/NAME/Smart Fulfilment B.V./
/REMI/Transport & Koerier Levering Dongen/
/AMT/-450,00/
/EREF/EREF-2026-9004/

/TRTP/iDEAL/
/IBAN/NL03RABO0111222333/
/NAME/Alibaba.com Singapore/
/REMI/Order ALI-9821 RVS Beslag/
/AMT/-890,00/
/EREF/EREF-2026-9005/

/TRTP/BEA card payment/
/IBAN/GB99BARK1234567890/
/NAME/Global Trading Direct Ltd/
/REMI/Consulting Services Invoice 901/
/AMT/-320,00/
/EREF/EREF-2026-9006/`;

  // Load Transactions from LocalStorage on mount
  useEffect(() => {
    try {
      const savedTxns = localStorage.getItem('app_bank_txns_v2');
      if (savedTxns) {
        const parsed = JSON.parse(savedTxns);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTransactions(parsed);
          return;
        }
      }
    } catch (e) {}

    setTransactions(defaultTransactions);
    localStorage.setItem('app_bank_txns_v2', JSON.stringify(defaultTransactions));
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  // Re-run statement parsing & validation whenever raw text or header info changes
  const processStatementParsing = (text, currentHeader) => {
    if (!text || !text.trim()) {
      setParsedStatementTxns([]);
      setValidationResult(null);
      return;
    }

    const parsed = parseABNStatementText(text);
    setParsedStatementTxns(parsed);

    const val = validateStatement(currentHeader, parsed);
    setValidationResult(val);
  };

  const handleTextChange = (txt) => {
    setRawTextContent(txt);
    processStatementParsing(txt, headerInfo);
  };

  const handleHeaderChange = (field, val) => {
    const updatedHeader = { ...headerInfo, [field]: Number(val) || 0 };
    setHeaderInfo(updatedHeader);
    processStatementParsing(rawTextContent, updatedHeader);
  };

  const handleLoadSampleStatement = (formatType) => {
    const textToLoad = formatType === 'OLD' ? SAMPLE_OLD_FORMAT_TEXT : SAMPLE_NEW_FORMAT_TEXT;
    setRawTextContent(textToLoad);

    const validHeader = {
      openingBalance: 10000,
      totalCredits: 3495,
      totalDebits: 4910,
      closingBalance: 8585,
      expectedCount: 6
    };
    setHeaderInfo(validHeader);
    processStatementParsing(textToLoad, validHeader);
    showToast(language === 'EN' ? `Loaded valid ABN AMRO statement (${formatType} format)!` : `Gepaste ABN AMRO afschrift (${formatType} formaat) geladen!`);
  };

  const handleLoadInvalidSample = (type) => {
    setRawTextContent(SAMPLE_OLD_FORMAT_TEXT);
    if (type === 'CHECKSUM_ERROR') {
      const invalidHeader = { openingBalance: 10000, totalCredits: 3495, totalDebits: 4910, closingBalance: 9999, expectedCount: 6 };
      setHeaderInfo(invalidHeader);
      processStatementParsing(SAMPLE_OLD_FORMAT_TEXT, invalidHeader);
      showToast(language === 'EN' ? 'Loaded statement with invalid Closing Balance Checksum!' : 'Afschrift geladen met onjuist einssaldo!');
    } else {
      const invalidHeader = { openingBalance: 10000, totalCredits: 3495, totalDebits: 4910, closingBalance: 8585, expectedCount: 99 };
      setHeaderInfo(invalidHeader);
      processStatementParsing(SAMPLE_OLD_FORMAT_TEXT, invalidHeader);
      showToast(language === 'EN' ? 'Loaded statement with transaction count mismatch!' : 'Afschrift geladen met aantal afwijking!');
    }
  };

  // Commit Parsed Statement to Bank Transactions Ledger
  const handleCommitStatement = () => {
    if (!validationResult || !validationResult.isValid) {
      showToast(language === 'EN' ? 'Cannot commit statement: Validation failed!' : 'Kan niet verwerken: Saldo- of aantalcontrole is mislukt!');
      return;
    }

    if (parsedStatementTxns.length === 0) {
      showToast(language === 'EN' ? 'No transactions to commit.' : 'Geen transacties om te verwerken.');
      return;
    }

    // Deduplicate using EREF
    const existingErefs = new Set(transactions.map(t => t.eref).filter(Boolean));
    const newUniqueTxns = parsedStatementTxns.filter(t => !t.eref || !existingErefs.has(t.eref));

    const updated = [...newUniqueTxns, ...transactions];
    setTransactions(updated);
    localStorage.setItem('app_bank_txns_v2', JSON.stringify(updated));
    window.dispatchEvent(new Event('app_data_changed'));

    showToast(language === 'EN'
      ? `Successfully committed ${newUniqueTxns.length} verified transactions to Bank Ledger!`
      : `${newUniqueTxns.length} gevalideerde transacties succesvol verwerkt in de Bankadministratie!`);

    setRawTextContent('');
    setParsedStatementTxns([]);
    setValidationResult(null);
    setActiveTab('transactions');
  };

  // Handle Manual Reclassification of Review Items / Vraagposten
  const handleSaveReclassification = () => {
    if (!reclassifyModalTx || !newSelectedCategory) return;

    const updated = transactions.map(tx => {
      if (tx.id === reclassifyModalTx.id) {
        return {
          ...tx,
          category: newSelectedCategory,
          status: 'Manually Reclassified',
          reviewReason: null
        };
      }
      return tx;
    });

    setTransactions(updated);
    localStorage.setItem('app_bank_txns_v2', JSON.stringify(updated));
    window.dispatchEvent(new Event('app_data_changed'));

    showToast(language === 'EN'
      ? `Transaction "${reclassifyModalTx.id}" reclassified to ${newSelectedCategory}!`
      : `Vraagpost "${reclassifyModalTx.id}" succesvol herrubriceerd naar ${newSelectedCategory}!`);

    setReclassifyModalTx(null);
    setNewSelectedCategory('');
  };

  // Handle Manual Order Allocation from Review Items (STEP 2)
  const handleSaveManualOrderAllocation = () => {
    if (!manualAllocateTx || !selectedTargetOrderId) return;

    let invoicesList = mockInvoices;
    try {
      const savedInvoices = localStorage.getItem('app_invoices');
      if (savedInvoices) {
        const parsed = JSON.parse(savedInvoices);
        if (Array.isArray(parsed) && parsed.length > 0) invoicesList = parsed;
      }
    } catch (e) {}

    const targetOrder = invoicesList.find(o => o.id === selectedTargetOrderId);
    if (!targetOrder) return;

    const creditVal = Number(manualAllocateTx.credit || 0);
    const debitVal = Number(manualAllocateTx.debit || 0);
    const isDebitPurchasing = debitVal > 0;

    const updatedTxns = transactions.map(tx => {
      if (tx.id === manualAllocateTx.id) {
        return {
          ...tx,
          category: isDebitPurchasing ? UNIFIED_PURCHASING_CATEGORY : 'Revenue — Outdoor Kitchens',
          status: 'Recognized',
          orderId: targetOrder.id,
          projectId: targetOrder.id,
          invoiceRef: targetOrder.id,
          customerName: targetOrder.customer,
          allocatedAmount: isDebitPurchasing ? debitVal : creditVal,
          allocationStatus: 'Manually Allocated',
          matchingMethod: 'Manual',
          reviewReason: null
        };
      }
      return tx;
    });

    setTransactions(updatedTxns);
    localStorage.setItem('app_bank_txns_v2', JSON.stringify(updatedTxns));

    // Update order settlement & project margin status in localStorage
    const updatedInvoices = invoicesList.map(ord => {
      if (ord.id === targetOrder.id) {
        const settlement = calculateOrderSettlement(ord, updatedTxns);
        const linkedPurchasing = updatedTxns.filter(t => t.category === UNIFIED_PURCHASING_CATEGORY && (t.orderId === ord.id || t.projectId === ord.id));
        const marginInfo = calculateProjectMarginWithPurchasing(ord.numericAmount || getNumericAmount(ord.amount), linkedPurchasing);

        return {
          ...ord,
          totalReceived: settlement.totalReceived,
          outstanding: settlement.outstanding,
          status: settlement.paymentStatus === 'Paid / Settled' ? 'Betaald' : 'Openstaand',
          paymentStatus: settlement.paymentStatus,
          totalPurchasing: marginInfo.totalPurchasing,
          projectMargin: marginInfo.projectMargin
        };
      }
      return ord;
    });

    localStorage.setItem('app_invoices', JSON.stringify(updatedInvoices));
    window.dispatchEvent(new Event('app_data_changed'));

    showToast(isDebitPurchasing 
      ? `Inkoop van € ${debitVal.toLocaleString('nl-NL')} (${manualAllocateTx.counterName}) succesvol gekoppeld aan Project ${targetOrder.id} (${targetOrder.customer})!`
      : `Betaling van € ${creditVal.toLocaleString('nl-NL')} succesvol toegewezen aan Order ${targetOrder.id} (${targetOrder.customer})!`);

    setManualAllocateTx(null);
    setSelectedTargetOrderId('');
  };

  // Manual Transaction Form Submit
  const [form, setForm] = useState({
    description: '',
    category: 'Purchasing',
    type: 'Expense',
    amount: '',
    counterName: '',
    counterIban: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!form.description || !form.amount) return showToast('Vul alle verplichte velden in.');

    const numVal = parseFloat(form.amount) || 0;
    const isExpense = form.type === 'Expense';

    const rawTx = {
      id: `TXN-MAN-${Date.now().toString().slice(-4)}`,
      date: form.date,
      description: form.description,
      debit: isExpense ? numVal : 0,
      credit: !isExpense ? numVal : 0,
      counterName: form.counterName || 'Handmatige Invoer',
      counterIban: form.counterIban || 'NL91 ABNA 0000 0000 00',
      type: 'Transfer',
      category: form.category
    };

    const normalized = normalizeTransaction(rawTx);
    const updated = [normalized, ...transactions];

    setTransactions(updated);
    localStorage.setItem('app_bank_txns_v2', JSON.stringify(updated));
    window.dispatchEvent(new Event('app_data_changed'));
    showToast(language === 'EN' ? 'Transaction added successfully!' : 'Transactie succesvol opgeslagen!');
    setModalOpen(false);
  };

  // Calculated Stats
  const totalIncome = transactions.reduce((acc, t) => acc + (Number(t.credit) || 0), 0);
  const totalExpense = transactions.reduce((acc, t) => acc + (Number(t.debit) || 0), 0);
  const bankBalance = totalIncome - totalExpense;
  const reviewItemsCount = transactions.filter(t => t.category === 'Review Item / Vraagpost' || t.status === 'Review Needed').length;

  // Filtered Transactions for Tab 1
  const filteredTransactions = transactions.filter(t => {
    const desc = (t.description || '').toLowerCase();
    const name = (t.counterName || '').toLowerCase();
    const iban = (t.counterIban || '').toLowerCase();
    const eref = (t.eref || '').toLowerCase();
    const q = searchQuery.toLowerCase();

    const matchesSearch = desc.includes(q) || name.includes(q) || iban.includes(q) || eref.includes(q);
    const matchesType = typeFilter === 'All' 
      ? true 
      : typeFilter === 'Debit' ? (t.debit > 0)
      : typeFilter === 'Credit' ? (t.credit > 0)
      : t.isInternal;

    const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;
    const matchesReview = reviewStatusFilter === 'All' || t.status === reviewStatusFilter;

    return matchesSearch && matchesType && matchesCategory && matchesReview;
  });

  // Filtered Review Items for Tab 3
  const reviewItemsList = transactions.filter(t => t.category === 'Review Item / Vraagpost' || t.status === 'Review Needed');

  // Status Badge Rendering Helper
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Recognized':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold"><Check className="w-3 h-3" /> Herkend</span>;
      case 'Internal Transfer':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-100 text-cyan-800 text-[10px] font-bold"><RefreshCw className="w-3 h-3" /> Kruispost</span>;
      case 'Review Needed':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-bold"><AlertTriangle className="w-3 h-3" /> Vraagpost</span>;
      case 'Manually Reclassified':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-bold"><Tag className="w-3 h-3" /> Hergecategoriseerd</span>;
      default:
        return <Badge variant="secondary">{status || 'In behandeling'}</Badge>;
    }
  };

  // Category Badge Rendering Helper
  const renderCategoryBadge = (category) => {
    if (category === 'Internal Transfer / Kruispost') return <span className="px-2 py-0.5 bg-gray-200 text-gray-800 text-[10px] font-bold rounded-md">Kruispost</span>;
    if (category === 'Purchasing') return <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-md">Inkoop</span>;
    if (category === 'Transport') return <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-bold rounded-md">Transport</span>;
    if (category === 'Revenue — Outdoor Kitchens') return <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md">Omzet Keukens</span>;
    if (category === 'Review Item / Vraagpost') return <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-bold rounded-md">Vraagpost</span>;
    if (category === 'Software' || category === 'Software / e-Boekhouden') return <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-bold rounded-md">Software</span>;
    if (category === 'Advertising / Meta Ads') return <span className="px-2 py-0.5 bg-pink-100 text-pink-800 text-[10px] font-bold rounded-md">Marketing / Ads</span>;
    return <span className="px-2 py-0.5 bg-cream-dark text-primary text-[10px] font-bold rounded-md">{category}</span>;
  };

  // Bank Transactions Table Columns (Tab 1)
  const columns = [
    { 
      header: 'Datum & Type', 
      render: (row) => (
        <div className="space-y-0.5">
          <p className="font-mono text-xs font-bold text-dark">{row.date}</p>
          <span className="text-[9px] font-bold uppercase text-dark/50 bg-[#EDE8DF] px-1.5 py-0.5 rounded border border-[#D6CFC2]">
            {row.type}
          </span>
        </div>
      ) 
    },
    { 
      header: 'Tegenpartij & IBAN', 
      render: (row) => (
        <div>
          <p className="font-bold text-dark text-xs">{row.counterName}</p>
          <p className="text-[10px] text-dark/50 font-mono">{row.counterIban}</p>
        </div>
      ) 
    },
    { 
      header: 'Omschrijving & Kenmerk', 
      style: { minWidth: '220px' },
      render: (row) => (
        <div className="space-y-0.5">
          <p className="font-medium text-dark text-xs leading-snug">{row.description}</p>
          <p className="text-[9.5px] text-dark/40 font-mono">Ref: {row.eref}</p>
          {row.bolSpecification && (
            <button
              onClick={() => setBolSpecModalTx(row)}
              className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-800 text-[10px] font-bold rounded-md hover:bg-blue-100 transition-colors"
            >
              <FileText className="w-3 h-3 text-blue-600" />
              <span>Bol.com Specificatie (Bruto €{row.bolSpecification.grossSales} - Cost €{row.bolSpecification.commissionFees})</span>
            </button>
          )}
        </div>
      ) 
    },
    { 
      header: 'Bedrag (€)', 
      render: (row) => (
        <div className="font-mono font-bold text-xs whitespace-nowrap">
          {row.credit > 0 && <span className="text-emerald-700">+ € {Number(row.credit).toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</span>}
          {row.debit > 0 && <span className="text-red-600">- € {Number(row.debit).toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</span>}
        </div>
      ) 
    },
    { header: 'Categorie', render: (row) => renderCategoryBadge(row.category) },
    { header: 'Status', render: (row) => renderStatusBadge(row.status) },
    { 
      header: 'Boeking', 
      render: (row) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setJournalModalTx(row)}
          className="text-primary hover:bg-[#D6CFC2]/40 text-[10px] py-0.5 px-1.5 font-bold"
          title="Bekijk e-Boekhouden Grootboekboeking"
        >
          <FileText className="w-3 h-3 mr-1 text-primary" /> Boeking
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6 relative font-body text-[#4A4A43]">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 80 }} className="fixed top-20 right-4 z-[9999] flex items-center gap-2 bg-primary text-cream px-4 py-3 rounded-xl shadow-lg text-xs font-bold">
            <CheckCircle className="w-4 h-4 text-green-400" />
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header & Main Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#D6CFC2] pb-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-primary">Bank & Bankafschriften (ABN AMRO)</h2>
          <p className="text-dark/60 text-xs mt-0.5">Beheer banktransacties, ABN afschrifteninvoer met saldocontrole en herrubricering van vraagposten.</p>
        </div>

        {/* Tab Switcher Buttons */}
        <div className="flex items-center gap-2 bg-[#EDE8DF] p-1.5 rounded-xl border border-[#C4BEB3]">
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'transactions' ? 'bg-primary text-cream shadow-sm' : 'text-dark/70 hover:text-primary'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>Banktransacties</span>
          </button>

          <button
            onClick={() => setActiveTab('import')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'import' ? 'bg-primary text-cream shadow-sm' : 'text-dark/70 hover:text-primary'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Afschrift Importeren</span>
          </button>

          <button
            onClick={() => setActiveTab('review')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 relative ${
              activeTab === 'review' ? 'bg-primary text-cream shadow-sm' : 'text-dark/70 hover:text-primary'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Vraagposten</span>
            {reviewItemsCount > 0 && (
              <span className="ml-1 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {reviewItemsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Financial Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card noPadding className="p-3 bg-[#F8F7F4]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-dark/50 uppercase tracking-wider">Bank Saldo Totaal</span>
            <Landmark className="w-4 h-4 text-primary" />
          </div>
          <p className="text-lg font-heading font-bold text-primary mt-1 font-mono">
            € {bankBalance.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
          </p>
        </Card>

        <Card noPadding className="p-3 bg-[#F8F7F4]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-dark/50 uppercase tracking-wider">Totaal Bijschrijvingen</span>
            <ArrowDownRight className="w-4 h-4 text-emerald-700" />
          </div>
          <p className="text-lg font-heading font-bold text-emerald-800 mt-1 font-mono">
            € {totalIncome.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
          </p>
        </Card>

        <Card noPadding className="p-3 bg-[#F8F7F4]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-dark/50 uppercase tracking-wider">Totaal Afschrijvingen</span>
            <ArrowUpRight className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-lg font-heading font-bold text-red-700 mt-1 font-mono">
            € {totalExpense.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
          </p>
        </Card>

        <Card noPadding className="p-3 bg-[#F8F7F4]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-dark/50 uppercase tracking-wider">Vraagposten (Review Needed)</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-lg font-heading font-bold text-amber-800 mt-1 font-mono">
            {reviewItemsCount} Transacties
          </p>
        </Card>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: BANK TRANSACTIONS LIST WITH FILTERS                */}
      {/* ========================================================= */}
      {activeTab === 'transactions' && (
        <Card p="p-4" className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-3 bg-[#EDE8DF]/40 p-3 rounded-xl border border-[#D6CFC2]">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/40" />
              <input 
                type="text" 
                placeholder="Zoek op naam, IBAN, omschrijving of kenmerk (EREF)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-[#4A4A43]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              {/* Type Filter */}
              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg font-semibold text-dark text-xs focus:outline-none"
              >
                <option value="All">Alle Types (Bij/Af)</option>
                <option value="Credit">Bijschrijving (+)</option>
                <option value="Debit">Afschrijving (-)</option>
              </select>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg font-semibold text-dark text-xs focus:outline-none max-w-[200px] truncate"
              >
                <option value="All">Alle Categorieën (All 17)</option>
                {BOOKKEEPING_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={reviewStatusFilter}
                onChange={e => setReviewStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg font-semibold text-dark text-xs focus:outline-none"
              >
                <option value="All">Alle Statussen</option>
                <option value="Recognized">Herkend (Recognized)</option>
                <option value="Internal Transfer">Kruispost (Internal Transfer)</option>
                <option value="Review Needed">Vraagpost (Review Needed)</option>
                <option value="Manually Reclassified">Hergecategoriseerd</option>
              </select>

              <Button size="sm" icon={Plus} onClick={() => setModalOpen(true)} className="py-1.5 text-xs font-bold">
                + Transactie
              </Button>
              <Button size="sm" icon={UploadCloud} onClick={() => setImportModalOpen(true)} className="py-1.5 text-xs font-bold bg-emerald-800 hover:bg-emerald-900 text-white border-0">
                Import Afschrift
              </Button>
            </div>
          </div>

          <Table columns={columns} data={filteredTransactions} />
        </Card>
      )}

      {/* ========================================================= */}
      {/* IMPORT BANK STATEMENTS MODAL                             */}
      {/* ========================================================= */}
      <AnimatePresence>
        {importModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9990] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setImportModalOpen(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 22, stiffness: 300 }}
              className="w-full max-w-lg bg-[#EDE8DF] rounded-2xl shadow-2xl border border-[#D6CFC2] font-body overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between p-5 border-b border-[#D6CFC2]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center flex-shrink-0">
                    <UploadCloud className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-bold text-lg text-primary">Import Bank Statements</h3>
                      <span className="px-2 py-0.5 bg-emerald-800 text-white text-[10px] font-bold rounded-md tracking-wider">BOEKHOUDING</span>
                    </div>
                    <p className="text-dark/60 text-xs mt-0.5">Parse Rabobank, ING & ABN AMRO bank exports directly into accounting ledger & VAT.</p>
                  </div>
                </div>
                <button
                  onClick={() => setImportModalOpen(false)}
                  className="w-7 h-7 rounded-lg bg-[#D6CFC2] hover:bg-[#C4BEB3] flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 text-dark/70" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 space-y-4">
                {/* File Format Selector */}
                <div>
                  <label className="block text-[10px] font-bold uppercase text-dark/50 tracking-wider mb-2">
                    FILE FORMAT SELECTOR (BESTANDSFORMAAT)
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <select
                        value={fileFormat}
                        onChange={e => setFileFormat(e.target.value)}
                        className="w-full appearance-none pl-8 pr-3 py-2.5 bg-white border border-[#D6CFC2] rounded-xl text-xs font-bold text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                      >
                        <option value="PDF">PDF (.pdf Bankafschrift)</option>
                        <option value="TXT">TXT / CSV (ABN AMRO Export)</option>
                        <option value="MT940">MT940 (.sta)</option>
                        <option value="CAMT">CAMT.053 (.xml)</option>
                      </select>
                      <FileText className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-dark/40" />
                    </div>
                    <button
                      onClick={() => importFileInputRef.current?.click()}
                      className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white border border-[#D6CFC2] rounded-xl text-xs font-bold text-dark hover:bg-[#F8F7F4] transition-colors whitespace-nowrap cursor-pointer"
                    >
                      <FolderOpen className="w-3.5 h-3.5 text-dark/50" />
                      Browse Bank Export File...
                    </button>
                    <input
                      ref={importFileInputRef}
                      type="file"
                      accept=".pdf,.txt,.csv,.sta,.xml"
                      className="hidden"
                      onChange={e => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        setImportFile(f);
                        const reader = new FileReader();
                        reader.onload = (ev) => handleTextChange(ev.target.result);
                        reader.readAsText(f);
                      }}
                    />
                  </div>
                </div>

                {/* Drag & Drop Zone */}
                <div
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => {
                    e.preventDefault();
                    setDragOver(false);
                    const f = e.dataTransfer.files?.[0];
                    if (!f) return;
                    setImportFile(f);
                    const reader = new FileReader();
                    reader.onload = (ev) => handleTextChange(ev.target.result);
                    reader.readAsText(f);
                  }}
                  className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer ${
                    dragOver
                      ? 'border-emerald-600 bg-emerald-50'
                      : importFile
                      ? 'border-emerald-400 bg-emerald-50/60'
                      : 'border-[#C4BEB3] bg-[#F8F7F4] hover:border-primary/40 hover:bg-white'
                  }`}
                  onClick={() => importFileInputRef.current?.click()}
                >
                  {importFile ? (
                    <>
                      <CheckCircle className="w-8 h-8 text-emerald-600" />
                      <div className="text-center">
                        <p className="text-sm font-bold text-emerald-800">{importFile.name}</p>
                        <p className="text-xs text-dark/50 mt-0.5">{(importFile.size / 1024).toFixed(1)} KB geladen</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center">
                        <FileSpreadsheet className="w-6 h-6 text-emerald-700" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-dark">
                          Drag & drop your {fileFormat === 'PDF' ? 'Rabobank/ING PDF' : 'ABN AMRO'} statement here
                        </p>
                        <p className="text-xs text-dark/50 mt-0.5">
                          Format selected: {fileFormat} (Max 25MB)
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Paste raw text fallback */}
                {rawTextContent && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                    <div className="flex items-center gap-2 font-bold text-emerald-800">
                      <Check className="w-4 h-4" />
                      {parsedStatementTxns.length} transacties ingelezen en klaar voor validatie
                    </div>
                  </div>
                )}

                {/* Validation Result */}
                {validationResult && (
                  <div className={`p-3 rounded-xl border text-xs font-body ${
                    validationResult.isValid
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-red-50 border-red-300 text-red-900'
                  }`}>
                    <div className="flex items-center gap-2 font-bold">
                      {validationResult.isValid
                        ? <><ShieldCheck className="w-4 h-4 text-emerald-600" /> Saldo controle geslaagd!</>
                        : <><AlertTriangle className="w-4 h-4 text-red-600" /> Validatie mislukt — import geblokkeerd!</>}
                    </div>
                    <p className="mt-1">{validationResult.errorMessage || 'Alle saldo- en aantaltotalen kloppen.'}</p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between px-5 pb-5">
                <button
                  onClick={() => {
                    handleLoadSampleStatement('NEW');
                    setImportModalOpen(false);
                    setActiveTab('import');
                  }}
                  className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Or Load Sample Rabobank Export (Q3 2026)
                </button>
                <Button
                  variant="primary"
                  icon={Sparkles}
                  onClick={() => {
                    if (!rawTextContent.trim()) {
                      showToast('Geen bestand of tekst geladen. Laad eerst een bankafschrift.');
                      return;
                    }
                    setImportModalOpen(false);
                    setActiveTab('import');
                  }}
                  className="text-xs font-bold"
                >
                  Parse PDF Statement
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* TAB 2: ABN AMRO STATEMENT IMPORT & SALDO CONTROLE         */}
      {/* ========================================================= */}
      {activeTab === 'import' && (
        <Card p="p-5" className="space-y-6">
          <div>
            <h3 className="text-lg font-heading font-bold text-primary flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-emerald-800" />
              ABN AMRO Bankafschrift Importeren & Validatie Engine
            </h3>
            <p className="text-dark/60 text-xs mt-1">
              Ondersteunt zowel het **Oude ABN Formaat** (SEPA Overboeking, IBAN, Naam, Kenmerk) als het **Nieuwe Formaat** (/TRTP/, /IBAN/, /NAME/, /REMI/, /EREF/).
            </p>
          </div>

          {/* Quick Preset Buttons */}
          <div className="p-3 bg-[#EDE8DF] rounded-xl border border-[#C4BEB3] space-y-2">
            <span className="text-[10px] font-bold uppercase text-dark/50 tracking-wider block">
              ⚡ Snel Testen: Laad Voorbeeld ABN Afschrift Formaten
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleLoadSampleStatement('OLD')}
                className="px-3 py-1.5 bg-primary text-cream text-xs font-bold rounded-lg hover:bg-primary/90 transition-colors"
              >
                ✓ Laad Geldig Afschrift (Oud Formaat)
              </button>
              <button
                onClick={() => handleLoadSampleStatement('NEW')}
                className="px-3 py-1.5 bg-emerald-800 text-white text-xs font-bold rounded-lg hover:bg-emerald-900 transition-colors"
              >
                ✓ Laad Geldig Afschrift (Nieuw Formaat)
              </button>
              <button
                onClick={() => handleLoadInvalidSample('CHECKSUM_ERROR')}
                className="px-3 py-1.5 bg-red-700 text-white text-xs font-bold rounded-lg hover:bg-red-800 transition-colors"
              >
                ✕ Test Saldo Controle Fout (Invalid Checksum)
              </button>
              <button
                onClick={() => handleLoadInvalidSample('COUNT_MISMATCH')}
                className="px-3 py-1.5 bg-amber-800 text-white text-xs font-bold rounded-lg hover:bg-amber-900 transition-colors"
              >
                ✕ Test Aantal Transacties Mismatch
              </button>
            </div>
          </div>

          {/* Statement Header Validation Controls */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 bg-[#F8F7F4] rounded-xl border border-[#D6CFC2] text-xs">
            <div>
              <label className="block text-[10px] font-bold uppercase text-dark/50 mb-1">BeginSaldo (€)</label>
              <input
                type="number"
                value={headerInfo.openingBalance}
                onChange={e => handleHeaderChange('openingBalance', e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-[#D6CFC2] rounded-lg font-mono font-bold text-dark text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-dark/50 mb-1">Totaal Bij (€)</label>
              <input
                type="number"
                value={headerInfo.totalCredits}
                onChange={e => handleHeaderChange('totalCredits', e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-[#D6CFC2] rounded-lg font-mono font-bold text-emerald-800 text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-dark/50 mb-1">Totaal Af (€)</label>
              <input
                type="number"
                value={headerInfo.totalDebits}
                onChange={e => handleHeaderChange('totalDebits', e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-[#D6CFC2] rounded-lg font-mono font-bold text-red-700 text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-dark/50 mb-1">EindSaldo (€)</label>
              <input
                type="number"
                value={headerInfo.closingBalance}
                onChange={e => handleHeaderChange('closingBalance', e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-[#D6CFC2] rounded-lg font-mono font-bold text-primary text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-dark/50 mb-1">Verwacht Aantal</label>
              <input
                type="number"
                value={headerInfo.expectedCount}
                onChange={e => handleHeaderChange('expectedCount', e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-[#D6CFC2] rounded-lg font-mono font-bold text-dark text-xs"
              />
            </div>
          </div>

          {/* Raw Statement Input Textarea */}
          <div className="space-y-1">
            <label className="block font-bold text-dark/70 text-xs">
              ABN AMRO Afschrift Tekst (Kopieer/Plak of Kies Bestand):
            </label>
            <textarea
              rows={8}
              value={rawTextContent}
              onChange={e => handleTextChange(e.target.value)}
              placeholder="Plak hier de ruwe ABN AMRO afschrift tekst..."
              className="w-full p-3 bg-white border border-[#D6CFC2] rounded-xl font-mono text-xs text-dark focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Statement Validation Feedback Card */}
          {validationResult && (
            <div className={`p-4 rounded-xl border font-body text-xs space-y-2 ${
              validationResult.isValid
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-red-50 border-red-300 text-red-950'
            }`}>
              <div className="flex items-center gap-2 font-bold text-sm">
                {validationResult.isValid ? (
                  <>
                    <ShieldCheck className="w-5 h-5 text-emerald-700" />
                    <span>✓ Afschrift Succesvol Gevalideerd & Saldo Controle Correct!</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <span>✕ Validatie Fout: Afschrift kan NIET worden verwerkt!</span>
                  </>
                )}
              </div>

              <p className="font-medium">{validationResult.errorMessage || 'Alle transacties, totalen en saldo controle voldoen aan de eisen.'}</p>

              {validationResult.isValid && (
                <div className="pt-2 flex justify-between items-center border-t border-emerald-200 text-xs font-mono">
                  <span>Ingelezen: <strong>{parsedStatementTxns.length} Transacties</strong></span>
                  <span>Berekend Eindsaldo: <strong>€ {validationResult.calculatedClosing.toLocaleString('nl-NL')}</strong></span>
                  <Button
                    onClick={handleCommitStatement}
                    className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs py-1.5 px-4"
                  >
                    🚀 Verwerk Ingelezen Afschrift in Bankadministratie
                  </Button>
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      {/* ========================================================= */}
      {/* TAB 3: REVIEW ITEMS / VRAAGPOSTEN BEOORDELEN              */}
      {/* ========================================================= */}
      {activeTab === 'review' && (
        <Card p="p-5" className="space-y-4">
          <div className="flex justify-between items-center bg-amber-50 p-4 rounded-xl border border-amber-200 text-amber-900 text-xs">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-sm font-heading">Vraagposten & Unmatched Transacties</h3>
                <p className="text-amber-800">
                  Volgens richtlijn v1.2 worden onbekende transacties automatisch toegewezen als **Vraagpost**. Ken hier de juiste categorie toe.
                </p>
              </div>
            </div>
            <span className="font-bold text-sm bg-amber-200 px-3 py-1 rounded-lg">
              {reviewItemsList.length} Te Beoordelen
            </span>
          </div>

          {reviewItemsList.length === 0 ? (
            <div className="p-8 text-center bg-[#F8F7F4] rounded-xl border border-[#D6CFC2] space-y-2">
              <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-primary text-base">Geen Openstaande Vraagposten!</h4>
              <p className="text-xs text-dark/60">Alle banktransacties zijn succesvol herkend of handmatig herrubriceerd.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-body text-xs">
                <thead>
                  <tr className="border-b border-[#D6CFC2] bg-[#EDE8DF] text-[10px] uppercase text-dark/60 font-bold tracking-wider">
                    <th className="py-3 px-3">Datum & Type</th>
                    <th className="py-3 px-3">Tegenpartij</th>
                    <th className="py-3 px-3">Omschrijving & Kenmerk</th>
                    <th className="py-3 px-3 text-right">Bedrag (€)</th>
                    <th className="py-3 px-3">Reden Vraagpost</th>
                    <th className="py-3 px-3 text-center">Actie</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D6CFC2]/50 bg-white">
                  {reviewItemsList.map(tx => (
                    <tr key={tx.id} className="align-top hover:bg-cream/20">
                      <td className="py-3 px-3">
                        <p className="font-bold text-dark">{tx.date}</p>
                        <span className="text-[9px] uppercase font-mono text-dark/50">{tx.type}</span>
                      </td>
                      <td className="py-3 px-3">
                        <p className="font-bold text-dark">{tx.counterName}</p>
                        <p className="text-[10px] font-mono text-dark/50">{tx.counterIban}</p>
                      </td>
                      <td className="py-3 px-3 space-y-0.5">
                        <p className="font-medium text-dark">{tx.description}</p>
                        <p className="text-[9.5px] font-mono text-dark/40">Ref: {tx.eref}</p>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold whitespace-nowrap">
                        {tx.credit > 0 && <span className="text-emerald-700">+ € {Number(tx.credit).toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</span>}
                        {tx.debit > 0 && <span className="text-red-600">- € {Number(tx.debit).toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</span>}
                      </td>
                      <td className="py-3 px-3 text-amber-900 text-[11px] leading-tight">
                        {tx.reviewReason || 'Onbekende tegenpartij zonder factuurkenmerk'}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex flex-col sm:flex-row gap-1 justify-center">
                          <Button
                            size="sm"
                            onClick={() => {
                              setManualAllocateTx(tx);
                              setSelectedTargetOrderId(mockInvoices[0]?.id || '');
                            }}
                            className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-[10px] py-1 px-2"
                          >
                            🎯 Wijs toe aan Order
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => {
                              setReclassifyModalTx(tx);
                              setNewSelectedCategory('Purchasing');
                            }}
                            className="bg-amber-700 hover:bg-amber-800 text-white font-bold text-[10px] py-1 px-2"
                          >
                            <Tag className="w-3 h-3 mr-1" /> Categorie
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* RECLASSIFY MODAL FOR VRAAGPOSTEN */}
      <AnimatePresence>
        {reclassifyModalTx && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-dark/70 backdrop-blur-sm" onClick={() => setReclassifyModalTx(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-[#EDE8DF] border border-[#C4BEB3] rounded-2xl p-5 shadow-2xl z-10 space-y-4 text-xs font-body">
              <div className="flex justify-between items-start border-b border-[#D6CFC2] pb-2">
                <div>
                  <span className="text-[10px] font-bold uppercase text-amber-800">Vraagpost Herrubriceren</span>
                  <h3 className="text-base font-heading font-bold text-primary">{reclassifyModalTx.counterName}</h3>
                </div>
                <button onClick={() => setReclassifyModalTx(null)} className="p-1 text-dark/40 hover:text-dark"><X className="w-5 h-5" /></button>
              </div>

              <div className="bg-white p-3 rounded-xl border border-[#D6CFC2] space-y-1 text-dark/80">
                <p><strong>Omschrijving:</strong> {reclassifyModalTx.description}</p>
                <p><strong>Bedrag:</strong> € {Number(reclassifyModalTx.debit || reclassifyModalTx.credit || 0).toLocaleString('nl-NL')}</p>
                <p><strong>Kenmerk:</strong> {reclassifyModalTx.eref}</p>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-primary">Kies Nieuwe Categorie *</label>
                <select
                  value={newSelectedCategory}
                  onChange={e => setNewSelectedCategory(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#D6CFC2] rounded-xl font-bold text-dark text-xs focus:outline-none"
                >
                  {BOOKKEEPING_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#D6CFC2]">
                <Button variant="outline" size="sm" onClick={() => setReclassifyModalTx(null)}>Annuleren</Button>
                <Button size="sm" onClick={handleSaveReclassification} className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold">
                  ✓ Opslaan & Herrubriceren
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MANUAL TRANSACTION ADD MODAL */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-dark/60 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-[#EDE8DF] border border-[#C4BEB3] rounded-2xl p-6 shadow-2xl z-10 space-y-4">
              <div className="flex items-center justify-between border-b border-[#D6CFC2] pb-3">
                <h3 className="text-lg font-heading font-bold text-primary">Handmatige Transactie Toevoegen</h3>
                <button onClick={() => setModalOpen(false)} className="p-1 text-dark/40 hover:text-dark"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleManualSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-dark/70 mb-1">Tegenpartij Naam *</label>
                  <input type="text" required value={form.counterName} onChange={e => setForm(prev => ({ ...prev, counterName: e.target.value }))} className="w-full px-3 py-2 bg-white border border-[#D6CFC2] rounded-lg" placeholder="e.g. Ruben Verbeij" />
                </div>
                <div>
                  <label className="block font-bold text-dark/70 mb-1">Omschrijving *</label>
                  <input type="text" required value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} className="w-full px-3 py-2 bg-white border border-[#D6CFC2] rounded-lg" placeholder="e.g. Houtinkoop Thermo Fraké" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-dark/70 mb-1">Type *</label>
                    <select value={form.type} onChange={e => setForm(prev => ({ ...prev, type: e.target.value }))} className="w-full px-3 py-2 bg-white border border-[#D6CFC2] rounded-lg font-bold">
                      <option value="Expense">Afschrijving (-)</option>
                      <option value="Income">Bijschrijving (+)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-dark/70 mb-1">Bedrag (€) *</label>
                    <input type="number" step="0.01" required value={form.amount} onChange={e => setForm(prev => ({ ...prev, amount: e.target.value }))} className="w-full px-3 py-2 bg-white border border-[#D6CFC2] rounded-lg font-mono font-bold" placeholder="0.00" />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-dark/70 mb-1">Categorie *</label>
                  <select value={form.category} onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))} className="w-full px-3 py-2 bg-white border border-[#D6CFC2] rounded-lg font-bold">
                    {BOOKKEEPING_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-[#D6CFC2]">
                  <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>Annuleren</Button>
                  <Button type="submit" size="sm" className="bg-primary text-cream font-bold">Opslaan</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* BOL.COM SELLER ACCOUNT SPECIFICATION BREAKDOWN MODAL */}
      <AnimatePresence>
        {bolSpecModalTx && bolSpecModalTx.bolSpecification && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-dark/70 backdrop-blur-sm" onClick={() => setBolSpecModalTx(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-lg bg-[#EDE8DF] border border-[#C4BEB3] rounded-2xl p-6 shadow-2xl z-10 space-y-4 text-xs font-body">
              <div className="flex justify-between items-start border-b border-[#D6CFC2] pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase text-blue-800">Bol.com Partner Specificatie</span>
                  <h3 className="text-base font-heading font-bold text-primary">Verkoopaccount Specificatie Opsplitsing</h3>
                </div>
                <button onClick={() => setBolSpecModalTx(null)} className="p-1 text-dark/40 hover:text-dark"><X className="w-5 h-5" /></button>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 leading-snug">
                <strong>Boekhoudkundige Richtlijn Briefing v1.2:</strong>
                <p className="mt-0.5 text-[11px]">Het bankontvangstbedrag is de **netto uitbetaling**. De werkelijke omzet bedraagt de bruto verkopen min de ingehouden bol.com commissie/verkoperkosten.</p>
              </div>

              <div className="space-y-3 bg-white p-4 rounded-xl border border-[#D6CFC2]">
                <div className="flex justify-between items-center pb-2 border-b border-[#EDE8DF]">
                  <div>
                    <span className="font-bold text-dark text-xs block">1. Bruto Verkopen (Gross Sales)</span>
                    <span className="text-[10px] text-dark/50">Geboekt op categorie: <strong>Revenue — bol.com</strong></span>
                  </div>
                  <span className="font-mono font-bold text-emerald-700 text-sm">
                    + € {Number(bolSpecModalTx.bolSpecification.grossSales).toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-[#EDE8DF]">
                  <div>
                    <span className="font-bold text-dark text-xs block">2. Bol.com Commissie & Verkoperkosten</span>
                    <span className="text-[10px] text-dark/50">Geboekt op categorie: <strong>bol.com sales costs / barcodes</strong></span>
                  </div>
                  <span className="font-mono font-bold text-red-600 text-sm">
                    - € {Number(bolSpecModalTx.bolSpecification.commissionFees).toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-1 font-bold">
                  <div>
                    <span className="text-primary text-xs block">3. Netto Bank Ontvangst (Bank Payout)</span>
                    <span className="text-[10px] text-dark/50">Ref: {bolSpecModalTx.bolSpecification.sellerAccountRef}</span>
                  </div>
                  <span className="font-mono font-bold text-primary text-base">
                    = € {Number(bolSpecModalTx.bolSpecification.netPayout).toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-[#D6CFC2]">
                <Button size="sm" onClick={() => setBolSpecModalTx(null)} className="bg-primary text-cream font-bold">
                  Sluiten
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* MANUAL ORDER ALLOCATION MODAL (STEP 2) */}
      <AnimatePresence>
        {manualAllocateTx && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-dark/70 backdrop-blur-sm" onClick={() => setManualAllocateTx(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-lg bg-[#EDE8DF] border border-[#C4BEB3] rounded-2xl p-6 shadow-2xl z-10 space-y-4 text-xs font-body">
              <div className="flex justify-between items-start border-b border-[#D6CFC2] pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase text-emerald-800">Handmatige Order Koppeling</span>
                  <h3 className="text-base font-heading font-bold text-primary">Koppel Bankontvangst aan Klant Order</h3>
                </div>
                <button onClick={() => setManualAllocateTx(null)} className="p-1 text-dark/40 hover:text-dark"><X className="w-5 h-5" /></button>
              </div>

              <div className="bg-white p-3 rounded-xl border border-[#D6CFC2] space-y-1 text-dark/80 font-mono">
                <p><strong>Bank Transactie ID:</strong> {manualAllocateTx.id}</p>
                <p><strong>Tegenpartij / Betaler:</strong> {manualAllocateTx.counterName} ({manualAllocateTx.counterIban})</p>
                <p><strong>Omschrijving:</strong> {manualAllocateTx.description}</p>
                <p><strong>Ontvangen Bedrag:</strong> € {Number(manualAllocateTx.credit || manualAllocateTx.numericAmount || 0).toLocaleString('nl-NL')}</p>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-primary">Selecteer Klant Order / Factuur *</label>
                <select
                  value={selectedTargetOrderId}
                  onChange={e => setSelectedTargetOrderId(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#D6CFC2] rounded-xl font-bold text-dark text-xs focus:outline-none"
                >
                  {mockInvoices.map(inv => (
                    <option key={inv.id} value={inv.id}>
                      {inv.id} — {inv.customer} (Totaal: {inv.amount})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#D6CFC2]">
                <Button variant="outline" size="sm" onClick={() => setManualAllocateTx(null)}>Annuleren</Button>
                <Button size="sm" onClick={handleSaveManualOrderAllocation} className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold">
                  ✓ Koppel Betaling aan Order & Update Status
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* JOURNAL ENTRY (BOEKING) PREVIEW MODAL (STEP 4) */}
      <AnimatePresence>
        {journalModalTx && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-dark/70 backdrop-blur-sm" onClick={() => setJournalModalTx(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-xl bg-[#EDE8DF] border border-[#C4BEB3] rounded-2xl p-6 shadow-2xl z-10 space-y-4 text-xs font-body">
              <div className="flex justify-between items-start border-b border-[#D6CFC2] pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase text-primary">e-Boekhouden Journal Entry</span>
                  <h3 className="text-base font-heading font-bold text-primary">Boeking Details & Grootboekrekeningen</h3>
                </div>
                <button onClick={() => setJournalModalTx(null)} className="p-1 text-dark/40 hover:text-dark"><X className="w-5 h-5" /></button>
              </div>

              {(() => {
                const journal = generateJournalEntries(journalModalTx);
                return (
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-xl border border-[#D6CFC2] text-xs font-mono space-y-1">
                      <p><strong>Boeking Type:</strong> {journal.type}</p>
                      <p><strong>Omschrijving:</strong> {journal.description}</p>
                      <p><strong>Transactie Datum:</strong> {journal.date}</p>
                      <p><strong>Status:</strong> <span className="text-emerald-700 font-bold">✓ In balans (Debit = Credit)</span></p>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left font-mono border-collapse border border-[#D6CFC2] bg-white text-xs">
                        <thead>
                          <tr className="bg-[#EDE8DF] text-[10px] uppercase font-bold text-dark/60">
                            <th className="p-2 border border-[#D6CFC2]">Code</th>
                            <th className="p-2 border border-[#D6CFC2]">Grootboekrekening</th>
                            <th className="p-2 border border-[#D6CFC2] text-right">Debet (€)</th>
                            <th className="p-2 border border-[#D6CFC2] text-right">Credit (€)</th>
                            <th className="p-2 border border-[#D6CFC2]">BTW Regel</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#D6CFC2]">
                          {journal.lines.map((line, idx) => (
                            <tr key={idx} className="hover:bg-cream/20">
                              <td className="p-2 font-bold text-dark border border-[#D6CFC2]">{line.account.code}</td>
                              <td className="p-2 font-medium text-dark border border-[#D6CFC2]">{line.account.name}</td>
                              <td className="p-2 text-right font-bold text-emerald-800 border border-[#D6CFC2]">
                                {line.debit > 0 ? `€ ${line.debit.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}` : '-'}
                              </td>
                              <td className="p-2 text-right font-bold text-blue-900 border border-[#D6CFC2]">
                                {line.credit > 0 ? `€ ${line.credit.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}` : '-'}
                              </td>
                              <td className="p-2 text-[10px] font-bold text-dark/60 border border-[#D6CFC2]">{line.vatRule}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}

              <div className="flex justify-end pt-2 border-t border-[#D6CFC2]">
                <Button size="sm" onClick={() => setJournalModalTx(null)} className="bg-primary text-cream font-bold">
                  Sluiten
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
