import http from 'k6/http';
import { check, sleep } from 'k6';

/**
 * Soak (Endurance) Testing script for Fake Store API
 * Goal: Test system stability over a longer period with a steady load.
 * To run: k6 run soak-test.js
 */

export const options = {
  stages: [
    { duration: '30s', target: 20 }, // Ramp up
    { duration: '4m', target: 20 },  // Steady load for 4 minutes
    { duration: '30s', target: 0 },  // Ramp down
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],    // Less than 1% failure
    http_req_duration: ['p(95)<500'], // 95% of requests under 500ms
  },
};

export function handleSummary(data) {
  return {
    'reports/performance-summary.json': JSON.stringify(data),
  };
}

const BASE_URL = 'https://fakestoreapi.com';

export default function () {
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Simulate a typical user browsing
  const res = http.get(`${BASE_URL}/products`, params);
  
  check(res, {
    'is status 200': (r) => r.status === 200,
  });

  sleep(1);
}
