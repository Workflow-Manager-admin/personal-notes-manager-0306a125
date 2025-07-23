import React, { useState, useEffect } from "react";
import { getNotes, deleteNote } from "../api";
import { useNavigate } from "react-router-dom";
import { theme } from "../theme";

// PUBLIC_INTERFACE
function NotesListPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  async function loadNotes(searchQ = "") {
    setLoading(true);
    setError("");
    try {
      const n = await getNotes(searchQ);
      setNotes(n);
    } catch (e) {
      setError("Unable to load notes.");
    }
    setLoading(false);
  }

  useEffect(() => {
    loadNotes();
  }, []);

  async function handleSearch(e) {
    e.preventDefault();
    setSearching(true);
    await loadNotes(query);
    setSearching(false);
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    setDeletingId(id);
    try {
      await deleteNote(id);
      setNotes(notes.filter((n) => n.id !== id));
    } catch {
      alert("Delete failed");
    }
    setDeletingId(null);
  }

  return (
    <div>
      <form className="notes-search-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search notes..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button type="submit" disabled={searching} style={{ background: theme.colors.primary, color: "#fff" }}>
          {searching ? "Searching..." : "Search"}
        </button>
        <button
          type="button"
          style={{ marginLeft: 10, background: theme.colors.accent, color: "#fff" }}
          onClick={() => navigate("/notes/new")}
        >
          + New Note
        </button>
      </form>
      <div className="notes-list-wrap">
        {loading ? (
          <div style={{ margin: 40, textAlign: "center" }}>Loading...</div>
        ) : error ? (
          <div className="notes-error">{error}</div>
        ) : notes.length === 0 ? (
          <div style={{ color: "#555", marginTop: 46, textAlign: "center" }}>No notes found.</div>
        ) : (
          <div className="notes-list">
            {notes.map(n => (
              <div
                className="note-item"
                key={n.id}
                onClick={() => navigate(`/notes/${n.id}`)}
              >
                <div className="note-title">{n.title || <em>(Untitled Note)</em>}</div>
                <div className="note-snippet">
                  {n.content.length > 70 ? n.content.substring(0, 70) + "..." : n.content}
                </div>
                <div className="note-actions">
                  <button
                    className="note-edit-btn"
                    disabled={deletingId === n.id}
                    onClick={e => {
                      e.stopPropagation();
                      navigate(`/notes/${n.id}/edit`);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="note-delete-btn"
                    disabled={deletingId === n.id}
                    onClick={e => {
                      e.stopPropagation();
                      handleDelete(n.id);
                    }}
                  >
                    {deletingId === n.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default NotesListPage;
