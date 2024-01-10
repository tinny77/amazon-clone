import React, { useState, useEffect } from 'react';
import './Payment.css';
import { useStateValue } from './../StateProvider';
import CheckoutProduct from './CheckoutProduct';
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import CurrencyFormat from 'react-currency-format';
import { getBasketTotal } from './../reducer';
import axios from './../axios';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { db } from './../firebase';

function Payment() {
	const navigate = useNavigate();
	const [{ user, basket }, dispatch] = useStateValue();
	const { pathname } = useLocation();

	const stripe = useStripe();
	const elements = useElements();

	const [succeeded, setSucceeded] = useState(false);
	const [processing, setProcessing] = useState('');
	const [error, setError] = useState(null);
	const [disabled, setDisabled] = useState(true);
	const [clientSecret, setClientSecret] = useState(true);

	useEffect(() => {
		const getClientSecret = async () => {
			try {
				const response = await axios({
					method: 'post',
					url: `/payments/create?total=${getBasketTotal(basket) * 100}`,
				});
                    console.log(response);
				setClientSecret(response.data.clientSecret);
			} catch (error) {
				console.error('Error fetching client secret:', error);
				//navigate('/', { replace: true });
			}
		};

		getClientSecret();
		checkEmptyBasket();
	}, [basket]);

	//console.log('[CLIENTSECRET]', clientSecret);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setProcessing(true);

		const payload = await stripe
			.confirmCardPayment(clientSecret, {
				payment_method: {
					card: elements.getElement(CardElement),
				},
			})

        .then((response) => {
        const ordersCollection = collection(db, 'users', user?.uid, 'orders');
        console.log(response);
        addDoc(ordersCollection, {
            basket,
            amount: response.paymentIntent.amount,
            created: response.paymentIntent.created,
        }).then(() => {
				setSucceeded(true);
				setError(null);
				setProcessing(false);

				dispatch({
					type: 'EMPTY_BASKET',
				});

				navigate('/orders', { replace: true });
        }).catch((error) => {
            console.error('Error during the process: ', error);
        });


			});

	};

	const handleChange = (e) => {
		setDisabled(e.empty);
		setError(e.error ? e.error.message : '');
	};

	const checkEmptyBasket = () => {
		if (basket.length === 0 && pathname == '/payment')
			navigate('/', { replace: true });
	};

	return (
		<div className="payment">
			<div className="payment__container">
				<h1>
					Checkout (
					<Link to="/checkout">
						{basket?.length} item{basket?.length > 1 && 's'}
					</Link>
					)
				</h1>
				<div className="payment__section">
					<div className="payment__title">
						<h3>Delivery Address</h3>
					</div>
					<div className="payment__address">
						<p>{user?.email}</p>
						<p>3329 White Lane </p>
						<p>Centerville - Georgia</p>
					</div>
				</div>
				<div className="payment__section">
					<h3>Review items and delivery</h3>
				</div>
				<div className="payment__section">
					<div className="payment__title"></div>
					<div className="payment__items">
						{basket.map((item) => (
							<CheckoutProduct
								id={item.id}
								title={item.title}
								image={item.image}
								price={item.price}
								rating={item.rating}
							/>
						))}
					</div>
				</div>

				<div className="payment__section">
					<div className="payment__title">
						<h3>Payment</h3>
						<br />
						<CardElement onChange={handleChange} />
						{error ? <div className="error">Invalid data</div> : <div style={{marginTop:'15px',fontSize: '12px',
    lineHeight: '15px'}}>Use 4242 4242 4242 4242 as credit card number.</div>}
					</div>
					<div className="payment__details">
						<form onSubmit={handleSubmit}>
							<div className="payment__priceContainer">
								<CurrencyFormat
									renderText={(value) => <h3>Order Total: {value}</h3>}
									decimalScale={2}
									value={getBasketTotal(basket)}
									displayType="text"
									thousandSeperator={true}
									prefix="$"
								/>
								<br />
								<button disabled={processing || disabled || succeeded}>
									<span>{processing ? <p>Processing...</p> : 'Buy Now'}</span>
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Payment;
