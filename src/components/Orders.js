import React, { useState, useEffect } from 'react';
import './Orders.css';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from './../firebase';
import Order from './Order';
import { useStateValue } from './../StateProvider';

function Orders() {
	const [{ user }, dispatch] = useStateValue();
	const [orders, setOrders] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const ordersCollection = collection(db, 'users', user?.uid, 'orders');

				const ordersSnapshot = await getDocs(
					query(ordersCollection, orderBy('created', 'desc'))
				);

				const fetchedOrders = ordersSnapshot.docs.map((doc) => ({
					id: doc.id,
					data: doc.data(),
				}));

				setOrders(fetchedOrders);
			} catch (error) {
				console.error('Error fetching orders:', error);
			} finally {
				setIsLoading(false);
			}
		};

		if (user?.uid) {
			fetchOrders();
		}
	}, [user?.uid]);

	return (
		<div className="orders">
			<h1>Your Orders</h1>

			<div className="orders__order">
				{isLoading ? (
					<p>Loading...</p>
				) : (
					<>
						{orders.length === 0 && "You haven't placed any order yet!"}
						{!!orders &&
							orders.map((order) => <Order key={order.id} order={order} />)}
					</>
				)}
			</div>
		</div>
	);
}

export default Orders;
