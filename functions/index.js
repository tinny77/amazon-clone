const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(
	'sk_test_51OWyvLD0esrzBRuhiMUIt29Pn60V2wvluB3ZlqbRysrubR6hb1A4bYELY0rCttb87kuD5qZhynlJ5M3UrKquRbRQ00MZOwj12B'
);

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.get('/', (req, res) => {
	res.send('Hello');
});

app.post('/payments/create', async (req, res) => {
	const total = req.query.total;

	console.log('Payment received!', total);

	const paymentIntent = await stripe.paymentIntents.create({
		amount: total,
		currency: 'usd',
	});

	res.status(201).send({
		clientSecret: paymentIntent.client_secret,
	});
});

// app.listen(3001);

exports.api = functions.https.onRequest(app);
// run firebase emulators:start
