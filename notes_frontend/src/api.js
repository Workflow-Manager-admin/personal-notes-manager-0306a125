import { getToken } from "./utils/auth";

const API_BASE = "http://localhost:3001";

// PUBLIC_INTERFACE
export async function login(email, password) {
  // Assumes POST /auth/login {email, password} -> {token, user}
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

// PUBLIC_INTERFACE
export async function register(email, password) {
  // Assumes POST /auth/register {email, password} -> {token, user}
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Registration failed");
  return res.json();
}

// INTERNAL
function authHeader() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// PUBLIC_INTERFACE
export async function getNotes(query = "") {
  // GET /notes?search=query -> [{...note}]
  let url = `${API_BASE}/notes`;
  if (query) url += `?search=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: {
      ...authHeader(),
    },
  });
  if (res.status === 401) throw new Error("auth"); // Token expired, etc.
  if (!res.ok) throw new Error("Failed to fetch notes");
  return res.json();
}

// PUBLIC_INTERFACE
export async function createNote(note) {
  // POST /notes {title, content}
  const res = await fetch(`${API_BASE}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(note),
  });
  if (res.status === 401) throw new Error("auth");
  if (!res.ok) throw new Error("Create failed");
  return res.json();
}

// PUBLIC_INTERFACE
export async function updateNote(id, note) {
  // PUT /notes/:id
  const res = await fetch(`${API_BASE}/notes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(note),
  });
  if (res.status === 401) throw new Error("auth");
  if (!res.ok) throw new Error("Update failed");
  return res.json();
}

// PUBLIC_INTERFACE
export async function deleteNote(id) {
  // DELETE /notes/:id
  const res = await fetch(`${API_BASE}/notes/${id}`, {
    method: "DELETE",
    headers: {
      ...authHeader(),
    },
  });
  if (res.status === 401) throw new Error("auth");
  if (!res.ok) throw new Error("Delete failed");
  return true;
}
