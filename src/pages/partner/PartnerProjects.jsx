import React from 'react';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { Calendar, Briefcase, Clock, Upload, FileText, CheckCircle } from 'lucide-react';
import { mockProjects } from '../../utils/mockData';
import projectImg from '../../assets/outdoor_project_card.png';

export default function PartnerProjects() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-primary">Mijn Projecten</h2>
          <p className="text-dark/50 text-sm font-body">Al uw toegewezen projecten op één plek.</p>
        </div>
        <Button icon={Upload} variant="outline" size="sm">Document Uploaden</Button>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Alle projecten', count: mockProjects.length, color: 'border-l-primary' },
          { label: 'In uitvoering', count: mockProjects.filter(p => p.status === 'In Progress').length, color: 'border-l-accent' },
          { label: 'Voltooid', count: mockProjects.filter(p => p.status === 'Completed').length, color: 'border-l-green-500' },
        ].map((s, i) => (
          <Card key={i} className={`border-l-4 ${s.color} py-3`}>
            <p className="text-2xl font-heading font-bold text-dark">{s.count}</p>
            <p className="text-xs text-dark/50 font-body">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {mockProjects.map(project => (
          <Card key={project.id} className="overflow-hidden hover:shadow-card-hover transition-shadow" noPadding>
            {/* Image */}
            <div className="relative h-40 overflow-hidden">
              <img src={projectImg} alt={project.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent"></div>
              <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                <h3 className="font-heading font-bold text-white text-sm leading-snug flex-1 pr-2">{project.name}</h3>
                <Badge variant={project.status === 'Completed' ? 'success' : project.status === 'In Progress' ? 'primary' : 'warning'} className="flex-shrink-0 text-[10px]">
                  {project.status}
                </Badge>
              </div>
            </div>

            {/* Details */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-body text-dark/60">
                <span>Klant: <span className="font-medium text-dark">{project.customer}</span></span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {project.deadline}</span>
              </div>

              <div>
                <div className="flex justify-between text-xs font-body mb-1">
                  <span className="text-dark/50">Voortgang</span>
                  <span className="font-bold text-primary">{project.progress}%</span>
                </div>
                <div className="w-full bg-secondary/30 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${project.progress}%` }}></div>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <Button size="sm" variant="outline" className="flex-1 text-xs">Status Bijwerken</Button>
                <Button size="sm" className="flex-1 text-xs">Bekijken</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
