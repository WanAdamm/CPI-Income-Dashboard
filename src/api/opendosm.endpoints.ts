import type { CPIApiResponse, IncomeApiResponse } from "../domain/types";
import { fetchJSON } from "./opendosm.client";

export async function getCPI(): Promise<CPIApiResponse[]> {
  return fetchJSON("?id=cpi_headline&ifilter=overall@division&date_start=2019-01-01@date");
}

export async function getHouseholdIncome(): Promise<IncomeApiResponse[]> {
  return fetchJSON("?id=hies_malaysia_percentile&ifilter=mean@variable&ifilter=50@percentile");
}