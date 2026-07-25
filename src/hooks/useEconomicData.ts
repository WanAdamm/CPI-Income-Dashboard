import { useEffect } from "react";
import { getCPI, getHouseholdIncome } from "../api/opendosm.endpoints";
import { buildTimeSeries } from "../domain/normalize";
import { computeDerived } from "../domain/compute";
import { useEconomicStore } from "../store/economic.store";

export function useEconomicData() {
  const startLoading = useEconomicStore((s) => s.startLoading);
  const setData = useEconomicStore((s) => s.setData);
  const setError = useEconomicStore((s) => s.setError);

  useEffect(() => {
    let isActive = true;

    async function load() {
      startLoading();

      try {
        const [cpi, income] = await Promise.all([
          getCPI(),
          getHouseholdIncome(),
        ]);

        const baseYear = "2019-01";
        const ts = computeDerived(buildTimeSeries(cpi, income, baseYear));

        if (isActive) setData(ts);
      } catch {
        if (isActive) setError("OpenDOSM did not return the economic series");
      }
    }

    load();

    return () => {
      isActive = false;
    };
  }, [setData, setError, startLoading]);
}
