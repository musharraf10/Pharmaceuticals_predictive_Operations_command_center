const USER_STORAGE_KEY = "pharma_user";

export const storage = {
  getUser() {
    try {
      const raw = localStorage.getItem(USER_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  setUser(user) {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  },

  clearUser() {
    localStorage.removeItem(USER_STORAGE_KEY);
  },
};
