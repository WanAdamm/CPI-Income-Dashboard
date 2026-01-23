import { useEconomicData } from "../hooks/useEconomicData";
import { useEconomicStore } from "../store/economic.store";
import DashboardLayout from "../components/layout/DashboardLayout";
import StatCard from "../components/ui/StatCard";
import AffordabilityDonut from "../components/charts/AffordabilityDonut";
import CPIIncomeChart from "../components/charts/CPIIncomeChart";

export default function Overview() {
  useEconomicData();

  const data = useEconomicStore((s) => s.data);

  if (!data) {
    return (
      <DashboardLayout title="Cost of Living Dashboard">
        <div className="text-gray-500">Loading data…</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Cost of Living Dashboard">
      {/* KPI ROW */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatCard title="CPI Growth (YoY)" value="4.1%" delta="+0.6%" positive={false} />
        <StatCard title="Real Income Growth" value="1.2%" delta="-0.3%" positive={false} />
        <StatCard title="Affordability Index" value="92.4" delta="-3.8%" positive={false} />
        <StatCard title="Income-Cost Gap" value="-2.9%" delta="+0.4%" positive={false} />
      </div>

      {/* MAIN CHART */}
      <div className="bg-white rounded-xl p-6 mb-8 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">
          CPI vs Real Household Income
        </h2>
        <CPIIncomeChart />
      </div>

      {/* LOWER SECTION */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">
            Cost Composition (CPI Basket)
          </h2>
          <AffordabilityDonut />
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">
            Methodology Snapshot
          </h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>Base year: 2019 = 100</li>
            <li>Income deflated using headline CPI</li>
            <li>Monthly time series</li>
            <li>Source: OpenDOSM</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
