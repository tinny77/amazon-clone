import React, { useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from './../firebase';
import {
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
} from 'firebase/auth';

function Login() {
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errormsg, setErrormsg] = useState('');

	const autoFill = () => {
		setEmail('customer@demo.it');
		setPassword('customer');
	};

	const signIn = (e) => {
		e.preventDefault();

		signInWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				//const user = userCredential.user;
				setErrormsg('');
				navigate('/');
			})
			.catch((error) => {
				showError(error);
			});
	};

	const register = (e) => {
		e.preventDefault();

		createUserWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				//const user = userCredential.user;
				setErrormsg('');
				navigate('/');
			})
			.catch((error) => {
				showError(error);
			});
	};

	const showError = (error) => {
		console.log(error.code);
		if (error?.code === 'auth/invalid-email')
			setErrormsg('Invalid email entered.');
		if (error?.code === 'auth/missing-password')
			setErrormsg('Missing password.');
		if (error?.code === 'auth/invalid-credential')
			setErrormsg('Invalid credentials.');
		if (error?.code === 'auth/weak-password')
			setErrormsg('Password is too weak.');
	};

	return (
		<div className="login">
			<Link to="/">
				<img
					className="login__logo"
					src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png"
					alt="Login"
				/>
			</Link>

			<div className="login__container">
				<h1>Sign-in</h1>

				<form>
					<h5>E-mail</h5>
					<input
						type="text"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>

					<h5>Password</h5>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>

					<button
						type="submit"
						className="login__signInButton"
						onClick={signIn}
					>
						Sign In
					</button>
				</form>

				{errormsg && <p class="login__error">{errormsg}</p>}

				<p onClick={autoFill}>
					You can login with customer@demo.it/customer (click to auto-fill).
				</p>

				<button className="login__registerButton" onClick={register} hidden>
					Create your Amazon Account
				</button>
			</div>
		</div>
	);
}

export default Login;
