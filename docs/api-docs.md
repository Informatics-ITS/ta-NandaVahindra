# 📘 API Documentation

## 🚀 Overview

This is a RESTful API built using **Express.js**, integrated with **Google Sheets** as a data source, and protected using **JWT authentication**. The API exposes endpoints to read filtered data, generate reports, fetch metadata (e.g. categories/months/actions), and manage cache.

* **Base URL**: `/api`
* **Protected Routes**: Require JWT via `Authorization: Bearer <token>`
* **Warmup / Healthcheck Route**: `/api/other/warmup`

---

## 🔐 Authentication

Protected routes require a JWT token passed in the `Authorization` header:

```http
Authorization: Bearer <your_token>
```

---

## 📂 Routes & Endpoints

### 🔸 `/api/other/warmup`

* **Method**: `GET`
* **Auth**: ❌ No
* **Description**: Healthcheck endpoint to confirm server is responsive.
* **Response**:

  ```json
  "Warmup request received"
  ```

---

### 🔒 Spreadsheet-Related Routes (Requires JWT)

All endpoints below are prefixed with `/api` and **protected by JWT**.

### 📊 `/eventsArea`

* **Method**: `GET`
* **Query Params**: `month`, `category`, `action` *(optional, comma-separated)*
* **Returns**: Aggregated area-wide event data filtered by parameters.

---

### 🌍 `/eventsEJRegion`, `/eventsCJRegion`, `/eventsBNRegion`

* **Method**: `GET`
* **Query Params**: `month`, `category`, `action` *(optional)*
* **Description**: Same as `/eventsArea` but scoped per region:

  * `EJ` = Jawa Timur
  * `CJ` = Jawa Tengah
  * `BN` = Bali Nusra

---

### 🗓️ `/months`, `/actions`, `/categories`

* **Method**: `GET`
* **Description**: Returns sorted & deduplicated lists for filters.

---

### 📈 `/graphData`

* **Method**: `GET`
* **Description**: Aggregates time-series data (by region & month) for graphing.

---

### 📋 `/tableData`

* **Method**: `GET`
* **Query Params (optional)**:

  * `searchQuery`: filter by `id` or `name`
  * `sortBy`: `payload`, `user`, `revenue`, `startDate`, etc.
  * `sortOrder`: `asc` or `desc`
  * `page`, `limit`
* **Description**: Paginated event-level metrics from Google Sheet.

---

### 🧮 `/actionSummary`

* **Method**: `GET`
* **Description**: Returns summary count per action type (e.g., CMON, repeater, etc).

---

### 🧹 `/clearCache`

* **Method**: `POST`
* **Description**: Clears all cached data in memory.

---

## 🔧 Environment Variables

The following variables are required:

```env
PORT=8080
SPREADSHEET_ID=your_google_sheet_id
SHEET_NAME=name_of_data_sheet
```

---

## 📦 Project Structure (Simplified)

```bash
.
├── server.js
├── routes/
│   ├── spreadsheetRoutes.js
│   └── otherRoutes.js
├── controllers/
│   ├── getEventsAreaController.js
│   ├── getEventsRegionController.js
│   ├── getFilterDataController.js
│   ├── getGraphData.js
│   ├── getTableData.js
│   ├── getActionSummary.js
│   └── clearCache.js
├── middleware/
│   └── authMiddleware.js
├── config/
│   └── googleServiceAccount.js
└── utils/
    └── cacheUtils.js
```

---

## 📌 Notes

* API heavily relies on Google Sheets as a backend database.
* All major data endpoints implement caching with optional TTL for performance.
* Filtering, sorting, pagination, and summarization are implemented server-side.

---

## ▶️ Getting Started

```bash
npm install
npm start
```

Make sure `.env` is set up properly before running the app.
