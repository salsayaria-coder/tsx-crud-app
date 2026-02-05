import { useMemo, useState, type ChangeEvent } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import type { User } from "../types/User";

type Props = {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
};

type Errors = { name?: string; email?: string };

export default function EditUserPage({ users, setUsers }: Props) {
  const { id } = useParams();
  const userId = Number(id);
  const nav = useNavigate();

  const user = useMemo(() => users.find((u) => u.id === userId), [users, userId]);

  const [form, setForm] = useState<Omit<User, "id">>(() => ({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    status: user?.status ?? "",
    role: user?.role ?? "",
  }));
  const [errors, setErrors] = useState<Errors>({});

  if (!id || Number.isNaN(userId)) {
    return <div style={{ padding: 20 }}>Invalid user id. <Link to="/">Go back</Link></div>;
  }

  if (!user) {
    return <div style={{ padding: 20 }}>User not found. <Link to="/">Go back</Link></div>;
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: undefined }));
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

  const save = () => {
    if (!validate()) return;

    setUsers((prev) => prev.map((u) => (u.id === userId ? { id: userId, ...form } : u)));
    nav("/");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", paddingTop: 40 }}>
      <div
        style={{
          maxWidth: 600,
          margin: "0 auto",
          background: "#fff",
          padding: 20,
          borderRadius: 8,
          boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 8 }}>Edit User</h2>
        <div style={{ textAlign: "center", marginBottom: 20, fontSize: 12, opacity: 0.7 }}>
          ID: {userId}
        </div>

        <div style={{ display: "grid", gap: 10 }}>
          <div>
            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} style={{ width: "100%", padding: 8 }} />
            {errors.name && <div style={{ color: "red", fontSize: 12 }}>{errors.name}</div>}
          </div>

          <div>
            <input name="email" placeholder="Email" value={form.email} onChange={handleChange} style={{ width: "100%", padding: 8 }} />
            {errors.email && <div style={{ color: "red", fontSize: 12 }}>{errors.email}</div>}
          </div>

          <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} style={{ width: "100%", padding: 8 }} />
          <input name="status" placeholder="Status" value={form.status} onChange={handleChange} style={{ width: "100%", padding: 8 }} />
          <input name="role" placeholder="Role" value={form.role} onChange={handleChange} style={{ width: "100%", padding: 8 }} />

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={save} style={{ padding: 10, flex: 1 }}>Save</button>
            <button onClick={() => nav("/")} style={{ padding: 10, flex: 1 }}>Cancel</button>
          </div>

          <div style={{ textAlign: "center" }}>
            <Link to="/">← Back to list</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
