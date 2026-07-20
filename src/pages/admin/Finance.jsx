import React from 'react';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { TrendingUp, DollarSign, Clock, CheckCircle, Download, Filter } from 'lucide-react';
import { mockQuotes } from '../../utils/mockData';

export default function Finance() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-primary">Finance</h2>
          <p className="text-dark/60 text-sm">Track revenue, invoices and payments.</p>
        </div>
        <Button icon={Download} variant="outline">Export</Button>
      </div>

      {/* Finance KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: '€ 248,500', icon: TrendingUp, color: 'bg-green-50 text-green-600', sub: '+23% this year' },
          { label: 'This Month', value: '€ 45,200', icon: DollarSign, color: 'bg-primary/10 text-primary', sub: '+8% vs last month' },
          { label: 'Outstanding', value: '€ 18,900', icon: Clock, color: 'bg-yellow-50 text-yellow-600', sub: '4 invoices pending' },
          { label: 'Paid (Ytd)', value: '€ 229,600', icon: CheckCircle, color: 'bg-blue-50 text-blue-600', sub: '92% collection rate' },
        ].map((stat, i) => (
          <Card key={i}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-dark/60 font-medium">{stat.label}</p>
                <p className="text-2xl font-heading font-bold text-dark mt-1">{stat.value}</p>
                <p className="text-xs text-dark/50 mt-1">{stat.sub}</p>
              </div>
              <div className={`p-2.5 rounded-lg ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Revenue by Month */}
      <Card title="Revenue Overview (2023)">
        <div className="flex items-end gap-2 h-32">
          {[30, 45, 38, 55, 42, 65, 52, 70, 58, 80, 68, 90].map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full bg-primary/80 rounded-t-sm transition-all hover:bg-primary" style={{ height: `${val}%` }}></div>
              <span className="text-xs text-dark/40 hidden sm:block">
                {['J','F','M','A','M','J','J','A','S','O','N','D'][i]}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Invoice Table */}
      <Card title="Invoices" action={<Button variant="ghost" size="sm">View All</Button>}>
        <div className="space-y-3">
          {mockQuotes.map(quote => (
            <div key={quote.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-secondary/30 rounded-lg hover:bg-light/50 transition-colors gap-3">
              <div>
                <p className="font-medium text-dark">{quote.id} – {quote.customer}</p>
                <p className="text-sm text-dark/60">{quote.project}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-heading font-bold text-dark">{quote.amount}</span>
                <Badge variant={quote.status === 'Paid' ? 'success' : quote.status === 'Accepted' ? 'primary' : 'default'}>
                  {quote.status}
                </Badge>
                <span className="text-xs text-dark/40">{quote.date}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
