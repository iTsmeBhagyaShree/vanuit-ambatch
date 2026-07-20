import React from 'react';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { Plus, Search, Filter } from 'lucide-react';
import { mockLeads } from '../../utils/mockData';

export default function Leads() {
  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Name', accessor: 'name' },
    { header: 'Company', accessor: 'company' },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Email', accessor: 'email' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => (
        <Badge variant={row.status === 'New' ? 'info' : row.status === 'Qualified' ? 'success' : 'default'}>
          {row.status}
        </Badge>
      )
    },
    { header: 'Date', accessor: 'date' },
    {
      header: 'Actions',
      render: () => <Button variant="ghost" size="sm">Edit</Button>
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-heading font-bold text-primary">Leads Management</h2>
        <Button icon={Plus}>Add New Lead</Button>
      </div>

      <Card>
        <div className="mb-6 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/40" />
            <input 
              type="text" 
              placeholder="Search leads by name or email..." 
              className="w-full pl-9 pr-4 py-2 bg-light/30 border border-secondary/40 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <Button variant="outline" icon={Filter}>Filters</Button>
        </div>

        <Table columns={columns} data={mockLeads} />
      </Card>
    </div>
  );
}
