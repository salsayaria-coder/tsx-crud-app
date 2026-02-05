import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import type { User } from "./types/User";
import UsersPage from "./pages/UsersPage";
import EditUserPage from "./pages/EditUserPage";

const STORAGE_KEY = "tsx-crud-users";

export default function App() {
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as User[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    } catch {
      // ignore storage errors (rare)
    }
  }, [users]);

  return (
    <Routes>
      <Route path="/" element={<UsersPage users={users} setUsers={setUsers} />} />
      <Route path="/edit/:id" element={<EditUserPage users={users} setUsers={setUsers} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
