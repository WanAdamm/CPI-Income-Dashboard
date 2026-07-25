import type { TimeSeriesStore } from "./types";

export function computeDerived(store: TimeSeriesStore): TimeSeriesStore {
  const baseRecord = store.records[store.baseYear];
  const baseCPI = Number.isFinite(baseRecord?.cpi) ? baseRecord.cpi : null;
  const baseIncome = Number.isFinite(baseRecord?.income_nominal)
    ? baseRecord.income_nominal
    : null;

  store.orderedKeys.forEach((key) => {
    const r = store.records[key];

    if (
      r.income_nominal == null ||
      r.cpi == null ||
      r.cpi === 0 ||
      baseCPI == null ||
      baseIncome == null ||
      baseIncome === 0
    ) {
      r.income_real = null;
      r.affordability_ratio = null;
      return;
    }

    r.income_real = (r.income_nominal / r.cpi) * baseCPI;
    r.affordability_ratio = r.income_real / baseIncome;
  });

  return store;
}
