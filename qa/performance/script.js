import http from 'k6/http';
import { check, sleep } from 'k6';

/**
 * Performance testing script for Fake Store API
 * To run: k6 run script.js
 */

export const options = {
  stages: [
    { duration: '30s', target: 20 }, // Ramp up to 20 users
    { duration: '1m', target: 20 },  // Stay at 20 users
    { duration: '30s', target: 0 },  // Ramp down to 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    http_req_failed: ['rate<0.01'],    // Less than 1% of requests should fail
  },
};

export function handleSummary(data) {
  return {
    'reports/performance-summary.json': JSON.stringify(data),
  };
}

const BASE_URL = 'https://fakestoreapi.com';

export default function () {
  // 1. Authentication
  const loginPayload = JSON.stringify({
    username: 'malya',
    password: 'serverqa123',
  });

  const loginParams = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const loginRes = http.post(`${BASE_URL}/auth/login`, loginPayload, loginParams);

  check(loginRes, {
    'login status is 200 or 201': (r) => r.status === 200 || r.status === 201,
    'login has token': (r) => r.json().token !== undefined,
  });

  const token = loginRes.json().token;
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  };

  // 2. Get All Products
  const productsRes = http.get(`${BASE_URL}/products?limit=10`, params);
  check(productsRes, {
    'get products status is 200': (r) => r.status === 200,
    'products list is not empty': (r) => r.json().length > 0,
  });

  // 3. Get Single Product (Random ID 1-20)
  const productId = Math.floor(Math.random() * 20) + 1;
  const singleProductRes = http.get(`${BASE_URL}/products/${productId}`, params);
  check(singleProductRes, {
    'get single product status is 200': (r) => r.status === 200,
    'product id matches': (r) => r.json().id === productId,
  });

  // 4. Get Categories
  const categoriesRes = http.get(`${BASE_URL}/products/categories`, params);
  check(categoriesRes, {
    'get categories status is 200': (r) => r.status === 200,
  });

  sleep(1);
}
