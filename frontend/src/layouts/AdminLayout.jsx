import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { HiMenu } from 'react-icons/hi';
import { FiHome, FiCalendar, FiUsers, FiFileText, FiBookOpen, FiMessageSquare, FiSettings, FiLogOut, FiGrid, FiChevronRight } from 'react-icons/fi';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const links = [
    { to: '/admin', icon: FiGrid, label: 'Dashboard' },
    { to: '/admin/bookings', icon: FiCalendar, label: 'Bookings' },
    { to: '/admin/slots', icon: FiCalendar, label: 'Manage Slots' },
    { to: '/admin/users', icon: FiUsers, label: 'Users' },
    { to: '/admin/blogs', icon: FiFileText, label: 'Blogs' },
    { to: '/admin/content', icon: FiSettings, label: 'Site Content' },
    { to: '/admin/feedback', icon: FiMessageSquare, label: 'Feedback' }
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-3 px-6 h-16 border-b border-gray-800">
          <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="font-heading font-bold text-white">Admin Panel</span>
        </div>
        <div className="px-4 py-6">
          <div className="flex items-center gap-3 px-3 py-3 mb-6 bg-gray-800 rounded-lg">
            <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.fullName?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-white text-sm">{user?.fullName}</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          </div>
          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const active = location.pathname === link.to;
              return (
                <Link key={link.to} to={link.to} onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${active ? 'bg-teal-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                  <Icon size={18} />
                  {link.label}
                  {active && <FiChevronRight size={14} className="ml-auto" />}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition">
            <FiHome size={18} /> View Website
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-900/30 transition w-full">
            <FiLogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 lg:ml-64">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-600"><HiMenu size={24} /></button>
          <h1 className="font-heading font-semibold text-gray-900">Admin Dashboard</h1>
        </header>
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
