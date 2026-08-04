import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { Plus, Search, Filter, X, CheckCircle, RotateCcw, ArrowDownRight, ArrowUpRight, Landmark, Percent } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { mockBankTransactions as defaultTransactions } from '../../utils/mockData';

export default function Bank() {
  const { t, language } = useLanguage();
  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All'); // 'All' | 'Income' | 'Expense'
  const [modalOpen, setModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const translateBankText = (str) => {
    if (language !== 'EN' || !str) return str;
    return str
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
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 10 }} exit={{ opacity: 0, y: -20 }} className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-primary text-cream px-4 py-3 rounded-xl shadow-lg text-xs">
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
        <Button icon={Plus} onClick={() => setModalOpen(true)}>{t('screens.bank.addTransaction')}</Button>
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

        <Card noPadding className="p-2.5 sm:p-3 bg-[#EDE8DF]/90 border border-[#C4BEB3]">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] font-bold text-dark/60 uppercase tracking-wider truncate">
              {t('screens.bank.netVatPayable')}
            </span>
            <div className="p-1 bg-[#70624F]/15 rounded-md text-[#70624F] flex-shrink-0">
              <Percent className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="text-sm sm:text-base font-heading font-bold text-primary mt-1 truncate">
            € {Math.round(btwNettoAfdragen).toLocaleString()}
          </p>
        </Card>
      </div>

      {/* BTW Breakdown Detailed Card */}
      <Card noPadding className="bg-[#EDE8DF]/60 border border-[#D6CFC2] p-3 sm:p-4">
        <div className="flex justify-between items-center pb-2 border-b border-[#D6CFC2]">
          <h3 className="font-heading font-bold text-primary text-xs sm:text-sm flex items-center gap-1.5">
            <Percent className="w-3.5 h-3.5 text-primary" /> {t('screens.bank.vatOverview')}
          </h3>
          <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
            {t('screens.bank.quarter')}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-2.5 text-xs">
          <div className="min-w-0">
            <span className="text-dark/50 block text-[9px] sm:text-[10px] uppercase font-bold truncate">{t('screens.bank.vatReceived')}</span>
            <span className="font-bold text-green-800 text-xs sm:text-sm truncate block mt-0.5">€ {Math.round(btwOntvangen).toLocaleString()}</span>
          </div>
          <div className="min-w-0">
            <span className="text-dark/50 block text-[9px] sm:text-[10px] uppercase font-bold truncate">{t('screens.bank.vatPaid')}</span>
            <span className="font-bold text-red-700 text-xs sm:text-sm truncate block mt-0.5">€ {Math.round(btwBetaald).toLocaleString()}</span>
          </div>
          <div className="min-w-0">
            <span className="text-dark/50 block text-[9px] sm:text-[10px] uppercase font-bold truncate">{t('screens.bank.taxAuthority')}</span>
            <span className="font-bold text-primary text-xs sm:text-sm truncate block mt-0.5">€ {Math.round(btwNettoAfdragen).toLocaleString()}</span>
          </div>
        </div>
      </Card>

      <Card>
        <div className="mb-6 flex flex-col sm:flex-row justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/40" />
            <input
              type="text"
              placeholder={t('screens.bank.search')}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#EDE8DF]/30 border border-[#D6CFC2] rounded-lg text-sm"
            />
          </div>
          <div className="flex gap-2">
            {['All', 'Income', 'Expense'].map(tp => (
              <button
                key={tp}
                onClick={() => setTypeFilter(tp)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
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
    </div>
  );
}
