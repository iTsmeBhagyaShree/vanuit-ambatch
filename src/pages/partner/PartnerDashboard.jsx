import React from 'react';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { Briefcase, Calendar, CheckCircle, Clock, Upload, FileText, ArrowUpRight } from 'lucide-react';
import { mockProjects, mockRecentActivities } from '../../utils/mockData';
import projectImg from '../../assets/outdoor_project_card.png';
import heroBg from '../../assets/outdoor_kitchen_hero.png';

export default function PartnerDashboard() {
  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden h-40">
        <img src={heroBg} alt="Vanuit Ambacht" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/55 to-transparent"></div>
        <div className="absolute inset-0 flex items-center px-8 gap-6">
          <div className="flex-1">
            <p className="text-white/50 text-xs font-body uppercase tracking-widest mb-1">Partner Portal</p>
            <h2 className="text-2xl font-heading font-bold text-white">Welkom, Sven!</h2>
            <p className="text-white/50 text-sm font-body mt-1">Overzicht van uw opdrachten vandaag.</p>
          </div>
          <div className="hidden sm:flex gap-3">
            <Button className="bg-cream text-primary hover:bg-cream/90 shadow-card" size="sm" icon={Upload}>
              Upload
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Toegewezen Projecten', value: mockProjects.length, icon: Briefcase, color: 'bg-primary/10 text-primary' },
          { label: 'In uitvoering', value: mockProjects.filter(p => p.status === 'In Progress').length, icon: Clock, color: 'bg-accent/10 text-accent' },
          { label: 'Voltooid (totaal)', value: 8, icon: CheckCircle, color: 'bg-green-100 text-green-700' },
        ].map((stat, i) => (
          <Card key={i}>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.color} flex-shrink-0`}>
                <stat.icon className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-xs text-dark/50 font-body font-medium uppercase tracking-wide">{stat.label}</p>
                <p className="text-2xl font-heading font-bold text-dark">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Cards with Images */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-heading font-bold text-primary">Mijn Actieve Projecten</h3>
            <Button variant="ghost" size="sm">
              Alles bekijken <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>

          {mockProjects.map((project, i) => (
            <Card key={project.id} className="overflow-hidden" noPadding>
              <div className="flex">
                {/* Project image thumbnail */}
                <div className="w-28 h-28 flex-shrink-0 hidden sm:block relative overflow-hidden">
                  <img
                    src={projectImg}
                    alt={project.name}
                    className="w-full h-full object-cover"
                    style={{ filter: 'brightness(0.85)' }}
                  />
                </div>
                {/* Project info */}
                <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-sm font-body text-dark truncate">{project.name}</h4>
                      <Badge variant={project.status === 'Completed' ? 'success' : project.status === 'In Progress' ? 'primary' : 'warning'} className="flex-shrink-0">
                        {project.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-dark/50 font-body mt-0.5">Klant: {project.customer}</p>
                    <div className="flex items-center gap-1 text-xs text-dark/40 font-body mt-0.5">
                      <Calendar className="w-3 h-3" />
                      <span>{project.deadline}</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-[11px] font-body mb-1">
                      <span className="text-dark/50">Voortgang</span>
                      <span className="font-bold text-primary">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-secondary/30 rounded-full h-1.5">
                      <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${project.progress}%` }}></div>
                    </div>
                  </div>
                </div>
                {/* Action buttons */}
                <div className="flex flex-col gap-2 p-3 border-l border-cream-dark/40 justify-center">
                  <Button size="sm" variant="outline" className="text-xs">Update</Button>
                  <Button size="sm" className="text-xs">Bekijk</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Schedule */}
          <Card title="Aankomende Planning">
            <div className="space-y-3">
              {[
                { task: 'Site visit – Amsterdam project', date: 'Morgen, 09:00', dot: 'bg-primary' },
                { task: 'Materiaallevering – Rotterdam', date: '25 Nov, 13:00', dot: 'bg-accent' },
                { task: 'Klant review meeting', date: '28 Nov, 10:30', dot: 'bg-secondary' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 p-3 bg-light rounded-lg border border-cream-dark/30">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${item.dot}`}></div>
                  <div>
                    <p className="text-xs text-dark font-body font-medium">{item.task}</p>
                    <p className="text-[11px] text-dark/40 font-body mt-0.5">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Activity */}
          <Card title="Recente Activiteit">
            <div className="space-y-4">
              {mockRecentActivities.slice(0, 4).map((activity, i) => (
                <div key={activity.id} className="relative pl-5">
                  <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-accent/60"></div>
                  <p className="text-xs text-dark font-body">{activity.text}</p>
                  <span className="text-[10px] text-dark/35 font-body">{activity.time}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card title="Snelle Acties">
            <div className="space-y-2">
              {[
                { label: 'Document uploaden', icon: Upload },
                { label: 'Planning bekijken', icon: Calendar },
                { label: 'Rapport inzien', icon: FileText },
              ].map((action, i) => (
                <button key={i} className="flex items-center gap-3 w-full p-3 rounded-lg bg-light border border-cream-dark/40 hover:border-primary/25 hover:bg-cream transition-all text-xs font-body text-dark/70 hover:text-primary">
                  <action.icon className="w-3.5 h-3.5" />
                  {action.label}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
