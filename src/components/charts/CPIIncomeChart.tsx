import {
  CartesianGrid,
  LineChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TimeSeriesStore } from "../../domain/types";

type Props = {
  data: TimeSeriesStore;
};

const monthFormatter = new Intl.DateTimeFormat("en-MY", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function formatMonth(month: string) {
  return monthFormatter.format(new Date(`${month}-01T00:00:00Z`));
}

export default function CPIIncomeChart({ data }: Props) {
  const baseRecord = data.records[data.baseYear];
  const baseCpi = baseRecord?.cpi;
  const baseIncome = baseRecord?.income_nominal;

  if (
    typeof baseCpi !== "number" ||
    !Number.isFinite(baseCpi) ||
    typeof baseIncome !== "number" ||
    !Number.isFinite(baseIncome)
  ) {
    return null;
  }

  const chartData = data.orderedKeys
    .map((key) => {
      const record = data.records[key];

      if (typeof record.cpi !== "number" || !Number.isFinite(record.cpi)) {
        return null;
      }

      return {
        date: key,
        priceIndex: (record.cpi / baseCpi) * 100,
        incomeIndex:
          typeof record.income_nominal === "number" &&
          Number.isFinite(record.income_nominal)
            ? (record.income_nominal / baseIncome) * 100
            : null,
      };
    })
    .filter((point): point is NonNullable<typeof point> => point !== null);

  const indexedValues = chartData.flatMap((point) =>
    point.incomeIndex == null
      ? [point.priceIndex]
      : [point.priceIndex, point.incomeIndex],
  );
  const yMin = Math.floor((Math.min(...indexedValues) - 2) / 5) * 5;
  const yMax = Math.ceil((Math.max(...indexedValues) + 2) / 5) * 5;
  const latestIncomeDate = [...chartData]
    .reverse()
    .find((point) => point.incomeIndex != null)?.date;
  const yearTicks = chartData
    .filter((point) => point.date.endsWith("-01"))
    .map((point) => point.date);

  return (
    <div
      className="chart-frame"
      role="img"
      aria-label="Headline price and median household income indices since January 2019"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 24, right: 14, bottom: 8, left: -12 }}
        >
          <CartesianGrid
            vertical={false}
            stroke="#c8d8d2"
            strokeDasharray="2 6"
          />

          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            ticks={yearTicks}
            interval="preserveStartEnd"
            minTickGap={48}
            tickMargin={14}
            tick={{ fill: "#647b78", fontFamily: "DM Mono", fontSize: 11 }}
            tickFormatter={(value) => String(value).slice(0, 4)}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            width={54}
            domain={[yMin, yMax]}
            tickMargin={8}
            tick={{ fill: "#647b78", fontFamily: "DM Mono", fontSize: 11 }}
            tickFormatter={(value) => Number(value).toFixed(0)}
          />

          <Tooltip
            cursor={{ stroke: "#79918d", strokeDasharray: "3 4" }}
            contentStyle={{
              background: "#173238",
              border: 0,
              borderRadius: 10,
              color: "#ffffff",
              fontFamily: "DM Mono",
              fontSize: 12,
            }}
            itemStyle={{ color: "#ffffff" }}
            labelStyle={{ color: "#c8d8d2", marginBottom: 8 }}
            labelFormatter={(value) => formatMonth(String(value))}
            formatter={(value, name) => [
              typeof value === "number" ? `${value.toFixed(1)} pts` : "N/A",
              String(name),
            ]}
          />

          {latestIncomeDate ? (
            <ReferenceLine
              x={latestIncomeDate}
              stroke="#79918d"
              strokeDasharray="3 6"
              label={{
                value: "Income data ends",
                position: "insideTopRight",
                fill: "#647b78",
                fontFamily: "DM Mono",
                fontSize: 10,
              }}
            />
          ) : null}

          <Line
            type="monotone"
            dataKey="priceIndex"
            name="Headline prices"
            stroke="#d84c5a"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 5, fill: "#d84c5a", stroke: "#edf4f0" }}
          />

          <Line
            type="linear"
            dataKey="incomeIndex"
            name="Median income"
            stroke="#08766e"
            strokeWidth={3}
            strokeDasharray="8 6"
            connectNulls
            dot={{ r: 4, fill: "#08766e", stroke: "#edf4f0", strokeWidth: 2 }}
            activeDot={{ r: 6, fill: "#08766e", stroke: "#edf4f0" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
