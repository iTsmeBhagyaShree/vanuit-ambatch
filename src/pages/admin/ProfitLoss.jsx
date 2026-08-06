import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Badge from '../../components/Badge';
import { Search, TrendingUp, DollarSign, PieChart, Percent, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { mockProfitLossData as defaultPLs } from '../../utils/mockData';

export default function ProfitLoss() {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [projectPLs, setProjectPLs] = useState([]);

  useEffect(() => {
    let activeData = defaultPLs;
    try {
      const saved = localStorage.getItem('app_profit_loss_v3') || localStorage.getItem('app_profit_loss_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          activeData = parsed;
        }
      }
    } catch (e) {}

    setProjectPLs(activeData);
    localStorage.setItem('app_profit_loss_v3', JSON.stringify(activeData));
    localStorage.setItem('app_profit_loss_v2', JSON.stringify(activeData));
    localStorage.setItem('app_profit_loss', JSON.stringify(activeData));
  }, []);

  const processedPLs = [...projectPLs].filter(p => 
    p.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Financial Aggregations
  const totalRevenue = projectPLs.reduce((acc, p) => acc + p.revenue, 0);
  const totalCosts = projectPLs.reduce((acc, p) => acc + (p.partnerCost || 0) + (p.materialCost || 0) + (p.otherCost || 0), 0);
  const totalGrossProfit = totalRevenue - totalCosts;
  const averageMargin = totalRevenue > 0 ? (totalGrossProfit / totalRevenue) * 100 : 0;

  const translateProjectName = (name) => {
    if (language !== 'EN' || !name) return name;
    return name
      .replace(/Luxe Teak Buitenkeuken 4m/g, 'Luxury Teak Outdoor Kitchen 4m')
      .replace(/Kliko Ombouw Triple Antraciet/g, 'Triple Bin Storage Anthracite')
      .replace(/Eiken Houten Overkapping 6x4m/g, 'Oak Wooden Canopy 6x4m')
      .replace(/Tuinterras De Luxe/g, 'Luxury Terrace Decking')
      .replace(/Buitenkeuken/g, 'Outdoor Kitchen')
      .replace(/Kliko Ombouw/g, 'Bin Storage')
      .replace(/Overkapping/g, 'Canopy');
  };

  const translateCategory = (cat) => {
    if (language !== 'EN' || !cat) return cat;
    return cat
      .replace(/Buitenkeukens/g, 'Outdoor Kitchens')
      .replace(/Kliko Ombouwen/g, 'Bin Storage')
      .replace(/Overkappingen/g, 'Canopies')
      .replace(/Terrassen/g, 'Terraces');
  };

  const columns = [
    { 
      header: language === 'EN' ? 'PROJECT / CLIENT' : 'Project / Klant',
      style: { minWidth: '220px' },
      render: (row) => (
        <div>
          <p className="font-bold text-dark text-xs sm:text-sm">{translateProjectName(row.projectName)}</p>
          <p className="text-[11px] text-dark/50 font-mono flex items-center gap-1 mt-0.5">
            <span className="font-semibold text-primary">{row.customer}</span> • ID: {row.projectId}
          </p>
        </div>
      )
    },
    { 
      header: language === 'EN' ? 'CATEGORY' : 'Categorie',
      render: (row) => (
        <span className="text-[11px] font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-lg">
          {translateCategory(row.category)}
        </span>
      )
    },
    { 
      header: language === 'EN' ? 'REVENUE' : 'Omzet (Revenue)', 
      render: (row) => <span className="font-mono font-bold text-dark text-xs sm:text-sm">€ {row.revenue.toLocaleString()}</span> 
    },
    { 
      header: language === 'EN' ? 'PARTNER & MATERIAL COSTS' : 'Partner & Materiaal Kosten', 
      render: (row) => {
        const costSum = (row.partnerCost || 0) + (row.materialCost || 0) + (row.otherCost || 0);
        return <span className="font-mono text-rose-600 font-semibold text-xs sm:text-sm">€ {costSum.toLocaleString()}</span>;
      }
    },
    { 
      header: language === 'EN' ? 'GROSS PROFIT' : 'Brutowinst (Profit)', 
      render: (row) => {
        const costSum = (row.partnerCost || 0) + (row.materialCost || 0) + (row.otherCost || 0);
        const profit = row.revenue - costSum;
        return <span className="font-mono font-bold text-emerald-700 text-xs sm:text-sm">€ {profit.toLocaleString()}</span>;
      }
    },
    { 
      header: language === 'EN' ? 'PROFIT MARGIN %' : 'Winstmarge %', 
      render: (row) => {
        const costSum = (row.partnerCost || 0) + (row.materialCost || 0) + (row.otherCost || 0);
        const profit = row.revenue - costSum;
        const margin = ((profit / row.revenue) * 100).toFixed(1);
        return (
          <Badge variant={margin >= 30 ? 'success' : margin >= 15 ? 'warning' : 'danger'}>
            {margin}% {language === 'EN' ? 'Margin' : 'Marge'}
          </Badge>
        );
      }
    }
  ];

  return (
    <div className="space-[#4A4A43] space-y-6 font-body">
      <div>
        <h2 className="text-2xl font-heading font-bold text-primary">
          {language === 'EN' ? 'Profit & Loss Analysis' : 'Winst & Verlies (Profit & Loss)'}
        </h2>
        <p className="text-dark/60 text-sm">
          {language === 'EN' 
            ? 'Financial overview and profit margin breakdown per project.' 
            : 'Financieel overzicht en winstmarge analyse per project.'}
        </p>
      </div>

      {/* Overview Stat Cards — Ultra-Attractive Premium Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-[#EDE8DF] border border-[#C4BEB3] rounded-2xl shadow-sm flex items-center justify-between border-l-4 border-l-primary">
          <div className="space-y-1 min-w-0">
            <p className="text-[11px] font-bold text-dark/50 uppercase tracking-wider truncate">
              {language === 'EN' ? 'Total Revenue' : 'Totale Omzet (Revenue)'}
            </p>
            <p className="text-xl sm:text-2xl font-heading font-bold text-primary truncate">€ {totalRevenue.toLocaleString()}</p>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
              <ArrowUpRight className="w-3 h-3" /> {language === 'EN' ? 'Target Achieved' : 'Target Behaald'}
            </span>
          </div>
          <div className="p-3 bg-primary/10 rounded-xl text-primary flex-shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 bg-[#EDE8DF] border border-[#C4BEB3] rounded-2xl shadow-sm flex items-center justify-between border-l-4 border-l-rose-600">
          <div className="space-y-1 min-w-0">
            <p className="text-[11px] font-bold text-dark/50 uppercase tracking-wider truncate">
              {language === 'EN' ? 'Project Costs' : 'Projectkosten (Costs)'}
            </p>
            <p className="text-xl sm:text-2xl font-heading font-bold text-rose-700 truncate">€ {totalCosts.toLocaleString()}</p>
            <span className="inline-flex items-center text-[10px] font-semibold text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded-full">
              {language === 'EN' ? 'Materials & Craftsman' : 'Materiaal & Vakman'}
            </span>
          </div>
          <div className="p-3 bg-rose-600/10 rounded-xl text-rose-600 flex-shrink-0">
            <PieChart className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 bg-[#EDE8DF] border border-[#C4BEB3] rounded-2xl shadow-sm flex items-center justify-between border-l-4 border-l-emerald-600">
          <div className="space-y-1 min-w-0">
            <p className="text-[11px] font-bold text-dark/50 uppercase tracking-wider truncate">
              {language === 'EN' ? 'Gross Profit' : 'Brutowinst (Profit)'}
            </p>
            <p className="text-xl sm:text-2xl font-heading font-bold text-emerald-800 truncate">€ {totalGrossProfit.toLocaleString()}</p>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3" /> {language === 'EN' ? 'Net Realized' : 'Netto Behaald'}
            </span>
          </div>
          <div className="p-3 bg-emerald-600/10 rounded-xl text-emerald-700 flex-shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 bg-[#EDE8DF] border border-[#C4BEB3] rounded-2xl shadow-sm flex items-center justify-between border-l-4 border-l-amber-600">
          <div className="space-y-1 min-w-0">
            <p className="text-[11px] font-bold text-dark/50 uppercase tracking-wider truncate">
              {language === 'EN' ? 'Average Margin' : 'Gemiddelde Marge'}
            </p>
            <p className="text-xl sm:text-2xl font-heading font-bold text-amber-800 truncate">{averageMargin.toFixed(1)}%</p>
            <span className="inline-flex items-center text-[10px] font-semibold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full">
              High Margin Target
            </span>
          </div>
          <div className="p-3 bg-amber-600/10 rounded-xl text-amber-800 flex-shrink-0">
            <Percent className="w-6 h-6" />
          </div>
        </div>
      </div>

      <Card>
        <div className="mb-6 flex flex-col sm:flex-row justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/40" />
            <input
              type="text"
              placeholder={language === 'EN' ? 'Search project or customer for P&L...' : 'Zoek project of klant voor P&L...'}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#EDE8DF]/30 border border-[#D6CFC2] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-[#4A4A43]"
            />
          </div>
        </div>

        <Table columns={columns} data={processedPLs} />
      </Card>
    </div>
  );
}
