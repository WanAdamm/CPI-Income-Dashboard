import { useEffect } from "react";
import { getCPI, getHouseholdIncome } from "../api/opendosm.endpoints";
import { buildTimeSeries } from "../domain/normalize";
import { computeDerived } from "../domain/compute";
import { useEconomicStore } from "../store/economic.store";

export function useEconomicData() {
  const setData = useEconomicStore((s) => s.setData);
  const setError = useEconomicStore((s) => s.setError);

  useEffect(() => {
    async function load() {
      try {
        const [cpi, income] = await Promise.all([
          getCPI(),
          getHouseholdIncome(),
        ]);

        const baseYear = "2019-01";
        const ts = computeDerived(buildTimeSeries(cpi, income, baseYear));

        setData(ts);
      } catch (err) {
        setError("Failed to load economic data");
      }
    }

    load();
  }, [setData, setError]);
}
