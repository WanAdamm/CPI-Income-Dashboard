import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  dataThrough?: string;
};

export default function DashboardLayout({ children, dataThrough }: Props) {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to the ledger
      </a>

      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="/" aria-label="Belanja home">
            <span className="brand-mark" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className="brand-type">
              <strong>Belanja</strong>
              <small>Malaysia household ledger</small>
            </span>
          </a>

          <nav className="site-nav" aria-label="Dashboard sections">
            <a href="#trend">Trend</a>
            <a href="#method">Method</a>
          </nav>

          <div className="data-stamp" aria-label="Data source and coverage">
            <span className="status-dot" aria-hidden="true" />
            <span>
              <small>OpenDOSM live data</small>
              <strong>{dataThrough ?? "Connecting to source"}</strong>
            </span>
          </div>
        </div>
      </header>

      <main id="main-content">{children}</main>

      <footer className="site-footer">
        <div>
          <strong>Belanja</strong>
          <span>Exploratory analysis, not an official statistic.</span>
        </div>
        <a
          href="https://open.dosm.gov.my"
          target="_blank"
          rel="noreferrer"
        >
          Data from OpenDOSM <span aria-hidden="true">↗</span>
        </a>
      </footer>
    </div>
  );
}
