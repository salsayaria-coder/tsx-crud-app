import { useState } from "react";
import type { User } from "./types/User";



export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<Omit<User, "id">>({
    name: "",
    email: "",
    phone: "",
    status: "",
    role: "",
  });
  const [editId, setEditId] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = () => {
    if (editId === null) {
      setUsers([...users, { id: Date.now(), ...form }]);
    } else {
      setUsers(users.map(u => (u.id === editId ? { id: editId, ...form } : u)));
      setEditId(null);
    }
    setForm({ name: "", email: "", phone: "", status: "", role: "" });
  };

  const edit = (u: User) => {
    setEditId(u.id);
    const { id, ...rest } = u;
    setForm(rest);
  };

  const remove = (id: number) => {
    setUsers(users.filter(u => u.id !== id));
  };

  return (
    <div style={{ maxWidth: 700, margin: "40px auto" }}>
      <h2>User CRUD</h2>

      <div style={{ display: "grid", gap: 8, marginBottom: 20 }}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
        <input name="status" placeholder="Status" value={form.status} onChange={handleChange} />
        <input name="role" placeholder="Role" value={form.role} onChange={handleChange} />

        <button onClick={submit}>
          {editId ? "Update User" : "Create User"}
        </button>
      </div>

      <table width="100%" border={1} cellPadding={6}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.phone}</td>
              <td>{u.status}</td>
              <td>{u.role}</td>
              <td>
                <button onClick={() => edit(u)}>Edit</button>{" "}
                <button onClick={() => remove(u.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
