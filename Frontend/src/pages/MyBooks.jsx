import React, { useState, useEffect } from 'react';
import { bookService } from '../services/bookService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Bookmark, Loader2, Undo2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const MyBooks = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState(null);

  const fetchBorrowed = async () => {
    setLoading(true);
    try {
      const data = await bookService.getBorrowedBooks();
      setBorrowedBooks(Array.isArray(data) ? data : data.borrows || data.borrowedBooks || []);
    } catch (error) {
      console.error("Failed to fetch borrowed books", error);
      toast.error('Could not load borrowed books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrowed();
  }, []);

  const handleReturn = async (id) => {
    setReturningId(id);
    try {
      await bookService.returnBook(id);
      toast.success('Book returned successfully!');
      fetchBorrowed();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to return book');
    } finally {
      setReturningId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">My Borrowed Books</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage the books you are currently reading.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : borrowedBooks.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50/50 dark:bg-gray-800/50">
                <TableRow>
                  <TableHead>Book Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Borrow Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Fine</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {borrowedBooks.map((record) => {
                  const book = record.book || record; // Fallback structure depending on backend API
                  const borrowDate = record.borrowDate ? new Date(record.borrowDate).toLocaleDateString() : 'N/A';
                  const dueDate = record.dueDate ? new Date(record.dueDate) : null;
                  const isReturned = record.returned || false;
                  
                  // Calculate if overdue
                  const isOverdue = !isReturned && dueDate && dueDate < new Date();
                  const status = isReturned ? 'Returned' : (isOverdue ? 'Overdue' : 'Borrowed');
                  const fine = record.fine || 0;

                  return (
                    <TableRow key={record._id || record.id} className={isOverdue ? "bg-red-50/50 hover:bg-red-50 dark:bg-red-900/10 dark:hover:bg-red-900/20 transition-colors" : "hover:bg-gray-50/50 dark:hover:bg-gray-800/50 border-b dark:border-gray-800"}>
                      <TableCell className="font-medium dark:text-gray-100">{book.title}</TableCell>
                      <TableCell className="dark:text-gray-300">{book.author}</TableCell>
                      <TableCell className="dark:text-gray-300">{borrowDate}</TableCell>
                      <TableCell className="dark:text-gray-300">{dueDate ? dueDate.toLocaleDateString() : 'N/A'}</TableCell>
                      <TableCell>
                        <Badge 
                           variant={isReturned ? "secondary" : (isOverdue ? "destructive" : "default")}
                           className={isOverdue ? "animate-pulse" : ""}
                        >
                          {status}
                        </Badge>
                      </TableCell>
                      <TableCell className={fine > 0 ? "text-red-600 font-medium" : "text-gray-500"}>
                        ${fine.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        {!isReturned && (
                          <Button 
                            variant={isOverdue ? "destructive" : "outline"}
                            size="sm" 
                            onClick={() => handleReturn(record._id || record.id)}
                            disabled={returningId === (record._id || record.id)}
                            className="transition-all duration-200"
                          >
                            {returningId === (record._id || record.id) ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Undo2 className="h-4 w-4 mr-2" />
                            )}
                            Return
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 py-20 text-center">
            <Bookmark className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No borrowed books</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-sm">You haven&apos;t borrowed any books yet. Go to the Catalog to find something interesting!</p>
          </div>
        )}
      </div>
    </div>
  );
};
