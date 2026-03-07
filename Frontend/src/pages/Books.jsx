import React, { useState, useEffect, useCallback } from "react";
import { bookService } from "../services/bookService";
import { BookCard } from "../components/BookCard";
import { SkeletonBookCard } from "../components/SkeletonBookCard";
import { Pagination } from "../components/Pagination";
import { Input } from "../components/ui/input";
import { Search, Loader2, Library, TrendingUp } from "lucide-react";

export const Books = () => {
  const [books, setBooks] = useState([]);
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [trendingError, setTrendingError] = useState("");
  const [recentBooks, setRecentBooks] = useState([]);
  const [recentLoading, setRecentLoading] = useState(true);
  const [recentError, setRecentError] = useState("");
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [recommendedLoading, setRecommendedLoading] = useState(true);
  const [recommendedError, setRecommendedError] = useState("");
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [category, setCategory] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);

      const params = {
        page: currentPage,
      };

      if (debouncedSearch) {
        params.keyword = debouncedSearch;
      }

      if (category) {
        params.category = category;
      }

      const data = await bookService.getBooks(params);
      console.log("API RESPONSE:", data);

      setBooks(data.books || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch books:", error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, category, currentPage]);

  const fetchTrendingBooks = useCallback(async () => {
    try {
      setTrendingLoading(true);
      setTrendingError("");
      const data = await bookService.getTrendingBooks();
      setTrendingBooks(data.trendingBooks || []);
    } catch (error) {
      console.error("Failed to fetch trending books:", error);
      setTrendingError("Unable to load trending books");
      setTrendingBooks([]);
    } finally {
      setTrendingLoading(false);
    }
  }, []);

  const fetchRecentBooks = useCallback(async () => {
    try {
      setRecentLoading(true);
      setRecentError("");
      const data = await bookService.getRecentBooks();
      setRecentBooks(data.recentBooks || []);
    } catch (error) {
      console.error("Failed to fetch recent books:", error);
      setRecentError("Something went wrong. Please try again.");
      setRecentBooks([]);
    } finally {
      setRecentLoading(false);
    }
  }, []);

  const fetchRecommendedBooks = useCallback(async () => {
    try {
      setRecommendedLoading(true);
      setRecommendedError("");
      const data = await bookService.getRecommendedBooks();
      setRecommendedBooks(data.recommendedBooks || []);
    } catch (error) {
      console.error("Failed to fetch recommended books:", error);
      setRecommendedError("Unable to load recommendations.");
      setRecommendedBooks([]);
    } finally {
      setRecommendedLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  useEffect(() => {
    fetchTrendingBooks();
  }, [fetchTrendingBooks]);

  useEffect(() => {
    fetchRecentBooks();
  }, [fetchRecentBooks]);

  useEffect(() => {
    fetchRecommendedBooks();
  }, [fetchRecommendedBooks]);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Library Catalog
          </h1>
          <p className="text-gray-500 mt-1">
            Discover and borrow books from our collection
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-gray-900 dark:border-gray-800 p-4 rounded-xl shadow-sm border">

        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

          <Input
            type="text"
            placeholder="Search by title or author"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        {/* Category */}
        <select
          className="h-10 rounded-md border px-3 py-2 text-sm bg-white dark:bg-gray-900 dark:border-gray-800 dark:text-gray-100"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All Categories</option>
          <option value="fiction">Fiction</option>
          <option value="programming">Programming</option>
          <option value="self-help">Self Help</option>
          <option value="non-fiction">Non Fiction</option>
          <option value="science">Science</option>
          <option value="history">History</option>
          <option value="technology">Technology</option>
          <option value="fantasy">Fantasy</option>
          <option value="biography">Biography</option>
        </select>

      </div>

      {/* Loading */}
      {loading ? (
        <div className="space-y-8 mt-10 mb-6 px-6">
          {/* Skeleton for Recent & Trending */}
          {!debouncedSearch && !category && currentPage === 1 && (
            <div className="space-y-10">
              {/* Recent Skeletons */}
              <div>
                <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mb-4"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <SkeletonBookCard key={i} />
                  ))}
                </div>
              </div>
              {/* Trending Skeletons */}
              <div>
                <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mb-4"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <SkeletonBookCard key={i} />
                  ))}
                </div>
              </div>
              {/* Recommended Skeletons */}
              <div>
                <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mb-4"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <SkeletonBookCard key={i} />
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* Skeleton for All Books */}
          <div>
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mb-4 mt-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <SkeletonBookCard key={i} />
              ))}
            </div>
          </div>
        </div>
      ) : books.length > 0 ? (
        <div className="mt-10 mb-6 px-6 space-y-12">
          {/* Recent & Trending Books (If not searching/filtering) */}
          {!debouncedSearch && !category && currentPage === 1 && (
            <div className="space-y-12">
              {/* Recently Added Books */}
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  {/* <span className="text-2xl">🆕</span> */}
                  <h2 className="text-2xl font-bold tracking-tight">Recently Added</h2>
                </div>

                {recentLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                      <SkeletonBookCard key={i} />
                    ))}
                  </div>
                ) : recentError ? (
                  <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100">
                    {recentError}
                  </div>
                ) : recentBooks.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {recentBooks.map((book) => (
                      <BookCard
                        key={book._id || book.id}
                        book={book}
                        onBorrowSuccess={() => {
                          fetchBooks();
                          fetchRecentBooks();
                          fetchTrendingBooks();
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-gray-50 rounded-xl border border-gray-100 text-gray-500">
                    No books found
                  </div>
                )}
              </section>

              {/* Trending Books */}
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold tracking-tight">Trending Books</h2>
                </div>

                {trendingLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                      <SkeletonBookCard key={i} />
                    ))}
                  </div>
                ) : trendingError ? (
                  <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100">
                    {trendingError}
                  </div>
                ) : trendingBooks.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {trendingBooks.map((book) => (
                      <BookCard
                        key={book._id || book.id}
                        book={book}
                        onBorrowSuccess={() => {
                          fetchBooks();
                          fetchRecentBooks();
                          fetchTrendingBooks();
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-gray-50 rounded-xl border border-gray-100 text-gray-500">
                    No trending books yet
                  </div>
                )}
              </section>

              {/* Recommended Books */}
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  {/* <span className="text-2xl text-primary">✨</span> */}
                  <h2 className="text-2xl font-bold tracking-tight">Recommended For You</h2>
                </div>

                {recommendedLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                      <SkeletonBookCard key={i} />
                    ))}
                  </div>
                ) : recommendedError ? (
                  <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100">
                    {recommendedError}
                  </div>
                ) : recommendedBooks.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {recommendedBooks.map((book) => (
                      <BookCard
                        key={book._id || book.id}
                        book={book}
                        onBorrowSuccess={() => {
                          fetchBooks();
                          fetchRecentBooks();
                          fetchTrendingBooks();
                          fetchRecommendedBooks();
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-gray-50 rounded-xl border border-gray-100 text-gray-500">
                    No recommendations yet. Borrow books to get personalized suggestions.
                  </div>
                )}
              </section>
            </div>
          )}

          {/* All Books */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">
              {debouncedSearch || category ? "Search Results" : "All Books"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {books.map((book) => (
                <BookCard
                  key={book._id || book.id}
                  book={book}
                  onBorrowSuccess={() => {
                    fetchBooks();
                    fetchRecentBooks();
                    fetchTrendingBooks();
                    fetchRecommendedBooks();
                  }}
                />
              ))}
            </div>
          </section>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border mt-10 mb-6 px-6">

          <Library className="h-12 w-12 text-gray-300 mb-4" />

          <h3 className="text-lg font-medium">
            No books found
          </h3>

          <p className="text-gray-500 mt-1 text-center">
            Try adjusting your search or category filter.
          </p>

        </div>
      )}
    </div>
  );
};