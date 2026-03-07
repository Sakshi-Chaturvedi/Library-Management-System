import React, { useState, useEffect, useCallback } from "react";
import { bookService } from "../services/bookService";
import { Loader2, BookOpen, Edit2, Trash2 } from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { EditBookModal } from "../components/EditBookModal";
import toast from "react-hot-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

export const AdminBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await bookService.getBooks({ limit: 100 });
      setBooks(data.books || []);
    } catch (err) {
      console.error("Failed to fetch books:", err);
      setError("Unable to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleEditClick = (book) => {
    setSelectedBook(book);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    
    setDeleteLoadingId(id);
    try {
      await bookService.deleteBook(id);
      toast.success("Book deleted successfully!");
      fetchBooks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete book");
    } finally {
      setDeleteLoadingId(null);
    }
  };

  return (
    <div className="space-y-6 mt-10 mb-6 px-6">
      <div className="flex items-center gap-2">
        <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        <h1 className="text-3xl font-bold tracking-tight dark:text-gray-100">Library Catalog</h1>
      </div>
      <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and view all books within the system</p>

      {loading ? (
        <Card className="p-12 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </Card>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 text-center">
          {error}
        </div>
      ) : books.length > 0 ? (
        <Card className="overflow-hidden border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50/50 dark:bg-gray-800/50">
                <TableRow>
                  <TableHead className="w-[80px]">Cover</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-center">Available</TableHead>
                  <TableHead className="text-center">Borrows</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {books.map((book) => {
                  const id = book._id || book.id;
                  const isDeleting = deleteLoadingId === id;

                  return (
                    <TableRow key={id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 border-b dark:border-gray-800">
                      <TableCell>
                        <div className="h-12 w-9 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden flex items-center justify-center">
                          {book.coverImage ? (
                            <img src={book.coverImage.url} alt={book.title} className="h-full w-full object-cover" />
                          ) : (
                            <BookOpen className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-gray-900 dark:text-gray-100 line-clamp-2 leading-tight max-w-[200px] mt-2 border-0">{book.title}</TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">{book.author}</TableCell>
                      <TableCell className="text-gray-500 dark:text-gray-400 text-sm whitespace-nowrap">{book.category}</TableCell>
                      <TableCell className="text-center font-medium">
                        <span className={book.availableCopies === 0 ? "text-red-500 dark:text-red-400" : "text-green-600 dark:text-green-400"}>
                          {book.availableCopies}
                        </span>
                      </TableCell>
                      <TableCell className="text-center text-gray-500 dark:text-gray-400">{book.borrowCount || 0}</TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <Button variant="ghost" size="sm" onClick={() => handleEditClick(book)} className="mr-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                            <Edit2 className="w-4 h-4 mr-1" /> Edit
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(id)} disabled={isDeleting} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                            {isDeleting ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <><Trash2 className="w-4 h-4 mr-1" /> Delete</>}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </Card>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 mt-10 shadow-sm">
          <BookOpen className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-medium dark:text-gray-200">No books found.</h3>
        </div>
      )}

      {selectedBook && (
        <EditBookModal 
          book={selectedBook} 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
          onSuccess={fetchBooks} 
        />
      )}
    </div>
  );
};
