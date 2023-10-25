const express = require("express");
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

app.listen(port, () => console.log(`Listening on port ${port}!`));