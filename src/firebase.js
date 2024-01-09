import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {
	getAuth,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
} from 'firebase/auth';

const firebaseConfig = {
	apiKey: 'AIzaSyBK-HI2cSHqOJjdIQZRMbUJQf-fE2Ze9Q4',
	authDomain: 'clone-6fc97.firebaseapp.com',
	projectId: 'clone-6fc97',
	storageBucket: 'clone-6fc97.appspot.com',
	messagingSenderId: '959340987247',
	appId: '1:959340987247:web:b22269853648f13cd85e9a',
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, signInWithEmailAndPassword, createUserWithEmailAndPassword };
