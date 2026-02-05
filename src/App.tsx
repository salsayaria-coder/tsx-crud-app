import { useState, type ChangeEvent } from "react";
import type { User } from "./types/User";

type Errors = {
  name?: string;
  email?: string;
};

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
  const [errors, setErrors] = useState<Errors>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // clear only the field being edited
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const newErrors: Errors = {};

    const name = form.name.trim();
    const email = form.email.trim();

    if (!name) newErrors.name = "Name is required";
    else if (name.length < 3) newErrors.name = "Name must be at least 3 characters";

    if (!email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Enter a valid email address";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = () => {
    if (!validate()) return;

    if (editId === null) {
      setUsers((prev) => [...prev, { id: Date.now(), ...form }]);
    } else {
      setUsers((prev) => prev.map((u) => (u.id === editId ? { id: editId, ...form } : u)));
      setEditId(null);
    }

    setForm({ name: "", email: "", phone: "", status: "", role: "" });
    setErrors({});
  };

  const edit = (u: User) => {
    setEditId(u.id);
    const { id, ...rest } = u;
    setForm(rest);
    setErrors({});
  };

  const remove = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", paddingTop: 40 }}>
      <div
        style={{
          maxWidth: 800,
          margin: "0 auto",
          background: "#ffffff",
          padding: 20,
          borderRadius: 8,
          boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>User CRUD</h2>

        <div style={{ display: "grid", gap: 10, marginBottom: 20 }}>
          <div>
            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              style={{ width: "100%", padding: 8 }}
            />
            {errors.name && <div style={{ color: "red", fontSize: 12, marginTop: 4 }}>{errors.name}</div>}
          </div>

          <div>
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              style={{ width: "100%", padding: 8 }}
            />
            {errors.email && (
              <div style={{ color: "red", fontSize: 12, marginTop: 4 }}>{errors.email}</div>
            )}
          </div>

          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            style={{ width: "100%", padding: 8 }}
          />
          <input
            name="status"
            placeholder="Status"
            value={form.status}
            onChange={handleChange}
            style={{ width: "100%", padding: 8 }}
          />
          <input
            name="role"
            placeholder="Role"
            value={form.role}
            onChange={handleChange}
            style={{ width: "100%", padding: 8 }}
          />

          <button onClick={submit} style={{ padding: 10 }}>
            {editId ? "Update User" : "Create User"}
          </button>
        </div>

        <table width="100%" border={1} cellPadding={6} style={{ textAlign: "center" }}>
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
            {users.map((u) => (
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
    </div>
  );
}
