const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const XENDIT_SECRET_KEY = (process.env.XENDIT_SECRET_KEY || '').trim();

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Endpoint to create a Xendit Checkout Session (Modern UI)
app.post('/api/checkout', async (req, res) => {
  console.log('Received checkout request:', req.body);
  try {
    const { amount, payerEmail, description, externalID, successUrl, failureUrl, items } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const authHeader = Buffer.from(`${XENDIT_SECRET_KEY}:`).toString('base64');
    
    // Xendit Checkout Sessions V2 REQUIRES HTTPS URLs. 
    // We force conversion to https for everything to satisfy the API validator.
    const fixUrl = (url) => {
      if (!url) return null;
      return url.replace('http://', 'https://');
    };

    const origin = req.get('origin') || 'http://localhost:5173';

    // Using Xendit Invoices API (V1/V2) instead of Sessions (V2)
    // The Invoices API is much more lenient with localhost/http for development
    const payload = {
      external_id: externalID || `MAL-${Date.now()}`,
      amount: amount,
      payer_email: payerEmail,
      description: description,
      success_redirect_url: `${origin}/profile`,
      failure_redirect_url: `${origin}/cart`,
      currency: 'IDR'
    };

    if (items && items.length > 0) {
      payload.items = items.map(item => ({
        name: item.title,
        quantity: item.quantity || 1,
        price: Math.round(item.price * 15000),
        category: item.category || 'General'
      }));
    }

    const response = await axios.post(
      'https://api.xendit.co/v2/invoices',
      payload,
      {
        headers: {
          'Authorization': `Basic ${authHeader}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Xendit Invoice Created:', response.data.invoice_url);
    res.json({ invoice_url: response.data.invoice_url });
  } catch (error) {
    const status = error.response?.status || 500;
    const errorData = error.response?.data || { message: error.message };
    
    console.error(`Xendit Error (${status}):`, errorData);
    
    res.status(status).json({ 
      error: error.message,
      details: errorData
    });
  }
});

// Webhook endpoint to receive payment notifications from Xendit
app.post('/api/webhooks/xendit', (req, res) => {
  const callbackToken = req.headers['x-callback-token'];

  // Verification (Uncomment and add XENDIT_CALLBACK_TOKEN to .env once set in Xendit Dashboard)
  /*
  if (callbackToken !== process.env.XENDIT_CALLBACK_TOKEN) {
    return res.status(401).json({ message: 'Invalid callback token' });
  }
  */

  const { status, external_id, amount, id } = req.body;

  console.log(`\n--- Xendit Webhook Received ---`);
  console.log(`Status: ${status}`);
  console.log(`External ID: ${external_id}`);
  console.log(`Amount: ${amount}`);
  console.log(`Xendit ID: ${id}`);
  console.log(`-------------------------------\n`);

  if (status === 'PAID') {
    // TODO: Implement your database update logic here
    // Example: await Order.findOneAndUpdate({ orderNumber: external_id }, { status: 'PAID' });
    console.log(`Order ${external_id} marked as PAID in database.`);
  } else if (status === 'EXPIRED') {
    console.log(`Order ${external_id} marked as EXPIRED.`);
  }

  // Always return a 200 status code to Xendit to acknowledge receipt
  res.status(200).send('Webhook received');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
