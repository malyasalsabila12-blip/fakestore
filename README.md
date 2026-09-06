# Fake Store App

A modern, responsive e-commerce application built with React, TypeScript, and Tailwind CSS, powered by the [Fake Store API](https://fakestoreapi.com/).

## 🚀 Features

- **Browse Products**: View a comprehensive list of products with high-quality images and categories.
- **Search**: Real-time search functionality to find your favorite items instantly.
- **Filter**: Narrow down products by categories like electronics, jewelery, and clothing.
- **Detailed View**: Click on any product to see its full description, price, and ratings.
- **Shopping Cart**: Seamlessly add items to your cart, manage quantities, and proceed to a simulated checkout.
- **Responsive Design**: Optimized for a flawless experience across desktop, tablet, and mobile devices.
- **E2E Testing**: Robust end-to-end testing suite using Playwright.
- **API Testing**: Automated API validation suite using Postman and Newman.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Material Icons](https://fonts.google.com/icons)
- **Testing**: [Playwright](https://playwright.dev/), [Newman](https://www.npmjs.com/package/newman)

## 🏃 How to Run the Project

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed (v18 or higher recommended).

### Installation

1. Clone the repository and navigate to the project folder.

2. Install all dependencies for the app, api, and qa suite using the root script:
   ```bash
   npm run install-all
   ```

3. Install Playwright browsers:
   ```bash
   cd app
   npx playwright install
   ```

### Running Development Server

Start both the frontend and backend simultaneously using the root command:
```bash
npm run dev
```
- **Frontend**: `http://localhost:5173`
- **Backend (API)**: `http://localhost:3001`

---

## 🧪 Testing with Playwright

We use Playwright for end-to-end testing, including complex payment flows.

### Running Tests Locally

1. To run all tests against the local server:
   ```bash
   cd app
   npx playwright test
   ```

### Running Tests against Production (Vercel)

To run tests against your live Vercel deployment, set the `BASE_URL`:
```bash
# Windows (PowerShell)
$env:BASE_URL="https://your-app.vercel.app"; npx playwright test --prefix app

# Mac/Linux
BASE_URL=https://your-app.vercel.app npx playwright test --prefix app
```

### Key Test Scenarios
- **Payment Success**: E2E flow for purchasing a "Signature Watch" via Credit Card simulation.
- **Payment Failure**: Handles "Insufficient Balance" (Error 51) using specialized testing amounts (IDR 13,051).
- **UI Responsiveness**: Verified across different viewport sizes.

---

## 🔬 API Testing with Newman

We use Newman (Postman CLI) for automated API testing.

### Running API Tests

1. Navigate to the `qa` folder:
   ```bash
   cd qa
   ```

2. Run the Postman collection:
   ```bash
   npm test
   ```

3. View reports:
   - **HTML Report**: `qa/reports/report.html`
   - **PDF Report**: `qa/reports/report.pdf`

---

## 🏗️ Architecture Diagram

```mermaid
graph TD
    User[User/Tester] -->|Interacts| WebApp[React Web App]
    WebApp -->|HTTP Requests| API[Fake Store API]
    Newman[Newman CLI] -->|API Tests| API
    Playwright[Playwright E2E] -->|UI Tests| WebApp
    GitHubActions[GitHub Actions] -->|CI/CD| Playwright
    GitHubActions -->|CI/CD| Newman
```

---

## 📂 Project Structure

- `app/src/App.tsx`: Main application component containing routing and logic.
- `app/tests/e2e.spec.ts`: Playwright E2E test suite using POM.
- `qa/collections/`: Postman API collections for automated testing.
- `app/playwright.config.ts`: Configuration for Playwright testing.
- `app/vite.config.js`: Configuration for the Vite build tool.
