"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getAllUsers, updateUserStatus, deleteUser } from "@/lib/actions/admin";
import { useRequireRole } from "@/lib/hooks/useRequireRole";

export default function ManageUsersPage() {
  const { session, isPending } = useRequireRole("admin");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchUsers();
  }, [session]);

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === "blocked" ? "active" : "blocked";
    setBusyId(user._id);
    try {
      await updateUserStatus(user._id, newStatus);
      setUsers((prev) => prev.map((u) => (u._id === user._id ? { ...u, status: newStatus } : u)));
      toast.success(`User ${newStatus === "blocked" ? "blocked" : "unblocked"}`);
    } catch (err) {
      toast.error("Action failed");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user permanently?")) return;
    setBusyId(id);
    try {
      const res = await deleteUser(id);
      if (res?.deletedCount > 0) {
        setUsers((prev) => prev.filter((u) => u._id !== id));
        toast.success("User deleted");
      } else {
        toast.error("Delete failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setBusyId(null);
    }
  };

  if (isPending) return <div className="min-h-screen bg-[#0d0d0e] text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#0d0d0e] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="border-b border-zinc-800 pb-6 mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Manage Users</h1>
          <p className="text-zinc-400 text-sm mt-1">View and moderate all platform users.</p>
        </div>

        {loading ? (
          <div className="text-zinc-500 text-sm">Loading users...</div>
        ) : (
          <div className="bg-[#121214] border border-zinc-900 rounded-xl overflow-hidden overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-zinc-900/50 text-zinc-400 text-left">
                <tr>
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Email</th>
                  <th className="p-4 font-medium">Role</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-t border-zinc-900">
                    <td className="p-4">{u.name}</td>
                    <td className="p-4 text-zinc-400">{u.email}</td>
                    <td className="p-4 capitalize">{u.role}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded-full border capitalize ${
                        u.status === "blocked" ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-green-500/10 text-green-400 border-green-500/20"
                      }`}>
                        {u.status || "active"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleToggleStatus(u)}
                          disabled={busyId === u._id}
                          className="px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-xs font-medium disabled:opacity-50"
                        >
                          {u.status === "blocked" ? "Unblock" : "Block"}
                        </button>
                        <button
                          onClick={() => handleDelete(u._id)}
                          disabled={busyId === u._id}
                          className="px-3 py-1.5 rounded-md bg-red-600/10 text-red-400 border border-red-600/20 hover:bg-red-600/20 text-xs font-medium disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}