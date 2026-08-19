const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const XENDIT_SECRET_KEY = (process.env.XENDIT_SECRET_KEY || '').trim();
const authHeader = Buffer.from(`${XENDIT_SECRET_KEY}:`).toString('base64');

async function testSessions() {
  console.log('Testing Xendit Checkout Sessions API...');
  try {
    const response = await axios.post(
      'https://api.xendit.co/sessions',
      {
        reference_id: `SESS-${Date.now()}`,
        currency: 'IDR',
        amount: 10000,
        session_type: 'PAY',
        mode: 'PAYMENT_LINK',
        country: 'ID',
        success_return_url: "https://example.com/success",
        failure_return_url: "https://example.com/failure",
        customer: {
          reference_id: `cust-${Date.now()}`,
          email: "test@example.com",
          type: "INDIVIDUAL",
          individual_detail: {
            given_names: "Test",
            surname: "User"
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
    console.log('Success! Session URL:', response.data.payment_link_url);
  } catch (error) {
    console.error('Error Status:', error.response?.status);
    console.error('Error Data:', JSON.stringify(error.response?.data, null, 2));
  }
}

testSessions();
