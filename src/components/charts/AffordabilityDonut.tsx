import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useEconomicStore } from "../../store/economic.store";

const COLORS = ["#4f46e5", "#e5e7eb"]; // indigo, light gray

export default function AffordabilityDonut() {
  const store = useEconomicStore((s) => s.data);
  if (!store) return null;

  const safeRecords = store.orderedKeys
    .map((k) => store.records[k])
    .filter(
      (
        r,
      ): r is typeof r & {
        income_real: number;
        affordability_ratio: number;
      } =>
        r.income_real !== null &&
        r.affordability_ratio !== null &&
        Number.isFinite(r.income_real) &&
        Number.isFinite(r.affordability_ratio),
    );

  if (safeRecords.length === 0) return null;

  const record = safeRecords[safeRecords.length - 1];

  const affordability = Math.min(record.affordability_ratio, 1);
  const shortfall = 1 - affordability;

  const chartData = [
    { name: "Affordable", value: affordability },
    { name: "Shortfall", value: shortfall },
  ];

  return (
    <div className="relative w-full h-65">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            innerRadius={70}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((_, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>

          <Tooltip
            formatter={(value) =>
              typeof value === "number" ? `${(value * 100).toFixed(1)}%` : ""
            }
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-sm text-gray-500">Affordability</span>
        <span className="text-xl font-semibold">
          {(record.affordability_ratio * 100).toFixed(1)}%
        </span>
      </div>
    </div>
  );
}
