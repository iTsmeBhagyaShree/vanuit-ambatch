import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  LayoutDashboard, Users, FileText, Briefcase, UserSquare,
  Folder, PieChart, Settings, Calendar, LogOut, X, Menu, ChevronRight
} from 'lucide-react';
import VanuitLogo from '../assets/VanuitLogo';

const ADMIN_LINKS = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Leads', path: '/admin/leads', icon: Users },
  { name: 'Quotes', path: '/admin/quotes', icon: FileText },
  { name: 'Projects', path: '/admin/projects', icon: Briefcase },
  { name: 'Partners', path: '/admin/partners', icon: UserSquare },
  { name: 'Documents', path: '/admin/documents', icon: Folder },
  { name: 'Finance', path: '/admin/finance', icon: PieChart },
  { name: 'Reports', path: '/admin/reports', icon: FileText },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
];

const PARTNER_LINKS = [
  { name: 'Dashboard', path: '/partner/dashboard', icon: LayoutDashboard },
  { name: 'My Projects', path: '/partner/projects', icon: Briefcase },
  { name: 'Planning', path: '/partner/planning', icon: Calendar },
  { name: 'Documents', path: '/partner/documents', icon: Folder },
  { name: 'Profile', path: '/partner/profile', icon: UserSquare },
];

export default function Sidebar({ role }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = role === 'admin' ? ADMIN_LINKS : PARTNER_LINKS;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo Area */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg border border-white/30 flex items-center justify-center flex-shrink-0">
            <VanuitLogo size={20} className="text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-baseline gap-1">
              <span className="font-body font-light text-white/60 text-xs tracking-[0.18em] uppercase">Vanuit</span>
              <span className="font-heading font-bold text-white text-sm tracking-[0.12em] uppercase">Ambacht</span>
            </div>
            <p className="text-white/40 text-[10px] tracking-wider capitalize font-body">{role} portal</p>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 ${
                  isActive
                    ? 'bg-white/15 text-white'
                    : 'text-white/60 hover:bg-white/8 hover:text-white/90'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={isActive ? 2 : 1.5} />
                  <span className={`text-sm font-body ${isActive ? 'font-medium' : 'font-normal'}`}>{link.name}</span>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-50" />}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="p-3 border-t border-white/10 space-y-1">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0 text-white text-xs font-bold font-body">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-white font-body truncate">{user?.name}</p>
            <p className="text-xs text-white/40 capitalize font-body">{role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-white/50 hover:bg-red-500/15 hover:text-red-300 transition-colors text-sm font-body"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex w-60 bg-primary flex-col flex-shrink-0 shadow-lg">
        <SidebarContent />
      </aside>

      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-white shadow-card"
      >
        <Menu className="w-4 h-4" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/40 z-40" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile drawer */}
      <aside className={`lg:hidden fixed inset-y-0 left-0 w-64 bg-primary z-50 flex flex-col shadow-2xl transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 text-white/50 hover:text-white">
          <X className="w-4 h-4" />
        </button>
        <SidebarContent />
      </aside>
    </>
  );
}
