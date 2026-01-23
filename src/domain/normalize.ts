import type {
  CPIApiResponse,
  IncomeApiResponse,
  MonthlyRecord,
  TimeSeriesStore,
} from "./types";

export function buildTimeSeries(
  cpi: CPIApiResponse[],
  income: IncomeApiResponse[],
  baseYear: string,
): TimeSeriesStore {
  const records: Record<string, MonthlyRecord> = {};

  // Helper: extract YYYY-MM
  const toMonth = (d: string) => d.slice(0, 7);

  cpi.forEach((row) => {
    const month = toMonth(row.date);
    records[month] ??= {
      date: month,
      cpi: row.index,
      income_nominal: null,
      income_real: null,
      affordability_ratio: null,
    };
  });

  income.forEach((row) => {
    const month = toMonth(row.date);
    records[month] ??= {
      date: month,
      cpi: null,
      income_nominal: null,
      income_real: null,
      affordability_ratio: null,
    };

    records[month].income_nominal = row.income; // or median
  });

  return {
    baseYear,
    records,
    orderedKeys: Object.keys(records).sort(),
  };
}
