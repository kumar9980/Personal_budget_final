import React from 'react';
import { Link } from 'react-router-dom';

const SideNav = () => (
	<ul>
		<Link to="/user/budgets">
			<li>Budget list</li>
		</Link>
		<Link to="/user/expenses">
			<li>Expense list</li>
		</Link>
		<Link to="/user/add/budget">
			<li>Add Budget</li>
		</Link>
		<Link to="/user/add/expense">
			<li>Add Expense</li>
		</Link>
	</ul>
);

export default SideNav;
