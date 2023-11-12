const express = require("express");
const axios = require('axios');
const { google } = require('googleapis');
const serviceAccount = require('./prf-do-it-firebase-adminsdk-u8ko1-d52a2c7ea6.json');
const app = express();
const stripe = require("stripe")('sk_test_51O2Oj4F9ihC2ndyiNWTZuJ74LgKhwJWSWBkqecP572fj2VY14He9f1LqAkQ4saUbIy2cHDBcD92FrJBddmIrfBIN00fa6gFlKE');
const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.json());

const calculateOrderAmount = (items) => {
  return 1000;
};

app.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

app.get("/greet", async(req, res) => {
    res.send("Server is working...");
});

app.post('/send-notification', async (req, res) => {
  try {
    const bearerToken = await generateBearerToken();

    const {title, body, token} = req.body;

    const notification = {
      title,
      body,
    };

    const requestData = {
      message: {
        token,
        notification,
      },
    };

    const response = await axios.post(
      'https://fcm.googleapis.com/v1/projects/prf-do-it/messages:send',
      requestData,
      {
        headers: {
          Authorization: bearerToken,
          'Content-Type': 'application/json',
        },
      }
    );
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

async function generateBearerToken() {
  const scopes = ['https://www.googleapis.com/auth/firebase.messaging'];
  const auth = new google.auth.GoogleAuth({
    credentials: serviceAccount,
    scopes,
  });

  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();

  const bearerToken = `Bearer ${tokenResponse.token}`;

  return bearerToken;
}

app.listen(port, () => console.log(`Listening on port ${port}!`));