# CPI–Income Dashboard

## Overview

The CPI–Income Dashboard is a data-driven web application that explores the relationship between consumer price inflation and household income in Malaysia. It visualizes how changes in the cost of living compare against income growth over time, with a focus on affordability and purchasing power rather than raw price movements alone.

The project is designed as an analytical and exploratory dashboard, not an official statistical product.

---

## Data Sources

All data is retrieved from **OpenDOSM (Malaysia Open Data)**:

* **Consumer Price Index (CPI)** – headline CPI, filtered to the overall division and recent years
* **Household Income** – percentile-based income data, primarily using the 50th percentile (median) where available

API filtering is applied at the source to reduce noise and ensure consistency with the analysis assumptions.

---

## Methodology

* CPI and income data are aligned at a **monthly** level
* A base period (2019 = 100) is used to compute **inflation-adjusted (real) income**
* Household income is represented by **median income (50th percentile)** where available
* When median data is missing for certain periods, a clearly documented approximation using nearby percentiles may be applied
* Missing or invalid data points are handled explicitly to avoid misleading results

This approach prioritizes transparency and interpretability over aggressive data interpolation.

---

## Features

* CPI vs real household income time-series visualization
* Affordability indicators based on real income relative to CPI
* Distribution-aware handling of income data
* Clear separation between data fetching, computation, state management, and UI

---

## Tech Stack

* **Frontend:** React, Vite, TypeScript
* **Styling:** Tailwind CSS
* **Charts:** Recharts
* **State Management:** Zustand
* **Data Access:** OpenDOSM API

---

## Project Structure

The codebase follows a layered architecture:

* `api/` – external data access
* `domain/` – normalization and economic computations
* `store/` – global application state
* `hooks/` – orchestration and side effects
* `components/` – charts and UI elements
* `pages/` – route-level views

This structure keeps economic logic out of the UI layer and makes the analysis easier to audit and extend.

---

## Limitations

* The dashboard does not claim to produce official income or inflation statistics
* Percentile-based income data cannot be converted into true mean income without additional distributional information
* Approximations are used cautiously and documented where applied

---

## Purpose

This project is intended for learning, exploration, and portfolio demonstration. It emphasizes careful data handling, defensible assumptions, and clarity in economic visualization rather than maximal precision.

---

Just say the direction.
