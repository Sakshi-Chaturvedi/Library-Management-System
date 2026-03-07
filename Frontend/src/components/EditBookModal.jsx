import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Loader2, UploadCloud, Image as ImageIcon } from 'lucide-react';
import { bookService } from '../services/bookService';
import toast from 'react-hot-toast';

export const EditBookModal = ({ book, isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(book?.coverImage?.url || null);
  const [formData, setFormData] = useState({
    title: book?.title || '',
    author: book?.author || '',
    isbn: book?.isbn || '',
    category: book?.category || '',
    totalCopies: book?.totalCopies || 1,
    coverImage: null
  });

  useEffect(() => {
    if (book && isOpen) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        isbn: book.isbn || '',
        category: book.category || '',
        totalCopies: book.totalCopies || 1,
        coverImage: null
      });
      setPreview(book.coverImage?.url || null);
    }
  }, [book, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, coverImage: file });
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.author || !formData.isbn || !formData.category) {
      return toast.error("Please fill all required fields");
    }

    setLoading(true);
    const form = new FormData();
    form.append('title', formData.title);
    form.append('author', formData.author);
    form.append('isbn', formData.isbn);
    form.append('category', formData.category);
    form.append('totalCopies', formData.totalCopies);
    
    // calculate new available copies by preserving the borrowed ones
    const borrowed = (book.totalCopies || 0) - (book.availableCopies || 0);
    const newAvailable = Math.max(0, parseInt(formData.totalCopies) - borrowed);
    form.append('availableCopies', newAvailable);

    if (formData.coverImage) {
      form.append('coverImage', formData.coverImage);
    }

    try {
      await bookService.updateBook(book._id || book.id, form);
      toast.success('Book updated successfully');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Book</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Author *</Label>
              <Input id="author" name="author" value={formData.author} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="isbn">ISBN *</Label>
              <Input id="isbn" name="isbn" value={formData.isbn} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <select
                name="category"
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 appearance-none"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select category</option>
                <option value="Fiction">Fiction</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="Science">Science</option>
                <option value="History">History</option>
                <option value="Technology">Technology</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Biography">Biography</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2 shadow-sm">
              <Label htmlFor="totalCopies">Total Copies *</Label>
              <Input id="totalCopies" name="totalCopies" type="number" min="1" value={formData.totalCopies} onChange={handleChange} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Cover Image</Label>
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="w-full md:w-2/3 border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors">
                <UploadCloud className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-700">Click to upload new cover image</p>
                <p className="text-xs text-gray-500 mt-1">Leave empty to keep current image</p>
                <Input id="editCoverImage" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                <Button variant="secondary" size="sm" className="mt-4" type="button" onClick={() => document.getElementById('editCoverImage').click()}>
                  Select File
                </Button>
              </div>
              {preview ? (
                <div className="w-full md:w-1/3 h-32 rounded-lg border overflow-hidden flex-shrink-0">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-full md:w-1/3 h-32 rounded-lg border border-dashed flex flex-col items-center justify-center bg-gray-50 text-gray-400 flex-shrink-0">
                  <ImageIcon className="h-4 w-4 mb-2 opacity-50" />
                  <span className="text-xs uppercase font-medium">No Image</span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="px-8">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
