const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const XENDIT_SECRET_KEY = (process.env.XENDIT_SECRET_KEY || '').trim();
const authHeader = Buffer.from(`${XENDIT_SECRET_KEY}:`).toString('base64');

async function testMismatch() {
  console.log('Testing Xendit Invoice API with mismatched items...');
  try {
    const response = await axios.post(
      'https://api.xendit.co/v2/invoices',
      {
        external_id: `TEST-MISMATCH-${Date.now()}`,
        amount: 5000, // Total is 5000
        payer_email: 'test@example.com',
        description: "Test Mismatch",
        currency: 'IDR',
        items: [
          {
            name: "Item 1",
            quantity: 1,
            price: 10000 // Item price is 10000
          }
        ]
      },
      {
        headers: {
          'Authorization': `Basic ${authHeader}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Success (Surprisingly)!', response.data.invoice_url);
  } catch (error) {
    console.error('Error Status:', error.response?.status);
    console.error('Error Data:', JSON.stringify(error.response?.data, null, 2));
  }
}

testMismatch();
