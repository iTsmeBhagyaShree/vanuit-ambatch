import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { Plus, Search, Filter, X, CheckCircle, Trash2, Edit2, RotateCcw, FileText, Download, Printer, Check } from 'lucide-react';
import { mockInvoices as defaultInvoices } from '../../utils/mockData';
import { useLanguage } from '../../context/LanguageContext';

export default function Invoices() {
  const { t } = useLanguage();
  const [invoices, setInvoices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter States
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const [modalOpen, setModalOpen] = useState(false);
  const [pdfInvoice, setPdfInvoice] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  // Form State for Manual Invoice Creation
  const [form, setForm] = useState({
    customer: '',
    type: '50% Aanbetaling (Upfront)',
    amount: '',
    status: 'Openstaand',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  // Load invoices from localStorage on mount
  useEffect(() => {
    const savedInvoices = localStorage.getItem('app_invoices');
    if (savedInvoices) {
      try {
        const parsed = JSON.parse(savedInvoices);
        if (Array.isArray(parsed) && parsed.length > 0) setInvoices(parsed);
        else setInvoices(defaultInvoices);
      } catch(e) { setInvoices(defaultInvoices); }
    } else {
      setInvoices(defaultInvoices);
      localStorage.setItem('app_invoices', JSON.stringify(defaultInvoices));
    }
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleMarkAsPaid = (invId) => {
    const targetInv = invoices.find(i => i.id === invId);
    const updatedInvoices = invoices.map(i => i.id === invId ? { ...i, status: 'Betaald' } : i);
    setInvoices(updatedInvoices);
    localStorage.setItem('app_invoices', JSON.stringify(updatedInvoices));

    if (targetInv) {
      const existingTxns = JSON.parse(localStorage.getItem('app_bank_txns') || '[]');
      const newTxn = {
        id: `TXN-${Date.now().toString().slice(-4)}`,
        date: new Date().toISOString().split('T')[0],
        description: `Factuur Betaling: ${targetInv.customer} (${targetInv.id})`,
        amount: targetInv.amount || `€ ${targetInv.numericAmount}`,
        type: 'Income',
        category: 'Factuur Opbrengst'
      };
      localStorage.setItem('app_bank_txns', JSON.stringify([newTxn, ...existingTxns]));
    }
    window.dispatchEvent(new Event('app_data_changed'));
    showToast(`Factuur "${invId}" gemarkeerd als Betaald!`);
  };

  const handleDeleteInvoice = (invId) => {
    const updatedInvoices = invoices.filter(i => i.id !== invId);
    setInvoices(updatedInvoices);
    localStorage.setItem('app_invoices', JSON.stringify(updatedInvoices));
    window.dispatchEvent(new Event('app_data_changed'));
    showToast(`Factuur "${invId}" verwijderd.`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.customer || !form.amount) {
      return showToast('Vul alle verplichte velden in.');
    }

    const numVal = parseFloat(form.amount) || 0;
    const newInv = {
      id: `INV-${Date.now().toString().slice(-4)}`,
      customer: form.customer,
      type: form.type,
      amount: `€ ${numVal.toLocaleString()}`,
      numericAmount: numVal,
      status: form.status,
      dueDate: form.dueDate,
      createdDate: new Date().toISOString().split('T')[0]
    };

    const updatedInvoices = [newInv, ...invoices];
    setInvoices(updatedInvoices);
    localStorage.setItem('app_invoices', JSON.stringify(updatedInvoices));
    window.dispatchEvent(new Event('app_data_changed'));
    showToast(`Nieuwe factuur ${newInv.id} aangemaakt!`);
    setModalOpen(false);
  };

  const getNumericAmount = (amtStr, numericFallback) => {
    if (numericFallback) return numericFallback;
    if (!amtStr) return 0;
    const val = parseFloat(String(amtStr).replace(/[^\d.-]/g, ''));
    return isNaN(val) ? 0 : val;
  };

  // Filter & Sort Logic
  const processedInvoices = [...invoices]
    .filter(inv => {
      const matchesSearch = 
        inv.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (inv.type && inv.type.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdDate || b.dueDate) - new Date(a.createdDate || a.dueDate);
      if (sortBy === 'oldest') return new Date(a.createdDate || a.dueDate) - new Date(b.createdDate || b.dueDate);
      if (sortBy === 'amount-desc') return getNumericAmount(b.amount, b.numericAmount) - getNumericAmount(a.amount, a.numericAmount);
      if (sortBy === 'amount-asc') return getNumericAmount(a.amount, a.numericAmount) - getNumericAmount(b.amount, b.numericAmount);
      return 0;
    });

  // Calculate Summary Stats
  const totalCount = invoices.length;
  const paidInvoices = invoices.filter(i => i.status === 'Betaald');
  const openInvoices = invoices.filter(i => i.status === 'Openstaand');
  const overdueInvoices = invoices.filter(i => i.status === 'Vervallen');

  const totalPaidSum = paidInvoices.reduce((acc, i) => acc + getNumericAmount(i.amount, i.numericAmount), 0);
  const totalOpenSum = openInvoices.reduce((acc, i) => acc + getNumericAmount(i.amount, i.numericAmount), 0);
  const totalOverdueSum = overdueInvoices.reduce((acc, i) => acc + getNumericAmount(i.amount, i.numericAmount), 0);

  const getBadgeVariant = (status) => {
    switch (status) {
      case 'Betaald':
        return 'success';
      case 'Openstaand':
        return 'warning';
      case 'Vervallen':
        return 'danger';
      default:
        return 'default';
    }
  };

  const columns = [
    { header: t('screens.invoices.number'), accessor: 'id' },
    { header: t('screens.invoices.customer'), accessor: 'customer' },
    { header: t('screens.invoices.typeDescription'), accessor: 'type' },
    { header: t('screens.invoices.amount'), accessor: 'amount' },
    { 
      header: 'Status', 
      render: (row) => (
        <Badge variant={getBadgeVariant(row.status)}>
          {row.status}
        </Badge>
      )
    },
    { header: t('screens.invoices.dueDate'), accessor: 'dueDate' },
    {
      header: t('screens.invoices.actions'),
      render: (row) => (
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          {row.status !== 'Betaald' && (
            <Button
              variant="custom"
              size="sm"
              onClick={() => handleMarkAsPaid(row.id)}
              className="bg-green-600 hover:bg-green-700 text-white"
              title={t('screens.invoices.markPaid')}
            >
              <Check className="w-3.5 h-3.5 mr-1" /> {t('screens.invoices.paid')}
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPdfInvoice(row)}
            className="text-dark/70 hover:bg-[#D6CFC2]/40"
            title={t('screens.invoices.printPreview')}
          >
            <Printer className="w-3.5 h-3.5 mr-1" /> PDF
          </Button>
          <Button
            variant="custom"
            size="sm"
            onClick={() => handleDeleteInvoice(row.id)}
            className="text-red-600 bg-red-50 hover:bg-red-100 border border-red-200"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 relative font-body text-[#4A4A43]">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 10 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-primary text-cream px-4 py-3 rounded-xl shadow-lg border border-[#D6CFC2]/20 text-xs"
          >
            <CheckCircle className="w-4 h-4 text-green-400" />
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-primary">{t('screens.invoices.title')}</h2>
          <p className="text-dark/60 text-sm">{t('screens.invoices.description')}</p>
        </div>
        <Button icon={Plus} onClick={() => setModalOpen(true)}>{t('screens.invoices.newInvoice')}</Button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        <Card noPadding className="text-center p-2.5 sm:p-3">
          <p className="text-base sm:text-xl font-heading font-bold text-dark">{totalCount}</p>
          <p className="text-[10px] text-dark/50 mt-0.5 uppercase font-bold tracking-wider">{t('screens.invoices.totalInvoices')}</p>
        </Card>
        <Card noPadding className="text-center p-2.5 sm:p-3">
          <p className="text-base sm:text-xl font-heading font-bold text-green-700">€ {totalPaidSum.toLocaleString()}</p>
          <p className="text-[10px] text-dark/50 mt-0.5 uppercase font-bold tracking-wider">{t('screens.invoices.paid')}</p>
        </Card>
        <Card noPadding className="text-center p-2.5 sm:p-3">
          <p className="text-base sm:text-xl font-heading font-bold text-amber-700">€ {totalOpenSum.toLocaleString()}</p>
          <p className="text-[10px] text-dark/50 mt-0.5 uppercase font-bold tracking-wider">{t('screens.invoices.pending')}</p>
        </Card>
        <Card noPadding className="text-center p-2.5 sm:p-3">
          <p className="text-base sm:text-xl font-heading font-bold text-red-600">€ {totalOverdueSum.toLocaleString()}</p>
          <p className="text-[10px] text-dark/50 mt-0.5 uppercase font-bold tracking-wider">{t('screens.invoices.overdue')}</p>
        </Card>
      </div>

      <Card>
        <div className="mb-6 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/40" />
              <input
                type="text"
                placeholder={t('screens.invoices.search')}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#EDE8DF]/30 border border-[#D6CFC2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-[#4A4A43]"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant={showFilterPanel ? 'primary' : 'outline'} 
                icon={Filter} 
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                size="sm"
              >
                Filters
              </Button>
              {(statusFilter !== 'All' || searchQuery !== '') && (
                <Button 
                  variant="ghost" 
                  icon={RotateCcw} 
                  onClick={() => { setStatusFilter('All'); setSearchQuery(''); }}
                  size="sm"
                  className="text-xs text-dark/65"
                >
                  Reset
                </Button>
              )}
            </div>
          </div>

          {/* Filter Panel */}
          <AnimatePresence>
            {showFilterPanel && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-[#D6CFC2]/50 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <div>
                  <label className="block text-xs font-semibold text-dark/60 mb-1.5 uppercase tracking-wider">{t('screens.invoices.statusFilter')}</label>
                  <div className="flex flex-wrap gap-2">
                    {['All', 'Betaald', 'Openstaand', 'Vervallen'].map((st) => (
                      <button
                        key={st}
                        onClick={() => setStatusFilter(st)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                          statusFilter === st
                            ? 'bg-primary text-cream border-primary shadow-sm'
                            : 'bg-[#EDE8DF]/30 text-dark/70 border-[#D6CFC2] hover:bg-[#EDE8DF]/60'
                        }`}
                      >
                        {st === 'All' ? t('screens.bank.all') : st === 'Betaald' ? t('screens.invoices.paid') : st === 'Openstaand' ? t('screens.invoices.pending') : t('screens.invoices.overdue')}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-dark/60 mb-1.5 uppercase tracking-wider">{t('screens.invoices.sortBy')}</label>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="w-full max-w-xs px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg text-xs focus:outline-none"
                  >
                    <option value="newest">{t('screens.invoices.dateNewest')}</option>
                    <option value="oldest">{t('screens.invoices.dateOldest')}</option>
                    <option value="amount-desc">{t('screens.invoices.amountHighest')}</option>
                    <option value="amount-asc">{t('screens.invoices.amountLowest')}</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Table columns={columns} data={processedInvoices} />
      </Card>

      {/* CREATE INVOICE MODAL */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-dark/60 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-lg bg-[#EDE8DF] border border-[#C4BEB3] rounded-2xl p-6 shadow-2xl z-10 space-y-4">
              <div className="flex items-center justify-between border-b border-cream-dark/60 pb-3">
                <h3 className="text-lg font-heading font-bold text-primary">Nieuwe Factuur Aanmaken</h3>
                <button onClick={() => setModalOpen(false)} className="p-1 rounded-lg text-dark/40 hover:text-dark"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-dark/60 mb-1 uppercase">Klantnaam</label>
                  <input type="text" required value={form.customer} onChange={e => setForm(prev => ({ ...prev, customer: e.target.value }))} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg text-xs" placeholder="e.g. Jan de Vries" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-dark/60 mb-1 uppercase">Factuur Type</label>
                    <select value={form.type} onChange={e => setForm(prev => ({ ...prev, type: e.target.value }))} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg text-xs">
                      <option value="50% Aanbetaling (Upfront)">50% Aanbetaling</option>
                      <option value="50% Eindfactuur (Completion)">50% Eindfactuur</option>
                      <option value="100% Volledige Factuur">100% Volledige Factuur</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-dark/60 mb-1 uppercase">Bedrag (€)</label>
                    <input type="number" required value={form.amount} onChange={e => setForm(prev => ({ ...prev, amount: e.target.value }))} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg text-xs font-bold text-primary" placeholder="e.g. 6250" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-dark/60 mb-1 uppercase">Status</label>
                    <select value={form.status} onChange={e => setForm(prev => ({ ...prev, status: e.target.value }))} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg text-xs">
                      <option value="Openstaand">Openstaand</option>
                      <option value="Betaald">Betaald</option>
                      <option value="Vervallen">Vervallen</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-dark/60 mb-1 uppercase">Vervaldatum</label>
                    <input type="date" value={form.dueDate} onChange={e => setForm(prev => ({ ...prev, dueDate: e.target.value }))} className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-lg text-xs" />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-cream-dark/60">
                  <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>{t('common.cancel')}</Button>
                  <Button type="submit">Opslaan</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PDF PRINT / PREVIEW MODAL */}
      <AnimatePresence>
        {pdfInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-dark/75 backdrop-blur-xs" 
              onClick={() => setPdfInvoice(null)} 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }} 
              className="relative w-full max-w-xl bg-white border border-[#D6CFC2] rounded-2xl p-4 sm:p-6 shadow-2xl z-10 space-y-4 max-h-[92vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#D6CFC2] pb-3 print:hidden">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                  <h3 className="font-heading font-bold text-base sm:text-lg text-primary truncate">
                    Factuur PDF Preview ({pdfInvoice.id})
                  </h3>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                  <Button size="sm" icon={Printer} onClick={() => window.print()} className="text-xs">
                    <span className="hidden sm:inline">Afdrukken / </span>Export PDF
                  </Button>
                  <button onClick={() => setPdfInvoice(null)} className="p-1.5 text-dark/40 hover:text-dark rounded-lg hover:bg-dark/5 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Printable Invoice Card */}
              <div className="p-4 sm:p-6 bg-[#F8F7F4] rounded-xl border border-[#D6CFC2] space-y-5 text-xs text-dark/80 font-body">
                {/* Brand & Invoice Info Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 pb-4 border-b border-[#D6CFC2]/60">
                  <div>
                    <h2 className="text-lg sm:text-xl font-heading font-bold text-primary tracking-tight">VANUIT AMBACHT</h2>
                    <p className="text-[10px] text-dark/50 font-mono">Exclusieve Houtbouw & Buitenkeukens</p>
                  </div>
                  <div className="sm:text-right">
                    <p className="font-bold text-dark text-sm sm:text-base font-mono">{pdfInvoice.id}</p>
                    <p className="text-dark/60 text-[11px] font-mono">Vervaldatum: {pdfInvoice.dueDate}</p>
                    <Badge variant={getBadgeVariant(pdfInvoice.status)} className="mt-1">{pdfInvoice.status}</Badge>
                  </div>
                </div>

                {/* Client & Invoice Meta Box */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-white rounded-xl border border-[#D6CFC2]/50 shadow-xs">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-dark/40 tracking-wider">Factuur Aan (Client):</p>
                    <p className="font-bold text-dark text-xs sm:text-sm mt-0.5">{pdfInvoice.customer}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-dark/40 tracking-wider">Omschrijving / Type:</p>
                    <p className="font-bold text-dark text-xs sm:text-sm mt-0.5">{pdfInvoice.type}</p>
                  </div>
                </div>

                {/* Line Items Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#D6CFC2] text-[10px] uppercase text-dark/50 font-bold tracking-wider">
                        <th className="py-2 pr-2">Omschrijving</th>
                        <th className="py-2 text-right pl-2">Bedrag</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#D6CFC2]/30">
                      <tr>
                        <td className="py-3 pr-2 font-semibold text-dark text-xs">
                          {pdfInvoice.type} voor project ({pdfInvoice.customer})
                        </td>
                        <td className="py-3 text-right pl-2 font-mono font-bold text-primary text-xs sm:text-sm whitespace-nowrap">
                          {pdfInvoice.amount}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Totals Row */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-3 border-t border-[#D6CFC2]">
                  <span className="text-[11px] text-dark/50">Inclusief 21% BTW</span>
                  <div className="text-right flex items-center gap-2 self-end sm:self-auto">
                    <span className="text-xs font-semibold text-dark/70">Totaal Te Voldoen:</span>
                    <span className="text-sm sm:text-base font-bold text-primary font-mono whitespace-nowrap">{pdfInvoice.amount}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
