import React, { useEffect } from 'react';
import { useStateValue } from './StateProvider';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { auth } from './firebase';
import Home from './components/Home';
import Header from './components/Header';
import Login from './components/Login';
//import { Auth } from 'firebase/auth';
import Checkout from './components/Checkout';
import Payment from './components/Payment';
import Orders from './components/Orders';
import NotFound from './components/NotFound';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const STRIPE_PUBLIC_KEY =
	'pk_test_51OWyvLD0esrzBRuheZZxl7lRhxxXuP1Mq7pFiAxaqWmwo0xbo44evkI0NEMhnpShCq4fIsym11NXcLYxzPt1koMr00QZ1bsqcP';

const promise = loadStripe(STRIPE_PUBLIC_KEY);

function App() {
	const [{}, dispatch] = useStateValue();
	useEffect(() => {
		// will only run once when the app component loads...

		auth.onAuthStateChanged((authUser) => {
			//console.log('THE USER IS >>> ', authUser);

			if (authUser) {
				/* Login */
				dispatch({
					type: 'SET_USER',
					user: authUser,
				});
			} else {
				/* Logout*/
				dispatch({
					type: 'SET_USER',
					user: null,
				});
			}
		});
	}, []);
	return (
		<div className="App">
			<Router>
				<Header />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<Login />} />
					<Route path="/checkout" element={<Checkout />} />
					<Route path="/orders" element={<Orders />} />
					<Route
						path="/payment"
						element={
							<Elements stripe={promise}>
								<Payment />
							</Elements>
						}
					/>
					<Route path="*" element={<NotFound />} />
				</Routes>
			</Router>
		</div>
	);
}

export default App;
