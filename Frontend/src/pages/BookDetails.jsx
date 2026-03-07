import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookService } from '../services/bookService';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Book, Loader2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [borrowLoading, setBorrowLoading] = useState(false);

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      const data = await bookService.getBook(id);
      setBook(data.book);
    } catch (error) {
      toast.error('Failed to load book details');
      navigate('/books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookDetails();
  }, [id]);

  const handleBorrow = async () => {
    setBorrowLoading(true);
    try {
      await bookService.borrowBook(book._id || book.id);
      toast.success('Book borrowed successfully!');
      fetchBookDetails(); // Refresh book details to get updated copies
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to borrow book');
    } finally {
      setBorrowLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!book) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border dark:border-gray-800 p-6 md:p-8 flex flex-col md:flex-row gap-8">
        {/* Cover Image */}
        <div className="w-full md:w-1/3 flex-shrink-0">
          <div className="aspect-[2/3] bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden shadow-md">
            {book.coverImage ? (
              <img
                src={book.coverImage.url}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <Book className="h-24 w-24 text-gray-300" />
            )}
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col flex-grow">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary" className="text-sm">
              {book.category}
            </Badge>
            {book.availableCopies === 0 ? (
              <Badge variant="destructive" className="text-sm">Out of Stock</Badge>
            ) : book.availableCopies <= 3 ? (
              <Badge className="bg-yellow-500 hover:bg-yellow-600 text-sm border-transparent">
                Only {book.availableCopies} left
              </Badge>
            ) : (
              <Badge className="bg-green-500 hover:bg-green-600 text-sm border-transparent">
                Available
              </Badge>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {book.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 font-medium mb-6">
            By {book.author}
          </p>

          <div className="space-y-4 text-gray-700 dark:text-gray-300 mt-auto">
            <div className="flex justify-between py-2 border-b dark:border-gray-800">
              <span className="font-semibold">ISBN</span>
              <span>{book.isbn}</span>
            </div>
            <div className="flex justify-between py-2 border-b dark:border-gray-800">
              <span className="font-semibold">Total Copies</span>
              <span>{book.totalCopies}</span>
            </div>
            <div className="flex justify-between py-2 border-b dark:border-gray-800">
              <span className="font-semibold">Available Copies</span>
              <span className={book.availableCopies > 0 ? 'text-green-600 font-bold' : 'text-red-500 font-bold'}>
                {book.availableCopies}
              </span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t dark:border-gray-800">
            <Button
              size="lg"
              className="w-full md:w-auto px-8"
              onClick={handleBorrow}
              disabled={book.availableCopies === 0 || borrowLoading}
            >
              {borrowLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              {book.availableCopies === 0 ? 'Currently Unavailable' : 'Borrow Book'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
