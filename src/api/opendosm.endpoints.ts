import type { CPIApiResponse, IncomeApiResponse } from "../domain/types";
import { fetchJSON } from "./opendosm.client";

export async function getCPI(): Promise<CPIApiResponse[]> {
  return fetchJSON(
    "?id=cpi_headline&ifilter=overall@division&date_start=2019-01-01@date",
  );
}

export async function getHouseholdIncome(): Promise<IncomeApiResponse[]> {
  const rows = await fetchJSON<IncomeApiResponse[]>(
    "?id=hies_malaysia_percentile&ifilter=50@percentile",
  );

  return rows.filter((row) => row.variable === "median");
}
