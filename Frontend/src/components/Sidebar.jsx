import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, Bookmark, LayoutDashboard, PlusCircle, History } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

export const Sidebar = () => {
  const { user } = useAuth();

  if (!user) return null;

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
    <aside className="w-64 border-r dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900 hidden md:block min-h-[calc(100vh-4rem)] p-4 transition-colors duration-200">
      <div className="space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
              isActive 
                ? "bg-primary text-primary-foreground dark:bg-blue-600 dark:text-white shadow-sm" 
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </div>
    </aside>
  );
};
