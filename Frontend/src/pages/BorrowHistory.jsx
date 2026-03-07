import React, { useState, useEffect, useCallback } from "react";
import { bookService } from "../services/bookService";
import { Loader2, Library, BookOpen } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Card } from "../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { useAuth } from "../context/AuthContext";

export const BorrowHistory = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await bookService.getBorrowHistory();
      setHistory(data.history || []);
    } catch (err) {
      console.error("Failed to fetch borrow history:", err);
      setError("Unable to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const getStatusBadge = (record) => {
    const isReturned = record.returned || false;
    const dueDate = record.dueDate ? new Date(record.dueDate) : null;
    const isOverdue = !isReturned && dueDate && dueDate < new Date();

    if (isReturned) {
      return <Badge className="bg-green-100 text-green-800 border-green-200">Returned</Badge>;
    }
    if (isOverdue) {
      return <Badge className="bg-red-100 text-red-800 border-red-200 animate-pulse">Overdue</Badge>;
    }
    return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Active</Badge>;
  };

  return (
    <div className="space-y-6 mt-10 mb-6 px-6">
      <div className="flex items-center gap-2">
        {/* <BookOpen className="h-8 w-8 text-primary" /> */}
        <h1 className="text-3xl font-bold tracking-tight dark:text-gray-100">Borrow History</h1>
      </div>
      <p className="text-gray-500 dark:text-gray-400 mt-1">Review your past and current borrowed books</p>

      {loading ? (
        <Card className="p-12 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </Card>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 text-center">
          {error}
        </div>
      ) : history.length > 0 ? (
        <Card className="overflow-hidden border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50/50 dark:bg-gray-800/50">
                <TableRow>
                  {isAdmin && <TableHead>User</TableHead>}
                  <TableHead className="w-[100px]">Cover</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Borrowed Date</TableHead>
                  <TableHead>Return Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((record) => {
                  const book = record.book || {};
                  const userRecord = record.user || {};
                  const borrowDate = record.borrowDate ? new Date(record.borrowDate).toLocaleDateString() : 'N/A';
                  const returnDate = record.returnDate ? new Date(record.returnDate).toLocaleDateString() : '---';

                  return (
                    <TableRow key={record._id || Math.random()} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 border-b dark:border-gray-800">
                      {isAdmin && (
                        <TableCell>
                          <div className="font-medium text-gray-900 dark:text-gray-100">{userRecord.username || userRecord.name || 'Unknown'}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{userRecord.email || 'No email'}</div>
                        </TableCell>
                      )}
                      <TableCell>
                        <div className="h-16 w-12 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden flex items-center justify-center">
                          {book.coverImage ? (
                            <img src={book.coverImage.url} alt={book.title} className="h-full w-full object-cover" />
                          ) : (
                            <Library className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-gray-900 dark:text-gray-100">{book.title || 'Unknown Book'}</TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">{borrowDate}</TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">{returnDate}</TableCell>
                      <TableCell>{getStatusBadge(record)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </Card>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 mt-10 shadow-sm">
          <Library className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-medium dark:text-gray-200">You haven't borrowed any books yet.</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-center">Explore the library catalog to find your next great read!</p>
        </div>
      )}
    </div>
  );
};
