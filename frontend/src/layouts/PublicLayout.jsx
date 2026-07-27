import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { HiMenu, HiX, HiPhone, HiMail, HiChevronDown } from 'react-icons/hi';
import { FaWhatsapp, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

export default function PublicLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About Us', children: [
      { to: '/about', label: 'About' },
      { to: '/mission', label: 'Mission & Vision' }
    ]},
    { to: '/workshops', label: 'Workshops' },
    { to: '/services', label: 'Services' },
    { to: '/events', label: 'Events' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/contact', label: 'Contact Us' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col">
    {/* Top Bar */}
{/* Top Bar */}
<div className="bg-gray-900 text-white border-b border-gray-800 hidden md:block">
  <div className="container mx-auto px-4 h-11 flex justify-between items-center text-sm">

    {/* Contact */}
    <div className="flex items-center gap-8">
      <span className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
        <HiPhone className="text" />
        +91 98765 43210
      </span>

      <span className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
        <HiMail className="text" />
        info@wakeupcounseling.com
      </span>
    </div>

    {/* Auth Links */}
    <div className="flex items-center gap-4">
      {user ? (
        <Link
          to="/dashboard"
          className="text-gray-300 hover:text-amber-400 font-medium transition-colors duration-200"
        >
          Dashboard
        </Link>
      ) : (
        <>
          <Link
            to="/login"
            className="text-gray-300 hover:text-amber-400 font-medium transition-colors duration-200"
          >
            Login
          </Link>

          <span className="text-gray-600">|</span>

          <Link
            to="/register"
            className="text-gray-300 hover:text-amber-400 font-medium transition-colors duration-200"
          >
            Register
          </Link>
        </>
      )}
    </div>

  </div>
</div>

      {/* Navigation */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-3">
 <img
  src="/images/logo.png"
  alt="Wake Up Counselling"
  className="w-30 h-16 object-contain"
/>

  <div>
    <h1 className="font-heading font-bold text-xl text-gray-900 leading-none">
     
    </h1>
    <p className="text-sm text-teal-600 leading-none mt-1">
   
    </p>
  </div>
</Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <div key={link.to} className="relative group">
                  {link.children ? (
                    <>
                      <button className="flex items-center gap-1 px-3 py-2 text-gray-700 hover:text-teal-600 font-medium text-sm transition">
                        {link.label} <HiChevronDown className="text-xs" />
                      </button>
                      <div className="absolute top-full left-0 mt-0 w-48 bg-white rounded-lg shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2">
                        {link.children.map((child) => (
                          <Link key={child.to} to={child.to} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600 rounded-lg first:rounded-t-lg last:rounded-b-lg transition">{child.label}</Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link to={link.to} className={`px-3 py-2 font-medium text-sm transition rounded-lg ${isActive(link.to) ? 'text-teal-600 bg-teal-50' : 'text-gray-700 hover:text-teal-600 hover:bg-gray-50'}`}>
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
              {!user && (
                <Link to="/login" className="ml-4 btn-primary text-sm">Login</Link>
              )}
            </div>

            {/* Mobile Toggle */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-gray-700">
              {mobileOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg animate-fade-in">
            <div className="container mx-auto px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <div key={link.to}>
                  {link.children ? (
                    <>
                      <div className="px-3 py-2 text-gray-500 font-medium text-sm uppercase">{link.label}</div>
                      {link.children.map((child) => (
                        <Link key={child.to} to={child.to} className="block px-6 py-2 text-sm text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition">{child.label}</Link>
                      ))}
                    </>
                  ) : (
                    <Link to={link.to} className={`block px-3 py-2.5 font-medium text-sm rounded-lg transition ${isActive(link.to) ? 'text-teal-600 bg-teal-50' : 'text-gray-700 hover:text-teal-600 hover:bg-gray-50'}`}>{link.label}</Link>
                  )}
                </div>
              ))}
              {!user && (
                <div className="pt-3 border-t border-gray-100 flex gap-2">
                  <Link to="/login" className="flex-1 text-center btn-primary text-sm">Login</Link>
                  <Link to="/register" className="flex-1 text-center btn-secondary text-sm">Register</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>
  <footer className="bg-gray-900 text-white">
  <div className="container mx-auto px-4 py-12 max-w-7xl">
    <div className="flex flex-col lg:flex-row justify-between gap-10">

      {/* COLUMN 1: Company Info (Center Aligned + Right Border) */}
      <div className="w-full lg:w-[30%] flex flex-col items-center text-center lg:border-r border-gray-700 pr-0 lg:pr-8">
        
        {/* Logo (White wrapper hata diya gaya hai) */}
        <div className="mb-6 flex justify-center">
          <img
            src="/images/logo.png"
            alt="Wake Up Counselling"
            className="h-20 w-auto object-contain"
          />
        </div>

        <p className="text-gray-400 text-sm leading-6 mb-6">
          Professional counseling services in Jabalpur dedicated to
          mental health awareness, emotional well-being and
          psychological support.
        </p>

        {/* Social Icons */}
        <div className="flex gap-3">
          <a className="w-8 h-8 bg-gray-800 hover:bg-teal-600 rounded-full flex items-center justify-center transition cursor-pointer">
            <FaFacebookF size={13} />
          </a>
          <a className="w-8 h-8 bg-gray-800 hover:bg-teal-600 rounded-full flex items-center justify-center transition cursor-pointer">
            <FaTwitter size={13} />
          </a>
          <a className="w-8 h-8 bg-gray-800 hover:bg-teal-600 rounded-full flex items-center justify-center transition cursor-pointer">
            <FaInstagram size={13} />
          </a>
          <a className="w-8 h-8 bg-gray-800 hover:bg-teal-600 rounded-full flex items-center justify-center transition cursor-pointer">
            <FaLinkedinIn size={13} />
          </a>
        </div>
      </div>

      {/* COLUMN 2 & 3: Links */}
      <div className="w-full lg:w-[35%] flex justify-between sm:justify-around gap-4 px-0 lg:px-4">
        
        {/* Quick Links */}
        <div>
          <h3 className="font-heading font-semibold text-lg mb-5 inline-block border-b-2 border-teal-500 pb-1">
            Quick Links
          </h3>
          <ul className="space-y-3">
            {[
              { to: "/", l: "Home" },
              { to: "/about", l: "About Us" },
              { to: "/workshops", l: "Workshops" },
              { to: "/gallery", l: "Gallery" },
              { to: "/contact", l: "Contact Us" },
            ].map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="text-gray-400 hover:text-teal-400 text-sm transition"
                >
                  {item.l}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Explore */}
        <div>
          <h3 className="font-heading font-semibold text-lg mb-5 inline-block border-b-2 border-teal-500 pb-1">
            Explore
          </h3>
          <ul className="space-y-3">
            {[
              { to: "/services", l: "Services" },
              { to: "/faq", l: "FAQs" },
              { to: "/privacy", l: "Privacy Policy" },
              { to: "/terms", l: "Terms & Conditions" },
            ].map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="text-gray-400 hover:text-teal-400 text-sm transition"
                >
                  {item.l}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* COLUMN 4: Map */}
      <div className="w-full lg:w-[30%]">
        <h3 className="font-heading font-semibold text-lg mb-5 inline-block border-b-2 border-teal-500 pb-1">
          Locate on Map
        </h3>

        <div className="w-full h-48 rounded-lg overflow-hidden border border-gray-800">
          <iframe
            title="location map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14671.8!2d79.9333!3d23.1815!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sJabalpur%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v0000000000"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

    </div>
  </div>

  {/* Bottom Bar */}
  <div className="border-t border-gray-800 bg-gray-950/30">
    <div className="container mx-auto px-4 py-6 flex flex-col items-center justify-center text-center text-sm text-gray-500 gap-1.5">
      <p>© 2025 Wake Up Counselling. All Rights Reserved.</p>
      <p>Professional Mental Health Services</p>
    </div>
  </div>
</footer>

      {/* WhatsApp Button */}
      <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110">
        <FaWhatsapp size={28} className="text-white" />
      </a>
    </div>
  );
}
