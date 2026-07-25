# Belanja - CPI-Income Dashboard

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

* Monthly CPI and observed income releases are aligned by date without interpolating missing income months
* Each series is indexed to **January 2019 = 100** for a like-for-like comparison
* Household income uses the **median value at the 50th percentile**
* Real buying power is the income index divided by the headline price index
* Missing or invalid data points remain missing rather than being replaced with estimates

This approach prioritizes transparency and interpretability over aggressive data interpolation.

---

## Features

* Normalized headline price vs median household income time-series
* A live RM100 test that translates index movement into a common reference amount
* Explicit separation between the matched comparison period and newer CPI-only data
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
