import React from 'react';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { Plus, Search, Filter, Star } from 'lucide-react';
import { mockPartners } from '../../utils/mockData';

export default function Partners() {
  const columns = [
    { 
      header: 'Partner',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm flex-shrink-0">
            {row.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <p className="font-medium text-dark">{row.name}</p>
            <p className="text-xs text-dark/50">{row.company}</p>
          </div>
        </div>
      )
    },
    { header: 'Email', accessor: 'email' },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Projects', accessor: 'projects' },
    {
      header: 'Status',
      render: (row) => <Badge variant={row.status === 'Active' ? 'success' : 'default'}>{row.status}</Badge>
    },
    {
      header: 'Actions',
      render: () => <Button variant="ghost" size="sm">View Profile</Button>
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-primary">Partners</h2>
          <p className="text-dark/60 text-sm">Manage external partners and freelancers.</p>
        </div>
        <Button icon={Plus}>Add Partner</Button>
      </div>

      {/* Partner Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {mockPartners.map(partner => (
          <Card key={partner.id} className="hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-heading font-bold text-lg flex-shrink-0">
                {partner.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-semibold text-dark">{partner.name}</h3>
                  <Badge variant="success">{partner.status}</Badge>
                </div>
                <p className="text-sm text-dark/60">{partner.company}</p>
                <p className="text-xs text-dark/40 mt-1">{partner.email}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-dark/60">{partner.projects} projects assigned</span>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-dark/20'}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card title="Partner List">
        <div className="mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/40" />
            <input type="text" placeholder="Search partners..." className="w-full pl-9 pr-4 py-2 bg-light/30 border border-secondary/40 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <Button variant="outline" icon={Filter} size="sm">Filters</Button>
        </div>
        <Table columns={columns} data={mockPartners} />
      </Card>
    </div>
  );
}
