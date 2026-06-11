# Fake Store API Automation

This project uses **Postman** and **Newman** to automate API testing for [Fake Store API](https://fakestoreapi.com/).

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- npm (installed with Node.js)

## Setup

1. Navigate to the `qa` folder:
   ```bash
   cd qa
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Running Tests

To run the API tests and generate a report, execute:

```bash
npm test
```

### Expected Output

When you run the tests, you should see a summary in the terminal similar to this:

```text
newman

FakeStoreAPI

□ Products
└ Get All Products
  GET https://fakestoreapi.com/products [200 OK, 11.36kB, 506ms]
  √  Status code is 200
  √  Response is an array

└ Get Single Product
  GET https://fakestoreapi.com/products/1 [200 OK, 1.09kB, 467ms]
  √  Status code is 200
  √  Product ID matches

┌─────────────────────────┬────────────────────┬────────────────────┐
│                         │           executed │             failed │
├─────────────────────────┼────────────────────┼────────────────────┤
│              iterations │                  1 │                  0 │
├─────────────────────────┼────────────────────┼────────────────────┤
│                requests │                  2 │                  0 │
├─────────────────────────┼────────────────────┼────────────────────┤
│            test-scripts │                  4 │                  0 │
├─────────────────────────┼────────────────────┼────────────────────┤
│      prerequest-scripts │                  2 │                  0 │
├─────────────────────────┼────────────────────┼────────────────────┤
│              assertions │                  4 │                  0 │
└─────────────────────────┴────────────────────┴────────────────────┘
```

### Reports

After running the tests, two reports will be generated in the `qa/reports` folder:
- `reports/report.html`: Interactive HTML report with detailed request/response data.
- `reports/summary.pdf`: A beautifully formatted PDF summary of the test results.

## Project Structure

- `collections/`: Contains Postman collection files.
- `environments/`: Contains Postman environment files.
- `reports/`: (Generated) Contains HTML test reports.
- `package.json`: Project configuration and test scripts.

# Checklist Progress

### Phase 1 — API Testing dengan Postman

#### Basic API Testing
- [x] **Memahami struktur API Fake Store API**
- [x] **Membuat Postman Collection**
- [x] **Membuat Environment (dev)** (Nama: `FakeStore-Dev`)
- [x] **Menggunakan Variables pada Postman** (`{{baseUrl}}`)
- [x] **Menggunakan Query Params** (`?limit=5`)
- [x] **Menggunakan Path Params** (`/products/:id`)

#### Endpoint Testing
- [x] **POST Login Auth**
- [x] **Get All Products**
- [x] **Get Product by ID**
- [x] **Create Product (POST)**
- [x] **Get Cart by User ID**

#### Validation (Script di Tab "Tests")
- [x] **Status code validation**
- [x] **Response time validation**
- [x] **Header validation**
- [x] **JSON schema validation**
- [x] **Data type validation**
  - [x] `id` (number), `title` (string), `price` (number), `image` (URL string)

#### Negative Testing
- [x] **Invalid Login**
- [x] **Invalid Product ID**
- [x] **Empty Parameter**

#### Advanced Postman Scripting
- [x] **Pre-request Script** (Global logging & env setup)
- [x] **Test Script** (Complex assertions & schema)
- [x] **Collection Variables**
- [x] **Environment Variables** (Auto-save token)
- [x] **Dynamic Variables** (`{{$randomPrice}}`)

#### Automation
- [x] **Menjalankan collection dengan Newman**
- [x] **Menjalankan collection via CLI**

---

### Phase 2 — Reporting

#### Newman Report
- [x] **HTML Report** (`htmlextra`)
- [x] **JSON Report** (Exported to `reports/report.json`)

#### Report Content
- [x] **Total test**, **Passed**, **Failed**, **Response time**, **Success rate**

#### Bonus
- [x] **Generate report timestamp** (Filenames: `report-YYYY-MM-DD...html`)
- [x] **Save historical report** (Auto-copy to timestamped files)
