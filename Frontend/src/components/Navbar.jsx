import React, { useState, useEffect } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Library, LogOut, User, Moon, Sun, Menu, X, BookOpen, Bookmark, History, LayoutDashboard, PlusCircle } from 'lucide-react';

// Custom utility if cn is needed, but we can just use normal template literals
const cn = (...classes) => classes.filter(Boolean).join(' ');

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        return savedTheme === "dark";
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const isAdmin = user?.role === 'admin';

  const navItems = [
    { label: 'Books', path: '/books', icon: BookOpen },
    { label: 'My Books', path: '/my-books', icon: Bookmark },
    { label: 'Borrow History', path: '/borrow-history', icon: History },
    ...(isAdmin ? [
      { label: 'Admin Dashboard', path: '/admin', icon: LayoutDashboard },
      { label: 'Add Book', path: '/admin/add-book', icon: PlusCircle }
    ] : [])
  ];

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-200">
      <nav className="h-16 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2 text-primary dark:text-blue-400 font-bold text-xl">
          <Library className="h-6 w-6" />
          <Link to="/">LMS Dashboard</Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDarkMode(!darkMode)}
            className="text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-full w-9 h-9 flex items-center justify-center p-0 transition-colors"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
          {!user ? (
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" asChild><Link to="/login">Login</Link></Button>
              <Button asChild><Link to="/register">Register</Link></Button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                <span className="h-8 w-8 rounded-full bg-primary/10 dark:bg-blue-900/40 flex items-center justify-center text-primary dark:text-blue-400">
                  <User size={16} />
                </span>
                <span className="hidden sm:inline-block">{user.username || user.email}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:hover:bg-red-900/20 dark:text-red-400">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          {user && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden text-gray-700 dark:text-gray-200" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          )}

          {!user && (
            <div className="sm:hidden flex items-center gap-2">
               <Link to="/login" className="text-sm font-medium text-gray-700 dark:text-gray-200 p-2">Login</Link>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && user && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-lg absolute w-full max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="flex items-center gap-3 mb-4 p-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
            <span className="h-10 w-10 rounded-full bg-primary/10 dark:bg-blue-900/40 flex items-center justify-center text-primary dark:text-blue-400">
              <User size={20} />
            </span>
            <div className="flex flex-col">
               <span className="font-semibold">{user.username || user.email || 'User'}</span>
               <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role}</span>
            </div>
          </div>
          <div className="space-y-1 mb-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all",
                  isActive 
                    ? "bg-primary text-white dark:bg-blue-600 shadow-sm" 
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            ))}
          </div>
          <Button variant="outline" className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-900/20 dark:text-red-400" onClick={handleLogout}>
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      )}
    </header>
  );
};

