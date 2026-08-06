const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config(); // Should work if running from server directory

const XENDIT_SECRET_KEY = (process.env.XENDIT_SECRET_KEY || '').trim();
const authHeader = Buffer.from(`${XENDIT_SECRET_KEY}:`).toString('base64');

async function test() {
  console.log('Key length:', XENDIT_SECRET_KEY.length);
  console.log('Testing Xendit Invoice API with Key:', XENDIT_SECRET_KEY.substring(0, 10) + '...');
  try {
    const response = await axios.post(
      'https://api.xendit.co/v2/invoices',
      {
        external_id: `TEST-${Date.now()}`,
        amount: 10000,
        payer_email: 'test@example.com',
        description: "Test Product",
        success_redirect_url: "https://example.com/success",
        failure_redirect_url: "https://example.com/failure",
        currency: 'IDR'
      },
      {
        headers: {
          'Authorization': `Basic ${authHeader}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Success!', response.data.invoice_url);
  } catch (error) {
    console.error('Error Status:', error.response?.status);
    console.error('Error Data:', JSON.stringify(error.response?.data, null, 2));
  }
}

test();
