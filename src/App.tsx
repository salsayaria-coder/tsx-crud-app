import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import type { User } from "./types/User";
import UsersPage from "./pages/UsersPage";
import EditUserPage from "./pages/EditUserPage";

export default function App() {
  const [users, setUsers] = useState<User[]>([]);

  return (
    <Routes>
      <Route path="/" element={<UsersPage users={users} setUsers={setUsers} />} />
      <Route path="/edit/:id" element={<EditUserPage users={users} setUsers={setUsers} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
