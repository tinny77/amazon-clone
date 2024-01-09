import React, { useEffect } from 'react';
import { useStateValue } from './StateProvider';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Header from './components/Header';
import Login from './components/Login';
//import { Auth } from 'firebase/auth';
import { auth } from './firebase';
import Checkout from './components/Checkout';

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
				</Routes>
			</Router>
		</div>
	);
}

export default App;
