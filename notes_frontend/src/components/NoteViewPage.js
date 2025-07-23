import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getNotes } from "../api";
import { theme } from "../theme";

// PUBLIC_INTERFACE
function NoteViewPage() {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    (async function () {
      try {
        const result = await getNotes();
        const foundNote = result.find(n => String(n.id) === String(id));
        if (!foundNote) throw new Error("Not found");
        setNote(foundNote);
      } catch {
        setError("Note not found");
      }
      setLoading(false);
    })();
  }, [id]);

  if (loading) return <div style={{ margin: 38 }}>Loading note...</div>;
  if (error)
    return (
      <div>
        <div style={{ color: theme.colors.error, margin: 25 }}>{error}</div>
        <button onClick={() => navigate("/")}>Back</button>
      </div>
    );
  return (
    <div className="note-view-wrap">
      <div className="note-view-title">{note.title || "Untitled Note"}</div>
      <div className="note-view-content">{note.content}</div>
      <div style={{ marginTop: 26 }}>
        <button
          onClick={() => navigate("/")}
          style={{
            background: theme.colors.primary,
            color: "#fff",
            border: "none",
            padding: "7px 18px",
            borderRadius: 7,
            fontWeight: 500,
          }}
        >
          Back to List
        </button>
        <button
          onClick={() => navigate(`/notes/${note.id}/edit`)}
          style={{
            background: theme.colors.accent,
            color: "#fff",
            border: "none",
            marginLeft: 10,
            padding: "7px 18px",
            borderRadius: 7,
            fontWeight: 500,
          }}
        >
          Edit
        </button>
      </div>
    </div>
  );
}
export default NoteViewPage;
