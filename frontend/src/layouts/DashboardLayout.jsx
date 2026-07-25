import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';
import { FiHome, FiCalendar, FiUser, FiFileText, FiBell, FiBookOpen, FiMessageSquare, FiLogOut, FiChevronRight } from 'react-icons/fi';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const links = [
    { to: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { to: '/dashboard/bookings', icon: FiCalendar, label: 'My Bookings' },
    { to: '/dashboard/tests', icon: FiFileText, label: 'Psychological Tests' },
    { to: '/dashboard/resources', icon: FiBookOpen, label: 'Resources' },
    { to: '/dashboard/notifications', icon: FiBell, label: 'Notifications' },
    { to: '/dashboard/feedback', icon: FiMessageSquare, label: 'Feedback' },
    { to: '/dashboard/profile', icon: FiUser, label: 'My Profile' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white border-r border-gray-800 transform transition-transform duration-200 ease-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-6 h-16 border-b border-gray-800">
          <span className="font-heading font-bold text-white tracking-tight">Dashboard</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 -mr-1.5 text-gray-400 hover:text-white transition-colors duration-150 rounded-md"
          >
            <HiX size={20} />
          </button>
        </div>

        <div className="px-4 py-6 overflow-y-auto h-[calc(100%-4rem)] pb-32">
          {/* User Card */}
          <div className="flex items-center gap-3 px-3 py-3 mb-6 bg-gray-800 rounded-lg">
            <div className="w-10 h-10 shrink-0 bg-teal-600 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.fullName?.charAt(0)?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-white text-sm truncate leading-tight">
                {user?.fullName}
              </p>
              <p className="text-xs text-gray-400 truncate mt-0.5">{user?.email}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const active = location.pathname === link.to;

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                    active
                      ? 'bg-teal-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon size={18} className="shrink-0" />
                  <span className="truncate">{link.label}</span>

                  {active && (
                    <FiChevronRight size={14} className="ml-auto shrink-0 text-white" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800 bg-gray-900 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-150"
          >
            <FiHome size={18} className="shrink-0" /> Back to Website
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors duration-150 w-full"
          >
            <FiLogOut size={18} className="shrink-0" /> Logout
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden transition-opacity duration-200"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-64 min-w-0">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between gap-3 px-4 lg:px-8 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 text-gray-600 hover:text-gray-900 transition-colors duration-150 rounded-md"
          >
            <HiMenu size={24} />
          </button>
          <h1 className="font-heading font-semibold text-gray-900 truncate">
            Welcome, {user?.fullName?.split(' ')[0]}
          </h1>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/dashboard/bookings/new"
              className="btn-primary text-sm hidden sm:inline-flex items-center transition-transform duration-150 active:scale-[0.98]"
            >
              Book Session
            </Link>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}