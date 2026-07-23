import http from 'k6/http';
import { check, sleep } from 'k6';

/**
 * Stress Testing script for Fake Store API
 * Goal: Find the limit of the API by ramping up to 100 users.
 * To run: k6 run stress-test.js
 */

export const options = {
  stages: [
    { duration: '1m', target: 20 },  // Normal load
    { duration: '1m', target: 50 },  // Breaking point search
    { duration: '1m', target: 100 }, // Stress point
    { duration: '1m', target: 100 }, // Sustained stress
    { duration: '1m', target: 0 },   // Recovery
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'], // Higher tolerance for stress testing
    http_req_failed: ['rate<0.05'],     // Allow up to 5% failure under extreme stress
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

  // 2. Heavy activity
  const responses = http.batch([
    ['GET', `${BASE_URL}/products`, null, params],
    ['GET', `${BASE_URL}/products/categories`, null, params],
    ['GET', `${BASE_URL}/products/1`, null, params],
  ]);

  check(responses[0], { 'get products status is 200': (r) => r.status === 200 });
  check(responses[1], { 'get categories status is 200': (r) => r.status === 200 });

  sleep(1);
}
