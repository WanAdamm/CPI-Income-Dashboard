export type CPIApiResponse = {
  date: string; // "YYYY-MM-DD"
  index: number; // CPI index
  division: string; // "overall"
};

export type IncomeApiResponse = {
  date: string; // "YYYY-MM-DD"
  income: number; // median household income
  variable: string; //
  percentile: number; // percentile of the income
};

export type MonthlyRecord = {
  date: string; // "YYYY-MM"
  cpi: number | null; // CPI index (null if unavailable)
  income_nominal: number | null; // chosen income measure (median)
  income_real: number | null; // inflation-adjusted income
  affordability_ratio: number | null; // real income / CPI
};

export type TimeSeriesStore = {
  baseYear: string; // "2019-01"
  records: Record<string, MonthlyRecord>;
  orderedKeys: string[]; // sorted YYYY-MM
};
