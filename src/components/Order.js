import React from 'react';
import moment from 'moment';
import './Order.css';
import CheckoutProduct from './CheckoutProduct';

function Order({ order }) {
	return (
		<div className="order">
			<h2>
				Order <small>{order.id}</small>
			</h2>
			<p>{moment.unix(order.data.created).format('MMMM Do YYYY')}</p>
			<p className="order__id"></p>
			{order.data.basket?.map((item) => (
				<CheckoutProduct
					id={item.id}
					title={item.title}
					image={item.image}
					price={item.price}
					rating={item.rating}
					hideButton
				/>
			))}
		</div>
	);
}

export default Order;
