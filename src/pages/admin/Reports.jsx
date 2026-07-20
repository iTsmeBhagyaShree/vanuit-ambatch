import Card from '../../components/Card';
import Button from '../../components/Button';
import { Download, TrendingUp, Briefcase, Users } from 'lucide-react';

export default function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-primary">Reports</h2>
          <p className="text-dark/60 text-sm">Business performance reports and analytics.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" icon={Download} size="sm">Download PDF</Button>
          <Button variant="outline" icon={Download} size="sm">Export Excel</Button>
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: 'Revenue Report', icon: TrendingUp, desc: 'Monthly and yearly revenue trends', color: 'bg-green-50 text-green-600' },
          { title: 'Projects Report', icon: Briefcase, desc: 'Project completion and progress stats', color: 'bg-primary/10 text-primary' },
          { title: 'Lead Conversion', icon: Users, desc: 'Lead to project conversion rate', color: 'bg-blue-50 text-blue-600' },
        ].map((report, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow cursor-pointer group">
            <div className={`p-3 rounded-xl ${report.color} inline-block mb-4`}>
              <report.icon className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-semibold text-dark group-hover:text-primary transition-colors">{report.title}</h3>
            <p className="text-sm text-dark/60 mt-1">{report.desc}</p>
            <Button variant="ghost" size="sm" className="mt-4 px-0 text-primary">View Report →</Button>
          </Card>
        ))}
      </div>

      {/* Lead Conversion Chart */}
      <Card title="Lead Conversion Funnel">
        <div className="space-y-4">
          {[
            { stage: 'Total Inquiries', count: 220, pct: 100, color: 'bg-blue-400' },
            { stage: 'Leads Created', count: 142, pct: 65, color: 'bg-primary/80' },
            { stage: 'Quotes Sent', count: 80, pct: 36, color: 'bg-accent' },
            { stage: 'Projects Started', count: 52, pct: 24, color: 'bg-green-500' },
            { stage: 'Completed', count: 48, pct: 22, color: 'bg-green-600' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="text-sm text-dark/70 w-36 flex-shrink-0">{item.stage}</span>
              <div className="flex-1 bg-secondary/20 rounded-full h-6 relative overflow-hidden">
                <div className={`h-full ${item.color} rounded-full transition-all flex items-center justify-end pr-3`} style={{ width: `${item.pct}%` }}>
                  <span className="text-white text-xs font-bold">{item.count}</span>
                </div>
              </div>
              <span className="text-sm text-dark/50 w-10 text-right">{item.pct}%</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Monthly Performance */}
      <Card title="Monthly Revenue Performance">
        <div className="flex items-end justify-between gap-2 h-40">
          {[
            { month: 'Jan', val: 32000 }, { month: 'Feb', val: 41000 }, { month: 'Mar', val: 38000 },
            { month: 'Apr', val: 55000 }, { month: 'May', val: 48000 }, { month: 'Jun', val: 62000 },
            { month: 'Jul', val: 58000 }, { month: 'Aug', val: 71000 }, { month: 'Sep', val: 65000 },
            { month: 'Oct', val: 78000 }, { month: 'Nov', val: 69000 }, { month: 'Dec', val: 90000 },
          ].map((item, i) => {
            const maxVal = 90000;
            const pct = (item.val / maxVal) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-primary hover:bg-accent transition-colors rounded-t-sm" style={{ height: `${pct}%` }}></div>
                <span className="text-xs text-dark/50">{item.month}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
