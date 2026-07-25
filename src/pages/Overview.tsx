import { useEconomicData } from "../hooks/useEconomicData";
import { useEconomicStore } from "../store/economic.store";
import DashboardLayout from "../components/layout/DashboardLayout";
import StatCard from "../components/ui/StatCard";
import CPIIncomeChart from "../components/charts/CPIIncomeChart";
import type { MonthlyRecord } from "../domain/types";

type CpiRecord = MonthlyRecord & { cpi: number };
type ComparableRecord = MonthlyRecord & {
  cpi: number;
  income_nominal: number;
  income_real: number;
  affordability_ratio: number;
};

const monthFormatter = new Intl.DateTimeFormat("en-MY", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function formatMonth(month: string) {
  return monthFormatter.format(new Date(`${month}-01T00:00:00Z`));
}

function formatSignedPercent(ratio: number) {
  const percentage = ratio * 100;
  const sign = percentage > 0 ? "+" : "";
  return `${sign}${percentage.toFixed(1)}%`;
}

function formatMovement(ratio: number) {
  const direction = ratio >= 0 ? "rose" : "fell";
  return `${direction} ${Math.abs(ratio * 100).toFixed(1)}%`;
}

function hasCpi(record: MonthlyRecord | undefined): record is CpiRecord {
  return typeof record?.cpi === "number" && Number.isFinite(record.cpi);
}

function isComparable(
  record: MonthlyRecord | undefined,
): record is ComparableRecord {
  return (
    hasCpi(record) &&
    typeof record.income_nominal === "number" &&
    Number.isFinite(record.income_nominal) &&
    typeof record.income_real === "number" &&
    Number.isFinite(record.income_real) &&
    typeof record.affordability_ratio === "number" &&
    Number.isFinite(record.affordability_ratio)
  );
}

export default function Overview() {
  useEconomicData();

  const data = useEconomicStore((s) => s.data);
  const isLoading = useEconomicStore((s) => s.isLoading);
  const error = useEconomicStore((s) => s.error);

  if (error && !data) {
    return (
      <DashboardLayout dataThrough="Data unavailable">
        <section className="state-panel" aria-live="polite">
          <p className="eyebrow">Data connection</p>
          <h1>The ledger could not be updated.</h1>
          <p>
            {error}. Check your connection, then request the OpenDOSM series
            again.
          </p>
          <button type="button" onClick={() => window.location.reload()}>
            Try again
          </button>
        </section>
      </DashboardLayout>
    );
  }

  if (isLoading || !data) {
    return (
      <DashboardLayout>
        <section className="state-panel" aria-live="polite" aria-busy="true">
          <p className="eyebrow">OpenDOSM live data</p>
          <h1>Preparing the household ledger.</h1>
          <p>Aligning monthly prices with available income survey releases.</p>
          <div className="loading-lines" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </section>
      </DashboardLayout>
    );
  }

  const cpiRecords = data.orderedKeys
    .map((key) => data.records[key])
    .filter(hasCpi);
  const incomeRecords = data.orderedKeys
    .map((key) => data.records[key])
    .filter(isComparable);
  const baseRecord = data.records[data.baseYear];
  const latestCpiRecord = cpiRecords.at(-1);
  const latestIncomeRecord = incomeRecords.at(-1);

  if (
    !isComparable(baseRecord) ||
    !latestCpiRecord ||
    !latestIncomeRecord
  ) {
    return (
      <DashboardLayout dataThrough="Series incomplete">
        <section className="state-panel" aria-live="polite">
          <p className="eyebrow">Data validation</p>
          <h1>The two series cannot be compared yet.</h1>
          <p>
            The January 2019 baseline or the latest income observation is
            missing. No estimate has been substituted.
          </p>
        </section>
      </DashboardLayout>
    );
  }

  const priceIndex = (latestIncomeRecord.cpi / baseRecord.cpi) * 100;
  const incomeIndex =
    (latestIncomeRecord.income_nominal / baseRecord.income_nominal) * 100;
  const priceGrowth = priceIndex / 100 - 1;
  const incomeGrowth = incomeIndex / 100 - 1;
  const realPowerGrowth = incomeIndex / priceIndex - 1;
  const normalizedHeadroom = incomeIndex - priceIndex;
  const pricesSinceIncome = latestCpiRecord.cpi / latestIncomeRecord.cpi - 1;
  const [latestYear, latestMonth] = latestCpiRecord.date.split("-");
  const priorYearRecord = data.records[
    `${Number(latestYear) - 1}-${latestMonth}`
  ];
  const annualInflation = hasCpi(priorYearRecord)
    ? latestCpiRecord.cpi / priorYearRecord.cpi - 1
    : null;
  const incomeAhead = realPowerGrowth >= 0;

  return (
    <DashboardLayout
      dataThrough={`Prices through ${formatMonth(latestCpiRecord.date)}`}
    >
      <div className="dashboard-page">
        <section className="hero" aria-labelledby="page-title">
          <div className="hero-copy">
            <p className="eyebrow">Malaysia / household purchasing power</p>
            <h1 id="page-title">
              Median income moved <em>{incomeAhead ? "ahead" : "behind"}</em>{" "}
              of prices.
            </h1>
            <p className="hero-summary">
              From {formatMonth(baseRecord.date)} to{" "}
              {formatMonth(latestIncomeRecord.date)}, national median household
              income {formatMovement(incomeGrowth)} while headline prices{" "}
              {formatMovement(priceGrowth)}. After inflation, buying power{" "}
              {formatMovement(realPowerGrowth)}.
            </p>
            <div className="hero-period">
              <span>Matched comparison</span>
              <strong>
                {formatMonth(baseRecord.date)} to{" "}
                {formatMonth(latestIncomeRecord.date)}
              </strong>
            </div>
          </div>

          <aside className="receipt" aria-label="The RM100 comparison test">
            <div className="receipt-meta">
              <span>Belanja / comparison slip</span>
              <span>{formatMonth(latestIncomeRecord.date)}</span>
            </div>
            <h2>The RM100 test</h2>
            <p className="receipt-intro">
              Start both series at RM100 in {formatMonth(baseRecord.date)}.
            </p>
            <div className="receipt-lines">
              <div>
                <span>Median income after growth</span>
                <strong>RM{incomeIndex.toFixed(2)}</strong>
              </div>
              <div>
                <span>Same basket after inflation</span>
                <strong>-RM{priceIndex.toFixed(2)}</strong>
              </div>
              <div className="receipt-rule" aria-hidden="true" />
              <div className="receipt-balance">
                <span>Normalized headroom</span>
                <strong>
                  {normalizedHeadroom >= 0 ? "+" : "-"}RM
                  {Math.abs(normalizedHeadroom).toFixed(2)}
                </strong>
              </div>
            </div>
            <div className="receipt-total">
              <span>Real buying power</span>
              <strong>{formatSignedPercent(realPowerGrowth)}</strong>
            </div>
            <p className="receipt-note">
              National index comparison. This is not a household budget.
            </p>
            <div className="receipt-barcode" aria-hidden="true" />
          </aside>
        </section>

        <section className="coverage-strip" aria-label="Dataset coverage">
          <div>
            <span>Fair comparison window</span>
            <strong>
              <time dateTime={`${baseRecord.date}-01`}>
                {formatMonth(baseRecord.date)}
              </time>{" "}
              to{" "}
              <time dateTime={`${latestIncomeRecord.date}-01`}>
                {formatMonth(latestIncomeRecord.date)}
              </time>
            </strong>
          </div>
          <div>
            <span>Headline price series</span>
            <strong>
              Monthly / through {formatMonth(latestCpiRecord.date)}
            </strong>
          </div>
          <div>
            <span>Household income series</span>
            <strong>
              Survey releases / through {formatMonth(latestIncomeRecord.date)}
            </strong>
          </div>
        </section>

        <section className="analysis-grid" id="trend">
          <article className="trend-panel">
            <header className="panel-heading">
              <div>
                <p className="eyebrow">Indexed comparison / Jan 2019 = 100</p>
                <h2>Two lines, one fair starting point.</h2>
              </div>
              <div className="chart-key" aria-label="Chart legend">
                <span className="chart-key-price">Headline prices</span>
                <span className="chart-key-income">Median income</span>
              </div>
            </header>
            <p className="panel-intro">
              Indexing both series removes their incompatible units. Income
              dots mark survey releases; the connecting line is not monthly
              income data.
            </p>
            <CPIIncomeChart data={data} />
            <p className="chart-caption">
              The price line continues after the final income observation so
              the data gap stays visible rather than being estimated away.
            </p>
          </article>

          <aside className="readings-panel" aria-labelledby="readings-title">
            <div className="readings-heading">
              <p className="eyebrow">Matched-period readings</p>
              <h2 id="readings-title">What changed</h2>
            </div>
            <div className="reading-list">
              <StatCard
                label="Headline prices"
                value={formatSignedPercent(priceGrowth)}
                detail={`${formatMonth(baseRecord.date)} to ${formatMonth(latestIncomeRecord.date)}`}
                tone="price"
              />
              <StatCard
                label="Median household income"
                value={formatSignedPercent(incomeGrowth)}
                detail="Observed survey releases"
                tone="income"
              />
              <StatCard
                label="Real buying power"
                value={formatSignedPercent(realPowerGrowth)}
                detail="Income growth after inflation"
                tone="power"
              />
            </div>
            <div className="freshness-note">
              <span>Latest price pulse</span>
              <strong>
                {annualInflation == null
                  ? "N/A"
                  : `${formatSignedPercent(annualInflation)} YoY`}
              </strong>
              <p>Headline CPI in {formatMonth(latestCpiRecord.date)}.</p>
            </div>
          </aside>
        </section>

        <section className="bottom-grid">
          <article className="takeaway-panel">
            <p className="eyebrow">Plain-language read</p>
            <h2>
              {incomeAhead
                ? "The matched data shows breathing room, not a universal win."
                : "The matched data shows prices taking the lead."}
            </h2>
            <p className="takeaway-lead">
              This national median can improve while many households still feel
              squeezed. Spending mix, location, household size, and income level
              change the lived result.
            </p>
            <div className="postscript-reading">
              <span>
                Price growth after the last income release
                <small>
                  {formatMonth(latestIncomeRecord.date)} to{" "}
                  {formatMonth(latestCpiRecord.date)}
                </small>
              </span>
              <strong>{formatSignedPercent(pricesSinceIncome)}</strong>
            </div>
            <p className="takeaway-note">
              Without a newer income release, the dashboard does not claim that
              the matched-period advantage still holds today.
            </p>
          </article>

          <aside className="method-panel" id="method">
            <p className="eyebrow">How this is calculated</p>
            <h2>Method, without the fog.</h2>
            <dl className="method-list">
              <div>
                <dt>Scope</dt>
                <dd>Malaysia, headline CPI, overall division.</dd>
              </div>
              <div>
                <dt>Income</dt>
                <dd>National household median at the 50th percentile.</dd>
              </div>
              <div>
                <dt>Common baseline</dt>
                <dd>Each series is indexed to 100 in January 2019.</dd>
              </div>
              <div>
                <dt>Real buying power</dt>
                <dd>Income index divided by the headline price index.</dd>
              </div>
            </dl>
            <a
              className="source-link"
              href="https://open.dosm.gov.my"
              target="_blank"
              rel="noreferrer"
            >
              Inspect the source at OpenDOSM <span aria-hidden="true">↗</span>
            </a>
          </aside>
        </section>
      </div>
    </DashboardLayout>
  );
}
