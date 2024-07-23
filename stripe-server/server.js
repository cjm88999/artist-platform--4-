const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = 3001; // Use a different port to avoid conflicts with your frontend

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/oauth/callback', async (req, res) => {
  const authorizationCode = req.query.code;

  try {
    const response = await axios.post('https://connect.stripe.com/oauth/token', {
      client_secret: 'your-stripe-secret-key',
      code: authorizationCode,
      grant_type: 'authorization_code',
    });

    const { access_token, refresh_token, stripe_user_id } = response.data;
    // Save these tokens and the user ID in your database
    res.send('Stripe account connected successfully.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to connect Stripe account.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
