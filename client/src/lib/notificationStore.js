import { create } from "zustand";
import apiRequest from "./apiRequest";

export const useNotificationStore = create((set) => ({
  number: 0,
  fetch: async () => {
    const res = await apiRequest("/users/notification");
    const n = Number(res.data) || 0;
    set({ number: Math.max(0, n) });
  },
  decrease: (count = 1) => {
    set((prev) => ({ number: Math.max(0, (prev.number || 0) - count) }));
  },
  reset: () => {
    set({ number: 0 });
  },
  increase: (count = 1) => {
    set((prev) => ({ number: (prev.number || 0) + count }));
  },
  setNumber: (n) => {
    const v = Number(n) || 0;
    set({ number: Math.max(0, v) });
  },
}));