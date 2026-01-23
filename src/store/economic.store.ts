import { create } from "zustand";
import type { TimeSeriesStore } from "../domain/types";

type EconomicState = {
  data: TimeSeriesStore | null;
  isLoading: boolean;
  error: string | null;
  setData: (data: TimeSeriesStore) => void;
  setError: (error: string) => void;
};

export const useEconomicStore = create<EconomicState>((set) => ({
  data: null,
  isLoading: false,
  error: null,

  setData: (data) =>
    set({
      data,
      isLoading: false,
      error: null,
    }),

  setError: (error) =>
    set({
      error,
      isLoading: false,
    }),
}));
