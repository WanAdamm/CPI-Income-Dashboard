import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useEconomicStore } from "../../store/economic.store";

export default function CPIIncomeChart() {
  const data = useEconomicStore((s) => s.data);

  if (!data) return null;

  const chartData = data.orderedKeys.map((key) => {
    const r = data.records[key];
    return {
      date: key,
      cpi: r.cpi,
      realIncome: r.income_real,
    };
  });

  return (
    <div className="w-full h-90">
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="date" tick={{ fontSize: 12 }} tickMargin={8} />

          <YAxis tick={{ fontSize: 12 }} tickMargin={8} />

          <Tooltip
            formatter={(value) =>
              typeof value === "number" ? value.toFixed(2) : ""
            }
          />

          <Legend />

          <Line
            type="monotone"
            dataKey="cpi"
            name="CPI Index"
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
          />

          <Line
            type="monotone"
            dataKey="realIncome"
            name="Real Household Income"
            stroke="#2563eb"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
