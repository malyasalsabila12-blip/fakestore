const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const XENDIT_SECRET_KEY = (process.env.XENDIT_SECRET_KEY || '').trim();
const authHeader = Buffer.from(`${XENDIT_SECRET_KEY}:`).toString('base64');

const endpoints = [
  'https://api.xendit.co/v2/checkout/sessions',
  'https://api.xendit.co/sessions'
];

async function testEndpoints() {
  for (const url of endpoints) {
    console.log(`\n--- Testing: ${url} ---`);
    try {
      const response = await axios.post(
        url,
        {
          reference_id: `TEST-${Date.now()}`,
          currency: 'IDR',
          amount: 10000,
          session_type: 'PAY',
          mode: 'PAYMENT_LINK', // Modern UI usually needs this mode
          country: 'ID',
          success_return_url: "https://example.com/success",
          failure_return_url: "https://example.com/failure",
          items: [
            {
              reference_id: "item-1",
              name: "Test Item",
              price: 10000,
              quantity: 1,
              type: "PRODUCT"
            }
          ],
          customer: {
            reference_id: `cust-${Date.now()}`,
            email: "test@example.com",
            type: "INDIVIDUAL",
            individual_detail: {
              given_names: "John",
              surname: "Doe"
            }
          }
        },
        {
          headers: {
            'Authorization': `Basic ${authHeader}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('SUCCESS!');
      console.log('Status:', response.status);
      console.log('Response Body:', JSON.stringify(response.data, null, 2));
      return; // Stop at first success
    } catch (error) {
      console.log('FAILED');
      console.log('Status:', error.response?.status);
      console.log('Error Code:', error.response?.data?.error_code);
      console.log('Message:', error.response?.data?.message);
    }
  }
}

testEndpoints();
