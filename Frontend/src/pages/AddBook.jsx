import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookService } from '../services/bookService';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent } from '../components/ui/card';
import { Loader2, UploadCloud, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export const AddBook = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '', author: '', isbn: '', category: '', copies: 1, coverImage: null
  });

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
    form.append('availableCopies', formData.totalCopies);
    if (formData.coverImage) {
      form.append('coverImage', formData.coverImage);
    }

    try {
      await bookService.addBook(form);
      toast.success('Book added successfully');
      navigate('/books');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Add New Book</h1>
        <p className="text-gray-500 mt-1">Add a new book to the library catalog.</p>
      </div>

      <Card className="border-gray-100 shadow-sm">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                <Input id="totalCopies" name="totalCopies" type="number" min="1" value={formData.totalCopies
                } onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Cover Image</Label>
              <div className="flex flex-col md:flex-row gap-4 items-start">
                <div className="w-full md:w-2/3 border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors">
                  <UploadCloud className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-700">Click to upload cover image</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG up to 5MB</p>
                  <Input id="coverImage" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  <Button variant="secondary" size="sm" className="mt-4" type="button" onClick={() => document.getElementById('coverImage').click()}>
                    Select File
                  </Button>
                </div>
                {preview ? (
                  <div className="w-full md:w-1/3 h-48 rounded-lg border overflow-hidden flex-shrink-0">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-full md:w-1/3 h-48 rounded-lg border border-dashed flex flex-col items-center justify-center bg-gray-50 text-gray-400 flex-shrink-0">
                    <ImageIcon className="h-8 w-8 mb-2 opacity-50" />
                    <span className="text-xs uppercase font-medium">No Preview</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" disabled={loading} className="w-full md:w-auto px-8">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Book
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
