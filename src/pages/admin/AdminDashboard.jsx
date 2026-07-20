import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { Users, Briefcase, FileText, TrendingUp, Plus, ArrowUpRight } from 'lucide-react';
import { mockRecentActivities, mockProjects, mockQuotes } from '../../utils/mockData';
import heroBg from '../../assets/outdoor_kitchen_hero.png';

const StatCard = ({ label, value, icon: Icon, trend, color, bgColor }) => (
  <Card>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs text-dark/50 font-body font-medium uppercase tracking-wide">{label}</p>
        <p className="text-3xl font-heading font-bold text-dark mt-2">{value}</p>
        {trend && (
          <p className="text-xs text-green-700 mt-2 flex items-center gap-1 font-body">
            <ArrowUpRight className="w-3 h-3" />
            {trend}
          </p>
        )}
      </div>
      <div className={`p-3 rounded-xl ${bgColor}`}>
        <Icon className={`w-5 h-5 ${color}`} strokeWidth={1.5} />
      </div>
    </div>
  </Card>
);

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Hero Banner with brand image */}
      <div className="relative rounded-2xl overflow-hidden h-44">
        <img src={heroBg} alt="Vanuit Ambacht" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/60 to-transparent"></div>
        <div className="absolute inset-0 flex items-center justify-between px-8">
          <div>
            <p className="text-white/60 text-xs font-body tracking-widest uppercase mb-1">Welkom terug</p>
            <h2 className="text-3xl font-heading font-bold text-white">Admin Dashboard</h2>
            <p className="text-white/60 text-sm font-body mt-1">Overzicht van uw bedrijfsactiviteiten</p>
          </div>
          <div className="hidden sm:flex gap-3">
            <Button icon={Plus} className="bg-cream text-primary hover:bg-cream/90 shadow-card" size="sm">
              New Lead
            </Button>
            <Button icon={Plus} className="bg-white/15 text-white border border-white/20 hover:bg-white/25" size="sm">
              New Quote
            </Button>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Leads" value="142" icon={Users} trend="+12% this month" color="text-primary" bgColor="bg-primary/10" />
        <StatCard label="Active Quotes" value="56" icon={FileText} trend="+8% this month" color="text-accent" bgColor="bg-accent/10" />
        <StatCard label="Active Projects" value="12" icon={Briefcase} trend="3 due soon" color="text-dark/70" bgColor="bg-secondary/40" />
        <StatCard label="Monthly Revenue" value="€ 45k" icon={TrendingUp} trend="+23% vs last month" color="text-green-700" bgColor="bg-green-100" />
      </div>

      {/* Business Pipeline */}
      <Card title="Business Pipeline">
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'New Leads', count: 18, color: 'bg-blue-100 text-blue-800 border border-blue-200' },
            { label: 'Contacted', count: 34, color: 'bg-secondary/40 text-dark border border-secondary' },
            { label: 'Quotes Sent', count: 22, color: 'bg-accent/10 text-accent border border-accent/30' },
            { label: 'Projects Active', count: 12, color: 'bg-primary/10 text-primary border border-primary/20' },
            { label: 'Invoiced', count: 8, color: 'bg-yellow-100 text-yellow-800 border border-yellow-200' },
            { label: 'Completed', count: 48, color: 'bg-green-100 text-green-800 border border-green-200' },
          ].map((item, i) => (
            <div key={i} className={`px-4 py-3 rounded-xl flex items-center gap-3 ${item.color}`}>
              <span className="text-xl font-heading font-bold">{item.count}</span>
              <span className="text-xs font-medium font-body">{item.label}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Projects + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2">
          <Card title="Recent Projects" action={<Button variant="ghost" size="sm">View All</Button>}>
            <div className="space-y-3">
              {mockProjects.map(project => (
                <div key={project.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl bg-light border border-cream-dark/40 hover:border-primary/20 transition-all">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold font-body text-dark text-sm truncate">{project.name}</h4>
                    </div>
                    <p className="text-xs text-dark/50 font-body">{project.customer} · {project.partner}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 bg-secondary/30 rounded-full h-1.5">
                        <div className="bg-primary h-1.5 rounded-full" style={{ width: `${project.progress}%` }}></div>
                      </div>
                      <span className="text-[11px] text-dark/50 font-body w-8 text-right">{project.progress}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant={project.status === 'Completed' ? 'success' : project.status === 'In Progress' ? 'primary' : 'warning'}>
                      {project.status}
                    </Badge>
                    <span className="text-[11px] text-dark/40 font-body hidden sm:block">{project.deadline}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Activity + Quotes */}
        <div className="space-y-5">
          <Card title="Recent Activity">
            <div className="space-y-5">
              {mockRecentActivities.map((a, i) => (
                <div key={a.id} className="relative pl-5">
                  <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-accent"></div>
                  {i < mockRecentActivities.length - 1 && (
                    <div className="absolute left-[3px] top-4 bottom-[-16px] w-px bg-cream-dark/60"></div>
                  )}
                  <p className="text-xs text-dark font-body leading-snug">{a.text}</p>
                  <span className="text-[10px] text-dark/35 font-body mt-0.5 block">{a.time}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Latest Quotes">
            <div className="space-y-3">
              {mockQuotes.slice(0, 3).map(q => (
                <div key={q.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-dark font-body">{q.customer}</p>
                    <p className="text-xs text-dark/40 font-body">{q.amount}</p>
                  </div>
                  <Badge variant={q.status === 'Paid' ? 'success' : q.status === 'Accepted' ? 'primary' : 'default'}>
                    {q.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
