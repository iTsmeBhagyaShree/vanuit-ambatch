import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { Plus, Search, Filter, X, CheckCircle, RotateCcw, ArrowDownRight, ArrowUpRight, Landmark, Percent, UploadCloud, FileSpreadsheet, FileText, Sparkles, Check, FolderOpen } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { mockBankTransactions as defaultTransactions } from '../../utils/mockData';

export default function Bank() {
  const { t, language } = useLanguage();
  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All'); // 'All' | 'Income' | 'Expense'
  const [modalOpen, setModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Module 5.1: Bank Statement Import State
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [fileFormat, setFileFormat] = useState('PDF'); // 'PDF' | 'TXT' | 'XLS'
  const [importFile, setImportFile] = useState(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedTxns, setParsedTxns] = useState(null);
  const importFileInputRef = useRef(null);

  const sampleBankImportData = [
    {
      id: `TXN-IMP-${Date.now().toString().slice(-4)}-1`,
      description: language === 'EN' ? 'Rabobank Receipt: Bjorn Falcon (Quote Q-2026-003)' : 'Rabobank Ontvangst: Bjorn Valk (Offerte OF-2026-003)',
      category: language === 'EN' ? 'Sales / Revenue' : 'Verkoop / Omzet',
      type: 'Income',
      amount: '€ 3,495',
      numericAmount: 3495,
      date: new Date().toISOString().split('T')[0]
    },
    {
      id: `TXN-IMP-${Date.now().toString().slice(-4)}-2`,
      description: language === 'EN' ? 'ING Debit: Timber Supplier Ltd. (Thermo Fraké Wood Purchase)' : 'ING Afschrijving: Houtleverancier B.V. (Thermo Fraké Hout Inkoop)',
      category: language === 'EN' ? 'Material Purchasing' : 'Materiaal Inkoop',
      type: 'Expense',
      amount: '€ 850',
      numericAmount: 850,
      date: new Date().toISOString().split('T')[0]
    },
    {
      id: `TXN-IMP-${Date.now().toString().slice(-4)}-3`,
      description: language === 'EN' ? 'ABN AMRO Receipt: Peter Young (Kitchen Down Payment)' : 'ABN AMRO Ontvangst: Peter de Jong (Aanbetaling Keuken)',
      category: language === 'EN' ? 'Sales / Revenue' : 'Verkoop / Omzet',
      type: 'Income',
      amount: '€ 1,250',
      numericAmount: 1250,
      date: new Date().toISOString().split('T')[0]
    },
    {
      id: `TXN-IMP-${Date.now().toString().slice(-4)}-4`,
      description: language === 'EN' ? 'Rabobank Debit: Stainless Steel Sinks & Taps Ltd.' : 'Rabobank Afschrijving: RVS Spoelbakken & Kranen B.V.',
      category: language === 'EN' ? 'Material Purchasing' : 'Materiaal Inkoop',
      type: 'Expense',
      amount: '€ 390',
      numericAmount: 390,
      date: new Date().toISOString().split('T')[0]
    }
  ];

  const handleBankFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setImportFile(file);

    // Smart Format Auto-Detection based on file extension
    const fileName = file.name.toLowerCase();
    if (fileName.endsWith('.pdf')) {
      setFileFormat('PDF');
    } else if (fileName.endsWith('.txt') || fileName.endsWith('.csv')) {
      setFileFormat('TXT');
    } else if (fileName.endsWith('.xls') || fileName.endsWith('.xlsx')) {
      setFileFormat('XLS');
    }

    showToast(language === 'EN' ? `Selected "${file.name}" for bank statement parsing!` : `Bestand gekozen: "${file.name}"!`);
  };

  const handleParseStatement = () => {
    setIsParsing(true);
    setParsedTxns(null);
    setTimeout(() => {
      setIsParsing(false);
      setParsedTxns(sampleBankImportData);
      showToast(language === 'EN' ? `Extracted ${sampleBankImportData.length} transactions from bank export!` : `${sampleBankImportData.length} transacties geëxtraheerd uit bankafschrift!`);
    }, 1200);
  };

  const handleSyncImportedTransactions = () => {
    if (!parsedTxns || parsedTxns.length === 0) return;
    const updated = [...parsedTxns, ...transactions];
    setTransactions(updated);
    localStorage.setItem('app_bank_txns_v2', JSON.stringify(updated));
    localStorage.setItem('app_bank_txns', JSON.stringify(updated));
    window.dispatchEvent(new Event('app_data_changed'));
    setImportModalOpen(false);
    setParsedTxns(null);
    setImportFile(null);
    showToast(language === 'EN' ? `Successfully synced ${parsedTxns.length} transactions to Accounting & VAT Ledger!` : `${parsedTxns.length} Transacties succesvol verwerkt in Boekhouding & BTW!`);
  };

  const translateBankText = (str) => {
    if (language !== 'EN' || !str) return str;
    return str
      .replace(/Jan de Vries/g, 'John Miller')
      .replace(/Sophie Bakken/g, 'Sophia Taylor')
      .replace(/Sven Hoek \(Hoek Bouw\)/g, 'Erik van den Berg (CraftWood)')
      .replace(/Mark de Boer/g, 'Mark Davis')
      .replace(/Peter de Jong/g, 'Peter Young')
      .replace(/Bjorn Valk/g, 'Bjorn Falcon')
      .replace(/Quote OF-/g, 'Quote Q-')
      .replace(/Offerte OF-/g, 'Quote Q-')
      .replace(/Rabobank Ontvangst/g, 'Rabobank Receipt')
      .replace(/ING Afschrijving/g, 'ING Debit')
      .replace(/ABN AMRO Ontvangst/g, 'ABN AMRO Receipt')
      .replace(/Rabobank Afschrijving/g, 'Rabobank Debit')
      .replace(/Offerte/g, 'Quote')
      .replace(/Houtleverancier B.V./g, 'Timber Supplier Ltd.')
      .replace(/Thermo Fraké Hout Inkoop/g, 'Thermo Fraké Wood Purchase')
      .replace(/Aanbetaling Keuken/g, 'Kitchen Down Payment')
      .replace(/RVS Spoelbakken & Kranen B.V./g, 'Stainless Steel Sinks & Taps Ltd.')
      .replace(/50% Aanbetaling Ontvangen/g, '50% Deposit Received')
      .replace(/Aanbetaling Ontvangen/g, 'Deposit Received')
      .replace(/Betaling Kliko Ombouw/g, 'Payment Bin Storage')
      .replace(/Inkoop Teak Hout & Granieten Bladen/g, 'Purchase Teak Wood & Granite Slabs')
      .replace(/Uitbetaling Vakman Voorschot/g, 'Payout Craftsman Advance')
      .replace(/Aanbetaling Houten Overkapping/g, 'Deposit Wooden Canopy')
      .replace(/Verkoop \/ Omzet/g, 'Sales / Revenue')
      .replace(/Materiaal Inkoop/g, 'Material Purchasing')
      .replace(/Onderaanneming \/ Partner/g, 'Subcontracting / Partner');
  };

  const [form, setForm] = useState({
    description: '',
    category: language === 'EN' ? 'Sales / Revenue' : 'Verkoop / Omzet',
    type: 'Income',
    amount: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    try {
      const savedTxns = localStorage.getItem('app_bank_txns_v2') || localStorage.getItem('app_bank_txns');
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
    localStorage.setItem('app_bank_txns', JSON.stringify(defaultTransactions));
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.description || !form.amount) return showToast('Vul alle velden in.');

    const numVal = parseFloat(form.amount) || 0;
    const newTxn = {
      id: `TXN-${Date.now().toString().slice(-4)}`,
      description: form.description,
      category: form.category,
      type: form.type,
      amount: `€ ${numVal.toLocaleString()}`,
      numericAmount: numVal,
      date: form.date
    };

    const updatedTxns = [newTxn, ...transactions];
    setTransactions(updatedTxns);
    localStorage.setItem('app_bank_txns', JSON.stringify(updatedTxns));
    showToast('Transactie succesvol opgeslagen!');
    setModalOpen(false);
  };

  const getNumericVal = (amtStr, numVal) => {
    if (numVal) return numVal;
    if (!amtStr) return 0;
    const val = parseFloat(String(amtStr).replace(/[^\d.-]/g, ''));
    return isNaN(val) ? 0 : val;
  };

  // Processed Transactions
  const processedTxns = [...transactions].filter(t => {
    const matchesSearch = 
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'All' || t.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Calculate Totals & BTW (VAT 21%)
  const totalIncome = transactions.filter(t => t.type === 'Income').reduce((acc, t) => acc + getNumericVal(t.amount, t.numericAmount), 0);
  const totalExpense = transactions.filter(t => t.type === 'Expense').reduce((acc, t) => acc + getNumericVal(t.amount, t.numericAmount), 0);
  const bankBalance = totalIncome - totalExpense;

  // 21% BTW calculations
  const btwOntvangen = totalIncome * (21 / 121); // VAT included in sales
  const btwBetaald = totalExpense * (21 / 121);  // VAT included in costs
  const btwNettoAfdragen = btwOntvangen - btwBetaald;

  const columns = [
    { header: t('screens.bank.transactionId'), accessor: 'id' },
    { 
      header: t('screens.bank.descriptionLabel'),
      style: { minWidth: '240px' },
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${row.type === 'Income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {row.type === 'Income' ? <ArrowDownRight className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
          </div>
          <div>
            <p className="font-semibold text-dark text-xs">{translateBankText(row.description)}</p>
            <p className="text-[10px] text-dark/50">{translateBankText(row.category)}</p>
          </div>
        </div>
      )
    },
    { header: t('screens.bank.type'), render: (row) => <Badge variant={row.type === 'Income' ? 'success' : 'danger'}>{row.type === 'Income' ? t('screens.bank.income') : t('screens.bank.expense')}</Badge> },
    { 
      header: t('screens.bank.amount'),
      render: (row) => (
        <span className={`font-mono font-bold ${row.type === 'Income' ? 'text-green-700' : 'text-red-600'}`}>
          {row.type === 'Income' ? '+' : '-'} {row.amount}
        </span>
      )
    },
    { header: t('screens.bank.date'), accessor: 'date' }
  ];

  return (
    <div className="space-y-6 relative font-body text-[#4A4A43]">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 80 }} className="fixed top-20 right-4 z-[9999] flex items-center gap-2 bg-primary text-cream px-4 py-3 rounded-xl shadow-lg text-xs">
            <CheckCircle className="w-4 h-4 text-green-400" />
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-primary">{t('screens.bank.title')}</h2>
          <p className="text-dark/60 text-sm">{t('screens.bank.description')}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <Button 
            size="sm"
            onClick={() => setImportModalOpen(true)}
            className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold border-none py-1.5 px-3 text-xs"
          >
            <UploadCloud className="w-3.5 h-3.5 mr-1.5 text-emerald-300" />
            {language === 'EN' ? 'Import Bank Statements' : 'Bankafschriften Importeren'}
          </Button>
          <Button 
            size="sm" 
            icon={Plus} 
            onClick={() => setModalOpen(true)}
            className="py-1.5 px-3 text-xs font-bold"
          >
            {t('screens.bank.addTransaction')}
          </Button>
        </div>
      </div>

      {/* Financial Overview Stat Cards — Ultra-Compact Mini Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        <Card noPadding className="p-2.5 sm:p-3">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] font-bold text-dark/50 uppercase tracking-wider truncate">
              {t('screens.bank.bankBalance')}
            </span>
            <div className="p-1 bg-primary/10 rounded-md text-primary flex-shrink-0">
              <Landmark className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="text-sm sm:text-base font-heading font-bold text-primary mt-1 truncate">
            € {bankBalance.toLocaleString()}
          </p>
        </Card>

        <Card noPadding className="p-2.5 sm:p-3">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] font-bold text-dark/50 uppercase tracking-wider truncate">
              {t('screens.bank.totalIncome')}
            </span>
            <div className="p-1 bg-green-700/10 rounded-md text-green-800 flex-shrink-0">
              <ArrowDownRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="text-sm sm:text-base font-heading font-bold text-green-800 mt-1 truncate">
            € {totalIncome.toLocaleString()}
          </p>
        </Card>

        <Card noPadding className="p-2.5 sm:p-3">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] font-bold text-dark/50 uppercase tracking-wider truncate">
              {t('screens.bank.totalExpenses')}
            </span>
            <div className="p-1 bg-red-700/10 rounded-md text-red-700 flex-shrink-0">
              <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="text-sm sm:text-base font-heading font-bold text-red-700 mt-1 truncate">
            € {totalExpense.toLocaleString()}
          </p>
        </Card>

        <Card noPadding className="p-2.5 sm:p-3">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] font-bold text-dark/50 uppercase tracking-wider truncate">
              {t('screens.bank.netVatPayable')}
            </span>
            <div className="p-1 bg-amber-700/10 rounded-md text-amber-700 flex-shrink-0">
              <Percent className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="text-sm sm:text-base font-heading font-bold text-amber-700 mt-1 truncate">
            € {btwNettoAfdragen.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
        </Card>
      </div>

      {/* 21% BTW Return Summary Banner */}
      <Card p="p-4" className="bg-[#F8F7F4]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <span className="text-[10px] font-bold text-dark/50 uppercase tracking-wider block font-body">
              % VAT Return Overview (21% rate)
            </span>
            <h3 className="text-xs font-bold text-primary font-heading mt-0.5">
              Quarter Q4 2023
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-4 sm:gap-8 w-full sm:w-auto text-xs font-body">
            <div>
              <span className="text-[9px] text-dark/50 uppercase block font-bold">VAT Received (Sales)</span>
              <span className="font-bold text-green-800">€ {btwOntvangen.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div>
              <span className="text-[9px] text-dark/50 uppercase block font-bold">VAT Paid (Purchases)</span>
              <span className="font-bold text-red-700">€ {btwBetaald.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
            <div>
              <span className="text-[9px] text-dark/50 uppercase block font-bold">To Be Paid to Tax Authority</span>
              <span className="font-bold text-amber-800">€ {btwNettoAfdragen.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Transactions List Area */}
      <Card p="p-4">
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/40" />
            <input 
              type="text" 
              placeholder={language === 'EN' ? 'Search transaction or category...' : 'Zoek op omschrijving of categorie...'}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#EDE8DF]/40 border border-[#D6CFC2] rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-[#4A4A43]"
            />
          </div>

          <div className="flex gap-2">
            {['All', 'Income', 'Expense'].map((tp) => (
              <button
                key={tp}
                onClick={() => setTypeFilter(tp)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors border ${
                  typeFilter === tp
                    ? 'bg-primary text-cream border-primary'
                    : 'bg-[#EDE8DF]/30 text-dark/70 border-[#D6CFC2]'
                }`}
              >
                {tp === 'All' ? t('screens.bank.all') : tp === 'Income' ? t('screens.bank.income') : t('screens.bank.expense')}
              </button>
            ))}
          </div>
        </div>

        <Table columns={columns} data={processedTxns} />
      </Card>

      {/* ADD TRANSACTION MODAL */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-dark/60 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-[#EDE8DF] border border-[#C4BEB3] rounded-2xl p-6 shadow-2xl z-10 space-y-4">
              <div className="flex items-center justify-between border-b border-cream-dark/60 pb-3">
                <h3 className="text-lg font-heading font-bold text-primary">{language === 'NL' ? 'Transactie Toevoegen' : 'Add Transaction'}</h3>
                <button onClick={() => setModalOpen(false)} className="p-1 rounded-lg text-dark/40 hover:text-dark"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-dark/60 mb-1 uppercase">{language === 'NL' ? 'Omschrijving' : 'Description'}</label>
                  <input type="text" required value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg" placeholder={language === 'NL' ? 'e.g. Materiaal Inkoop Teak Hout' : 'e.g. Teak Wood Purchase'} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-dark/60 mb-1 uppercase">{language === 'NL' ? 'Type' : 'Type'}</label>
                    <select value={form.type} onChange={e => setForm(prev => ({ ...prev, type: e.target.value }))} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg">
                      <option value="Income">{language === 'NL' ? 'Inkomsten (Income)' : 'Income'}</option>
                      <option value="Expense">{language === 'NL' ? 'Uitgave (Expense)' : 'Expense'}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-dark/60 mb-1 uppercase">{language === 'NL' ? 'Bedrag (€)' : 'Amount (€)'}</label>
                    <input type="number" required value={form.amount} onChange={e => setForm(prev => ({ ...prev, amount: e.target.value }))} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg font-bold text-primary" placeholder="e.g. 2500" />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-dark/60 mb-1 uppercase">{language === 'NL' ? 'Categorie' : 'Category'}</label>
                  <input type="text" value={form.category} onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg" placeholder={language === 'NL' ? 'e.g. Verkoop / Materiaal' : 'e.g. Sales / Materials'} />
                </div>
                <div>
                  <label className="block font-semibold text-dark/60 mb-1 uppercase">{language === 'NL' ? 'Datum' : 'Date'}</label>
                  <input type="date" value={form.date} onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg" />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-cream-dark/60">
                  <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>{t('common.cancel')}</Button>
                  <Button type="submit">{language === 'NL' ? 'Opslaan' : 'Save'}</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODULE 5.1: IMPORT BANK STATEMENTS MODAL */}
      <AnimatePresence>
        {importModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-dark/60 backdrop-blur-sm" onClick={() => setImportModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-2xl bg-[#EDE8DF] border border-[#C4BEB3] rounded-2xl p-6 shadow-2xl z-10 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-cream-dark/60 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-800 text-white rounded-xl">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-heading font-bold text-primary flex items-center gap-2">
                      {language === 'EN' ? 'Import Bank Statements' : 'Bankafschriften Importeren'}
                      <span className="text-[10px] bg-emerald-200 text-emerald-950 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Boekhouding</span>
                    </h3>
                    <p className="text-xs text-dark/60">
                      {language === 'EN' ? 'Parse Rabobank, ING & ABN AMRO bank exports directly into accounting ledger & VAT.' : 'Verwerk Rabobank, ING & ABN AMRO bankafschriften automatisch in de boekhouding.'}
                    </p>
                  </div>
                </div>
                <button onClick={() => setImportModalOpen(false)} className="p-1 text-dark/40 hover:text-dark"><X className="w-5 h-5" /></button>
              </div>

              {/* Format Selector Dropdown (Bestandsformaat) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-dark/60 uppercase tracking-wider mb-1">
                    {language === 'EN' ? 'File Format Selector (Bestandsformaat)' : 'Bestandsformaat'}
                  </label>
                  <select
                    value={fileFormat}
                    onChange={(e) => setFileFormat(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#D6CFC2] rounded-xl text-xs font-bold text-primary shadow-xs"
                  >
                    <option value="PDF">📄 PDF (.pdf Bankafschrift)</option>
                    <option value="TXT">📊 Excel / CSV (.txt, .csv Export)</option>
                    <option value="XLS">📈 Excel Spreadsheet (.xls, .xlsx)</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => importFileInputRef.current?.click()}
                    className="w-full px-4 py-2 bg-[#F8F7F4] hover:bg-[#EDE8DF] border border-[#D6CFC2] rounded-xl text-xs font-bold text-primary flex items-center justify-center gap-2 transition-colors"
                  >
                    <FolderOpen className="w-4 h-4 text-emerald-700" />
                    {language === 'EN' ? 'Browse Bank Export File...' : 'Kies Bestand van Computer...'}
                  </button>
                  <input
                    type="file"
                    ref={importFileInputRef}
                    onChange={handleBankFileUpload}
                    accept=".pdf,.txt,.csv,.xls,.xlsx"
                    className="hidden"
                  />
                </div>
              </div>

              {/* Dropzone Box */}
              <div
                onClick={() => importFileInputRef.current?.click()}
                className="border-2 border-dashed border-[#D6CFC2] p-6 rounded-xl text-center bg-[#F8F7F4] hover:bg-[#EDE8DF]/60 transition-colors cursor-pointer space-y-2"
              >
                <FileSpreadsheet className="w-8 h-8 text-emerald-800 mx-auto" />
                {importFile ? (
                  <p className="text-xs font-bold text-emerald-800 bg-emerald-100 py-1.5 px-4 rounded-full inline-block">
                    📄 Selected: {importFile.name} ({(importFile.size / 1024).toFixed(1)} KB) - Format: {fileFormat}
                  </p>
                ) : (
                  <>
                    <p className="text-xs font-bold text-dark/80">
                      {language === 'EN' ? `Drag & drop your Rabobank/ING ${fileFormat} statement here` : `Sleep je Rabobank/ING ${fileFormat} bankafschrift hierheen`}
                    </p>
                    <p className="text-[10px] text-dark/50 font-mono">Format selected: {fileFormat} (Max 25MB)</p>
                  </>
                )}
              </div>

              {/* Parse Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleParseStatement}
                  className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1"
                >
                  ⚡ {language === 'EN' ? 'Or Load Sample Rabobank Export (Q3 2026)' : 'Of Laad Voorbeeld Rabobank Export (Q3 2026)'}
                </button>

                <Button
                  onClick={handleParseStatement}
                  disabled={isParsing}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold w-full sm:w-auto"
                >
                  {isParsing ? (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 animate-spin" />
                      {language === 'EN' ? 'Parsing Bank Export...' : 'Bankafschrift Verwerken...'}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      {language === 'EN' ? `Parse ${fileFormat} Statement` : `${fileFormat} Afschrift Verwerken`}
                    </span>
                  )}
                </Button>
              </div>

              {/* Parsed Output Preview */}
              {parsedTxns && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-3 pt-3 border-t border-[#D6CFC2]">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-700" />
                      {language === 'EN' ? `Extracted Transactions (${parsedTxns.length})` : `Geëxtraheerde Transacties (${parsedTxns.length})`}
                    </h4>
                    <span className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-bold">Ready to Sync</span>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {parsedTxns.map((t, idx) => (
                      <div key={idx} className="p-2.5 bg-white rounded-xl border border-emerald-200 text-xs flex justify-between items-center gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={`p-1 rounded-md ${t.type === 'Income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {t.type === 'Income' ? <ArrowDownRight className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-dark text-xs truncate">{t.description}</p>
                            <p className="text-[10px] text-dark/50">{t.category} • {t.date}</p>
                          </div>
                        </div>
                        <span className={`font-mono font-bold whitespace-nowrap ${t.type === 'Income' ? 'text-green-700' : 'text-red-600'}`}>
                          {t.type === 'Income' ? '+' : '-'} {t.amount}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button onClick={handleSyncImportedTransactions} className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2.5 mt-2 text-xs">
                    🚀 {language === 'EN' ? 'Sync All Transactions to Accounting & VAT Ledger' : 'Verwerk Alle Transacties in Boekhouding & BTW'}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
