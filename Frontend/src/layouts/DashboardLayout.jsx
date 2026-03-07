import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';

export const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50/30 dark:bg-gray-950 dark:text-gray-100 font-sans transition-colors duration-200">
      <Navbar />
      <div className="flex items-start">
        <Sidebar />
        <main className="flex-1 p-6 sm:p-8">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
