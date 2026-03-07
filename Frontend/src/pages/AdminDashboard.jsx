import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookService } from '../services/bookService';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { BookCopy, Users, BookOpen, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalBooks: 0, totalBorrowedBooks: 0, totalUsers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await bookService.getStats();

        console.log("ADMIN STATS:", data);

        setStats({
          totalBooks: data.analytics?.totalBooks || 0,
          totalBorrowedBooks: data.analytics?.totalBorrows || 0,
          totalUsers: data.analytics?.totalUsers || 0
        });

      } catch (error) {
        toast.error("Failed to load admin statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const statCards = [
    { title: 'Total Books', value: stats.totalBooks, icon: BookOpen, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/40', path: '/admin/books' },
    { title: 'Borrowed Books', value: stats.totalBorrowedBooks, icon: BookCopy, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/40', path: '/admin/borrowed-books' },
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/40', path: '/admin/users' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Overview of the library statistics.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {statCards.map((stat, idx) => (
          <Card 
            key={idx} 
            className="border-none shadow-md shadow-gray-200/50 dark:shadow-none rounded-xl p-6 hover:scale-105 cursor-pointer transition duration-300 hover:shadow-xl bg-white dark:bg-gray-900 dark:border dark:border-gray-800"
            onClick={() => navigate(stat.path)}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 px-0 pt-0">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent className="px-0 pb-0 flex flex-col items-start gap-1 mt-4">
              <div className="text-3xl font-bold dark:text-white">{stat.value}</div>
              <span className="text-xs text-primary dark:text-blue-400 font-medium opacity-80">(click to view details)</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
