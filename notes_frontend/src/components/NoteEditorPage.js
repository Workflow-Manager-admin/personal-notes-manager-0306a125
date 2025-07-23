import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createNote, updateNote, getNotes } from "../api";
import { theme } from "../theme";

// PUBLIC_INTERFACE
function NoteEditorPage({ mode }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // If in edit mode, fetch note details
  useEffect(() => {
    if (mode === "edit" && id) {
      (async function () {
        try {
          const notes = await getNotes();
          const note = notes.find((n) => String(n.id) === String(id));
          if (!note) throw new Error("Not found");
          setTitle(note.title);
          setContent(note.content);
        } catch {
          setError("Note not found");
        }
      })();
    }
  }, [mode, id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (mode === "create") {
        await createNote({ title, content });
        navigate("/");
      } else if (mode === "edit" && id) {
        await updateNote(id, { title, content });
        navigate(`/notes/${id}`);
      }
    } catch (err) {
      setError((err && err.message) || "Failed to save note.");
    }
    setSubmitting(false);
  }

  return (
    <div className="note-editor-wrap">
      <h3 style={{ color: theme.colors.primary, marginBottom: 24 }}>
        {mode === "create" ? "Create New Note" : "Edit Note"}
      </h3>
      <form className="note-editor-form" onSubmit={handleSubmit}>
        <label>Title</label>
        <input
          type="text"
          maxLength={50}
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Note Title"
          autoFocus
        />
        <label>Content</label>
        <textarea
          rows={10}
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Type note content here..."
          style={{ fontFamily: "inherit" }}
        />
        {error && <div className="note-editor-error">{error}</div>}
        <div className="note-editor-btn-row">
          <button
            type="submit"
            disabled={submitting}
            style={{
              background: theme.colors.primary,
            }}
          >
            {submitting
              ? mode === "create"
                ? "Saving..."
                : "Updating..."
              : mode === "create"
              ? "Save"
              : "Update"}
          </button>
          <button
            type="button"
            className="outline"
            onClick={() => (mode === "edit" && id ? navigate(`/notes/${id}`) : navigate("/"))}
            disabled={submitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
export default NoteEditorPage;
