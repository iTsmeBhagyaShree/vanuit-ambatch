import { useState, useRef, useEffect } from 'react';
import { Bell, Search, ChevronDown, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';

function getBreadcrumb(pathname) {
  return pathname.split('/').filter(Boolean).map(p => p.charAt(0).toUpperCase() + p.slice(1));
}

export default function TopNav() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const crumbs = getBreadcrumb(location.pathname);
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfile = () => {
    navigate(`/${user?.role}/profile`);
    setDropdownOpen(false);
  };

  const handleSettings = () => {
    if (user?.role === 'admin') navigate('/admin/settings');
    setDropdownOpen(false);
  };

  return (
    <header className="h-14 bg-[#EDE8DF] border-b border-[#D6CFC2] flex items-center justify-between px-4 lg:px-6 z-10 flex-shrink-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-dark/50 font-body ml-12 lg:ml-0">
        {crumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-dark/25">/</span>}
            <span className={i === crumbs.length - 1 ? 'font-semibold text-dark/80' : 'text-dark/40'}>
              {crumb}
            </span>
          </span>
        ))}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-dark/30" />
          <input
            type="text"
            placeholder="Zoeken..."
            className="pl-8 pr-4 py-2 bg-[#F8F7F4] border border-[#D6CFC2] rounded-full text-xs font-body focus:outline-none focus:ring-2 focus:ring-primary/15 transition-all w-44"
          />
        </div>

        {/* Notifications */}
        <button className="relative text-dark/50 hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-[#D6CFC2]/40">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
        </button>

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 cursor-pointer hover:bg-[#D6CFC2]/40 rounded-lg px-2 py-1.5 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-accent text-[#F2EDE4] flex items-center justify-center text-xs font-bold font-body flex-shrink-0">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-dark font-body leading-none">{user?.name}</p>
              <p className="text-[10px] text-dark/40 capitalize font-body mt-0.5">{user?.role}</p>
            </div>
            <ChevronDown className={`w-3 h-3 text-dark/30 hidden sm:block transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-[#F2EDE4] border border-[#D6CFC2] rounded-xl shadow-card z-50 overflow-hidden">
              {/* User info header */}
              <div className="px-4 py-3 border-b border-[#D6CFC2]">
                <p className="text-sm font-semibold text-dark font-body">{user?.name}</p>
                <p className="text-xs text-dark/40 capitalize font-body">{user?.role}</p>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                <button
                  onClick={handleProfile}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-body text-dark/70 hover:bg-[#D6CFC2]/40 hover:text-primary transition-colors"
                >
                  <User className="w-4 h-4" />
                  Mijn Profiel
                </button>

                {user?.role === 'admin' && (
                  <button
                    onClick={handleSettings}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-body text-dark/70 hover:bg-[#D6CFC2]/40 hover:text-primary transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Instellingen
                  </button>
                )}

                <div className="h-px bg-[#D6CFC2] mx-3 my-1"></div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-body text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Uitloggen
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
