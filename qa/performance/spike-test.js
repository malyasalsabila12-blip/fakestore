import http from 'k6/http';
import { check, sleep } from 'k6';

/**
 * Spike Testing script for Fake Store API
 * Goal: Test how the system reacts to a sudden, massive increase in traffic.
 * To run: k6 run spike-test.js
 */

export const options = {
  stages: [
    { duration: '10s', target: 100 }, // Sudden spike to 100 users
    { duration: '1m', target: 100 },  // Sustained spike
    { duration: '10s', target: 0 },   // Sudden drop
  ],
  thresholds: {
    http_req_failed: ['rate<0.10'],    // Allow up to 10% failure during a spike
    http_req_duration: ['p(95)<2000'], // Higher tolerance for spike testing
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

  // Spike tests often focus on unauthenticated or high-traffic public endpoints
  const productsRes = http.get(`${BASE_URL}/products`, params);
  
  check(productsRes, {
    'status is 200': (r) => r.status === 200,
    'body size > 0': (r) => r.body.length > 0,
  });

  sleep(1);
}
