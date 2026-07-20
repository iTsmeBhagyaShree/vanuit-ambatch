import React from 'react';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { Plus, Search, Filter } from 'lucide-react';
import { mockQuotes } from '../../utils/mockData';

export default function Quotes() {
  const columns = [
    { header: 'Quote #', accessor: 'id' },
    { header: 'Customer', accessor: 'customer' },
    { header: 'Project', accessor: 'project' },
    { header: 'Amount', accessor: 'amount' },
    { 
      header: 'Status', 
      render: (row) => (
        <Badge variant={row.status === 'Paid' ? 'success' : row.status === 'Accepted' ? 'primary' : row.status === 'Draft' ? 'default' : 'warning'}>
          {row.status}
        </Badge>
      )
    },
    { header: 'Date', accessor: 'date' },
    {
      header: 'Actions',
      render: () => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">View</Button>
          <Button variant="outline" size="sm">Convert</Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-primary">Quotes</h2>
          <p className="text-dark/60 text-sm">Manage and track all customer quotations.</p>
        </div>
        <Button icon={Plus}>Create Quote</Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Quotes', value: '56', color: 'text-dark' },
          { label: 'Draft', value: '12', color: 'text-dark/60' },
          { label: 'Accepted', value: '28', color: 'text-primary' },
          { label: 'Paid', value: '16', color: 'text-green-600' },
        ].map((stat, i) => (
          <Card key={i} className="text-center py-2">
            <p className={`text-2xl font-heading font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-dark/50 mt-1">{stat.label}</p>
          </Card>
        ))}
      </div>

      <Card>
        <div className="mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/40" />
            <input
              type="text"
              placeholder="Search quotes..."
              className="w-full pl-9 pr-4 py-2 bg-light/30 border border-secondary/40 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <Button variant="outline" icon={Filter} size="sm">Filters</Button>
        </div>
        <Table columns={columns} data={mockQuotes} />
      </Card>
    </div>
  );
}
