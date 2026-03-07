import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Book, Loader2, Edit2, Trash2 } from 'lucide-react';
import { bookService } from '../services/bookService';
import { useAuth } from '../context/AuthContext';
import { EditBookModal } from './EditBookModal';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const BookCard = ({ book, onBorrowSuccess, onActionSuccess }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleBorrow = async (e) => {
    e.stopPropagation();
    setLoading(true);
    try {
      await bookService.borrowBook(book._id || book.id);
      toast.success('Book borrowed successfully!');
      if (onBorrowSuccess) onBorrowSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to borrow book');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    setDeleteLoading(true);
    try {
      await bookService.deleteBook(book._id || book.id);
      toast.success('Book deleted successfully!');
      if (onActionSuccess) onActionSuccess();
      else if (onBorrowSuccess) onBorrowSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete book');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    if (onActionSuccess) onActionSuccess();
    else if (onBorrowSuccess) onBorrowSuccess();
  };

  const handleCardClick = () => {
    navigate(`/book/${book._id || book.id}`);
  };

  const getCategoryColor = (category) => {
    const map = {
      'Programming': 'bg-purple-100 text-purple-800 border-purple-200',
      'Self Help': 'bg-blue-100 text-blue-800 border-blue-200',
      'Fiction': 'bg-green-100 text-green-800 border-green-200',
      'Business': 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    return map[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden group hover:-translate-y-1.5 transition-all duration-300 shadow-sm hover:shadow-xl border-gray-100/80 dark:border-gray-800/50 bg-white dark:bg-gray-900 rounded-xl"
      onClick={handleCardClick}
    >
      <div className="relative h-44 overflow-hidden bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center">

        {/* Availability Badge */}
        <div className="absolute top-3 right-3 z-10">
          {book.availableCopies === 0 ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 shadow-sm border border-red-200 dark:border-red-800">
              Out of Stock
            </span>
          ) : book.availableCopies <= 2 ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 shadow-sm border border-yellow-200 dark:border-yellow-800">
              Only {book.availableCopies} Left
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 shadow-sm border border-green-200 dark:border-green-800">
              Available
            </span>
          )}
        </div>

        {book.coverImage?.url ? (
          <img src={book.coverImage.url} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
        ) : (
          <Book className="h-12 w-12 text-gray-300 dark:text-gray-600" />
        )}

        {/* Overlay for hover effect */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <Button
            onClick={handleCardClick}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-6 py-3 text-lg"
            variant="secondary"
          >
            View Details
          </Button>
        </div>
      </div>
      <CardHeader className="flex-none p-4 pb-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <Badge variant="outline" className={`flex-shrink-0 text-xs ${getCategoryColor(book.category)}`}>
            {book.category || 'General'}
          </Badge>
        </div>

        <CardTitle className="line-clamp-2 text-lg font-bold leading-tight group-hover:text-primary transition-colors dark:text-gray-100">
          {book.title}
        </CardTitle>
        <CardDescription className="text-gray-500 font-medium dark:text-gray-400">
          {book.author}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow p-4 pt-0 mb-[-4px]">
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Available: <span className="font-semibold text-gray-900 dark:text-gray-100">{book.availableCopies}</span></p>
      </CardContent>
      <CardFooter className="p-4 pt-3 mt-auto flex flex-col gap-2 border-t border-gray-50 dark:border-gray-800/50 bg-gray-50/30 dark:bg-gray-800/20">
        <Button
          onClick={handleBorrow}
          disabled={book.availableCopies === 0 || loading}
          className="w-full transition-all duration-300 rounded-lg shadow-sm font-medium"
        >
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Borrow'}
        </Button>
        {user?.role === 'admin' && (
          <div className="flex gap-2 w-full mt-2">
            <Button variant="outline" size="sm" className="flex-1 rounded-lg" onClick={handleEditClick}>
              <Edit2 className="w-4 h-4 mr-1.5" /> Edit
            </Button>
            <Button variant="destructive" size="sm" className="flex-1 rounded-lg hover:bg-red-600" onClick={handleDelete} disabled={deleteLoading}>
              {deleteLoading ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <><Trash2 className="w-4 h-4 mr-1.5" /> Delete</>}
            </Button>
          </div>
        )}
      </CardFooter>
      <EditBookModal
        book={book}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleEditSuccess}
      />
    </Card>
  );
};
