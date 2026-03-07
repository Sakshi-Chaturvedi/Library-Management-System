import React, { useState, useEffect, useCallback } from "react";
import { bookService } from "../services/bookService";
import { Loader2, Users } from "lucide-react";
import { Card } from "../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      // Fetching all users, passing a large limit just to ensure all show up or rely on pagination
      // For simplicity in UI since pagination component isn't strictly requested attached to this table
      const data = await bookService.getAllUsers({ limit: 50 });
      setUsers(data.users || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Unable to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className="space-y-6 mt-10 mb-6 px-6">
      <div className="flex items-center gap-2">
        <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
        <h1 className="text-3xl font-bold tracking-tight dark:text-gray-100">System Users</h1>
      </div>
      <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and view all registered users across the library</p>

      {loading ? (
        <Card className="p-12 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </Card>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 text-center">
          {error}
        </div>
      ) : users.length > 0 ? (
        <Card className="overflow-hidden border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50/50 dark:bg-gray-800/50">
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Total Borrowed Books</TableHead>
                  <TableHead>Account Created Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const createdDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A';

                  return (
                    <TableRow key={user._id || Math.random()} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 border-b dark:border-gray-800">
                      <TableCell className="font-medium text-gray-900 dark:text-gray-100">{user.username || 'Unknown'}</TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">{user.email || 'No email'}</TableCell>
                      <TableCell className="text-gray-900 dark:text-gray-100 font-semibold">{user.totalBorrowedBooks || 0}</TableCell>
                      <TableCell className="text-gray-500 dark:text-gray-400">{createdDate}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </Card>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 mt-10 shadow-sm">
          <Users className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-medium dark:text-gray-200">No users found.</h3>
        </div>
      )}
    </div>
  );
};
