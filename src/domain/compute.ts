import type { TimeSeriesStore } from "./types";

export function computeDerived(store: TimeSeriesStore): TimeSeriesStore {
  const baseRecord = store.records[store.baseYear];
  const baseCPI =
    baseRecord && typeof baseRecord.cpi === "number"
      ? baseRecord.cpi
      : -Infinity;

  store.orderedKeys.forEach((key) => {
    const r = store.records[key];

    if (
      r.income_nominal == null ||
      r.cpi == null ||
      r.cpi === 0 ||
      baseCPI === -Infinity
    ) {
      r.income_real = -Infinity;
      r.affordability_ratio = -Infinity;
      return;
    }

    r.income_real = (r.income_nominal / r.cpi) * baseCPI;
    r.affordability_ratio =
      r.income_real !== 0 ? r.income_real / r.cpi : -Infinity;

      console.log(r);
  });

  return store;
}