const axios = require('axios');

async function testLocalCheckout() {
  try {
    const response = await axios.post('http://localhost:3001/api/checkout', {
      amount: 15000,
      payerEmail: 'test@example.com',
      description: 'Test Order',
      externalID: 'TEST-' + Date.now(),
      successUrl: 'http://localhost:5173/profile',
      failureUrl: 'http://localhost:5173/cart'
    });
    console.log('Success:', response.data);
  } catch (error) {
    console.error('Error Status:', error.response?.status);
    console.error('Error Data:', JSON.stringify(error.response?.data, null, 2));
  }
}

testLocalCheckout();
