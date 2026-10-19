import type { StateStorage } from 'zustand/middleware';

// Private browsing or disabled storage must not prevent in-memory login.
export const authStorage: StateStorage = {
  getItem(name) {
    try {
      return localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem(name, value) {
    try {
      localStorage.setItem(name, value);
    } catch {
      /* Use memory only. */
    }
  },
  removeItem(name) {
    try {
      localStorage.removeItem(name);
    } catch {
      /* Storage unavailable. */
    }
  },
};
