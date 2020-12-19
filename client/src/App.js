import React from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from 'react-router-dom';
import jwt from 'jsonwebtoken';
import Navbar from './components/layouts/Navbar/Navbar';
import Footer from './components/layouts/Footer/Footer';
import './App.css';
import Login from './components/login/Login';
import Register from './components/register/Register';
import Home from './components/landing/Home';
import Dashboard from './components/dashboard/Dashboard';
import AddBudget from './components/add_budget/AddBudget';
import AddExpense from './components/add_expense/AddExpense';
import Budgets from './components/budgets/Budgets';
import Expenses from './components/expenses/Expenses';
import { isAuthenticated, logout } from './actions/auth';

function App() {
	const PrivateRoute = ({ component: Component, ...rest }) => (
		<Route
			{...rest}
			render={(props) =>
				isAuthenticated() ? (
					<Component {...props} />
				) : (
					<Redirect
						to={{
							pathname: '/login',
							state: { from: props.location },
						}}
					/>
				)
			}
		/>
	);
	return (
		<Router>
			<div className="App">
				<Navbar />
				<Switch>
					<Route path="/" exact component={Home} />
					<Route path="/login" exact component={Login} />
					<Route path="/register" exact component={Register} />
					<PrivateRoute
						path="/user/dashboard"
						exact
						component={Dashboard}
					/>
					<PrivateRoute
						path="/user/add/budget"
						exact
						component={AddBudget}
					/>
					<PrivateRoute
						path="/user/add/expense"
						exact
						component={AddExpense}
					/>
					<PrivateRoute
						path="/user/budgets"
						exact
						component={Budgets}
					/>
					<PrivateRoute
						path="/user/expenses"
						exact
						component={Expenses}
					/>
				</Switch>
				<Footer />
			</div>
		</Router>
	);
}

export default App;
