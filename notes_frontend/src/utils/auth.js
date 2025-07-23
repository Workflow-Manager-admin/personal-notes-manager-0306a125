const TOKEN_KEY = "notesapp_token";
const USER_KEY = "notesapp_user";

// PUBLIC_INTERFACE
export function setAuth(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// PUBLIC_INTERFACE
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

// PUBLIC_INTERFACE
export function getUser() {
  const u = localStorage.getItem(USER_KEY);
  return u ? JSON.parse(u) : null;
}

// PUBLIC_INTERFACE
export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
