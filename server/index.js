const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Xendit = require('xendit-node');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const x = new Xendit({
  secretKey: process.env.XENDIT_SECRET_KEY || 'xnd_development_...',
});

const i = new x.Invoice();

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Endpoint to create a Xendit Invoice
app.post('/api/create-invoice', async (req, res) => {
  console.log('Received create-invoice request:', req.body);
  try {
    const { amount, payerEmail, description, externalID } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const result = await i.createInvoice({
      externalID: externalID || `MAL-${Date.now()}`,
      amount: amount,
      payerEmail: payerEmail,
      description: description || "Payment for Malstro Order",
      shouldSendEmail: true,
      successRedirectURL: "http://localhost:5173/profile",
      failureRedirectURL: "http://localhost:5173/payment",
    });

    console.log('Xendit Invoice Created:', result.invoice_url);
    res.json({ invoice_url: result.invoice_url });
  } catch (error) {
    console.error('Xendit Error Details:', error);
    res.status(500).json({ 
      error: error.message,
      details: error.response?.data || error
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
