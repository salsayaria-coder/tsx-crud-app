import React, { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import type { User } from "../types/User";

type Props = {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
};

type Errors = { name?: string; email?: string };
type FilterBy = "name" | "email";
type SortBy = "id" | "name" | "email";
type SortDir = "asc" | "desc";

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightMatch(text: string, query: string) {
  const q = query.trim();
  if (!q) return text;

  const safe = escapeRegExp(q);
  const regex = new RegExp(`(${safe})`, "ig");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} style={{ padding: "0 2px" }}>
            {part}
          </mark>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </>
  );
}

export default function UsersPage({ users, setUsers }: Props) {
  const [form, setForm] = useState<Omit<User, "id">>({
    name: "",
    email: "",
    phone: "",
    status: "",
    role: "",
  });
  const [errors, setErrors] = useState<Errors>({});

  // Filter
  const [filter, setFilter] = useState("");
  const [filterBy, setFilterBy] = useState<FilterBy>("name");

  // Sorting
  const [sortBy, setSortBy] = useState<SortBy>("id");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

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

  const create = () => {
    if (!validate()) return;
    setUsers((prev) => [...prev, { id: Date.now(), ...form }]);
    setForm({ name: "", email: "", phone: "", status: "", role: "" });
    setErrors({});
  };

  const remove = (id: number) => setUsers((prev) => prev.filter((u) => u.id !== id));

  // Reset to page 1 when filter/sort/pageSize changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [filter, filterBy, sortBy, sortDir, pageSize]);

  // 1) Filter
  const filteredUsers = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return users;

    return users.filter((u) => {
      if (filterBy === "name") return u.name.toLowerCase().includes(q);
      return u.email.toLowerCase().includes(q);
    });
  }, [users, filter, filterBy]);

  // 2) Sort (after filtering)
  const sortedUsers = useMemo(() => {
    const list = [...filteredUsers];

    const dir = sortDir === "asc" ? 1 : -1;

    list.sort((a, b) => {
      if (sortBy === "id") return (a.id - b.id) * dir;

      if (sortBy === "name") {
        return a.name.localeCompare(b.name, undefined, { sensitivity: "base" }) * dir;
      }

      // sortBy === "email"
      return a.email.localeCompare(b.email, undefined, { sensitivity: "base" }) * dir;
    });

    return list;
  }, [filteredUsers, sortBy, sortDir]);

  // 3) Pagination (after sorting)
  const total = sortedUsers.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndexExclusive = Math.min(startIndex + pageSize, total);
  const pagedUsers = sortedUsers.slice(startIndex, endIndexExclusive);

  // Page buttons (simple: show up to 5)
  const pageButtons = useMemo(() => {
    const maxButtons = 5;
    let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let end = start + maxButtons - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxButtons + 1);
    }

    const arr: number[] = [];
    for (let i = start; i <= end; i++) arr.push(i);
    return arr;
  }, [currentPage, totalPages]);

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", paddingTop: 40 }}>
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          background: "#fff",
          padding: 20,
          borderRadius: 8,
          boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>User CRUD</h2>

        {/* CREATE FORM */}
        <div style={{ display: "grid", gap: 10, marginBottom: 20 }}>
          <div>
            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              style={{ width: "100%", padding: 8 }}
            />
            {errors.name && <div style={{ color: "red", fontSize: 12 }}>{errors.name}</div>}
          </div>

          <div>
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              style={{ width: "100%", padding: 8 }}
            />
            {errors.email && <div style={{ color: "red", fontSize: 12 }}>{errors.email}</div>}
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

          <button onClick={create} style={{ padding: 10 }}>
            Create User
          </button>
        </div>

        {/* FILTER + SORT + PAGE SIZE CONTROLS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 10,
            marginBottom: 12,
            alignItems: "center",
          }}
        >
          {/* Filter */}
          <div style={{ display: "flex", gap: 10 }}>
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as FilterBy)}
              style={{ padding: 10 }}
            >
              <option value="name">Filter: Name</option>
              <option value="email">Filter: Email</option>
            </select>

            <input
              type="text"
              placeholder={`Search by ${filterBy}...`}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ flex: 1, padding: 10 }}
            />
          </div>

          {/* Sorting */}
          <div style={{ display: "flex", gap: 10 }}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              style={{ padding: 10, flex: 1 }}
            >
              <option value="id">Sort by: ID</option>
              <option value="name">Sort by: Name</option>
              <option value="email">Sort by: Email</option>
            </select>

            <button
              type="button"
              onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
              style={{ padding: 10, width: 120 }}
              title="Toggle sort direction"
            >
              {sortDir === "asc" ? "Asc ▲" : "Desc ▼"}
            </button>
          </div>

          {/* Page size */}
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <label style={{ alignSelf: "center" }}>Rows:</label>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              style={{ padding: 10, width: 120 }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>

        {/* TABLE */}
        <table width="100%" border={1} cellPadding={6} style={{ textAlign: "center" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pagedUsers.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>

                {/* Highlight only the column being filtered */}
                <td>{filterBy === "name" ? highlightMatch(u.name, filter) : u.name}</td>
                <td>{filterBy === "email" ? highlightMatch(u.email, filter) : u.email}</td>

                <td>{u.phone}</td>
                <td>{u.status}</td>
                <td>{u.role}</td>
                <td>
                  <Link to={`/edit/${u.id}`}>Edit</Link>{" "}
                  <button onClick={() => remove(u.id)}>Delete</button>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: 16 }}>
                  No users yet
                </td>
              </tr>
            )}

            {users.length > 0 && filteredUsers.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: 16 }}>
                  No users match your search
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* PAGINATION BAR */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 12,
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <div>
            {total === 0 ? (
              <span>Showing 0 of 0</span>
            ) : (
              <span>
                Showing {startIndex + 1}–{endIndexExclusive} of {total}
              </span>
            )}
          </div>

          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <button
              type="button"
              onClick={() => setPage(1)}
              disabled={currentPage === 1}
              style={{ padding: "6px 10px" }}
            >
              « First
            </button>

            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{ padding: "6px 10px" }}
            >
              ‹ Prev
            </button>

            {pageButtons.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                style={{
                  padding: "6px 10px",
                  fontWeight: p === currentPage ? "bold" : "normal",
                }}
              >
                {p}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{ padding: "6px 10px" }}
            >
              Next ›
            </button>

            <button
              type="button"
              onClick={() => setPage(totalPages)}
              disabled={currentPage === totalPages}
              style={{ padding: "6px 10px" }}
            >
              Last »
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
