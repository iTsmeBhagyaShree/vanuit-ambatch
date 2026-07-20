import React from 'react';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { Plus, Search, Filter } from 'lucide-react';
import { mockProjects } from '../../utils/mockData';

export default function Projects() {
  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Project Name', accessor: 'name' },
    { header: 'Customer', accessor: 'customer' },
    { header: 'Assigned Partner', accessor: 'partner' },
    { 
      header: 'Progress', 
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-full bg-secondary/30 rounded-full h-2">
            <div className="bg-primary h-2 rounded-full" style={{ width: `${row.progress}%` }}></div>
          </div>
          <span className="text-xs text-dark/70 w-8">{row.progress}%</span>
        </div>
      )
    },
    { header: 'Deadline', accessor: 'deadline' },
    { 
      header: 'Status', 
      render: (row) => (
        <Badge variant={row.status === 'Completed' ? 'success' : row.status === 'In Progress' ? 'primary' : 'warning'}>
          {row.status}
        </Badge>
      )
    },
    {
      header: 'Actions',
      render: () => <Button variant="ghost" size="sm">View</Button>
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-heading font-bold text-primary">Projects</h2>
        <Button icon={Plus}>Create Project</Button>
      </div>

      <Card>
        <div className="mb-6 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/40" />
            <input 
              type="text" 
              placeholder="Search projects..." 
              className="w-full pl-9 pr-4 py-2 bg-light/30 border border-secondary/40 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <Button variant="outline" icon={Filter}>Filters</Button>
        </div>

        <Table columns={columns} data={mockProjects} />
      </Card>
    </div>
  );
}
