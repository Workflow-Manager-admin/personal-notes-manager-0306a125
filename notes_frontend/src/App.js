import React, { useState, useMemo, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { getToken, getUser, clearAuth } from "./utils/auth";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import NotesLayout from "./components/NotesLayout";
import NotesListPage from "./components/NotesListPage";
import NoteEditorPage from "./components/NoteEditorPage";
import NoteViewPage from "./components/NoteViewPage";
import "./App.css";

// -- Public Auth Context for app-wide auth state
export const AuthContext = React.createContext(null);

// PUBLIC_INTERFACE
function App() {
  const [auth, setAuth] = useState(() => {
    const token = getToken();
    return token ? { token, user: getUser() } : null;
  });

  useEffect(() => {
    // Autoforce logout if token/user cleared elsewhere
    if (auth && !getToken()) setAuth(null);
  }, [auth]);

  const login = (token, user) => setAuth({ token, user });
  const logout = () => {
    clearAuth();
    setAuth(null);
  };

  const authValue = useMemo(
    () => ({
      user: auth?.user,
      token: auth?.token,
      login,
      logout,
      isAuthenticated: !!auth,
    }),
    [auth]
  );

  return (
    <AuthContext.Provider value={authValue}>
      <Routes>
        <Route
          path="/login"
          element={!auth ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!auth ? <RegisterPage /> : <Navigate to="/" />}
        />
        {/* All authenticated note routes are nested under NotesLayout */}
        <Route
          path="/"
          element={auth ? <NotesLayout /> : <Navigate to="/login" />}
        >
          <Route index element={<NotesListPage />} />
          <Route path="notes/new" element={<NoteEditorPage mode="create" />} />
          <Route path="notes/:id" element={<NoteViewPage />} />
          <Route path="notes/:id/edit" element={<NoteEditorPage mode="edit" />} />
        </Route>
        {/* Catch-all route for non-matching auth'd users */}
        <Route path="*" element={<Navigate to={auth ? "/" : "/login"} />} />
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;
