import React, { useState, useEffect } from 'react';
import SideNav from '../layouts/sidenav/SideNav';
import BudgetChart from '../budget_piechart/BudgetChart';
import ExpenseChart from '../expense_donutchart/ExpenseChart';
import BudgetLineChart from '../budget_linechart/BudgetLineChart';
import MonthChart from '../month_barchart/MonthChart';
import {
	getAllExpenses,
	getBudgets,
	budgetTotal,
	expenseTotal,
	getSomeExpenses,
	getSomeBudgets,
} from '../../actions/apiCore';
import { isAuthenticated } from '../../actions/auth';
import './styles.css';

const Dashboard = () => {
	const [expenses, setExpenses] = useState([]);
	const [budgets, setBudgets] = useState([]);
	const [expenseData, setExpenseData] = useState([]);
	const [budgetData, setBudgetData] = useState([]);
	const [totalBudget, setTotalBudget] = useState(0);
	const [totalExpense, setTotalExpense] = useState(0);
	console.log(isAuthenticated());
	const { user, token } = isAuthenticated();

	const getExpenses = (id, token) => {
		getAllExpenses(id, token)
			.then((res) => {
				setExpenses(res);
			})
			.catch((err) => console.log(err));
	};

	const getExpensesData = (userId, token) => {
		getSomeExpenses(userId, token)
			.then((res) => {
				setExpenseData(res);
			})
			.catch((err) => console.log(err));
	};

	const getSomeBudgetData = (userId, token) => {
		getSomeBudgets(userId, token)
			.then((res) => {
				setBudgetData(res);
			})
			.catch((err) => console.log(err));
	};

	const getBudgetsData = (userId, token) => {
		getBudgets(userId, token)
			.then((res) => {
				setBudgets(res);
			})
			.catch((err) => {
				setBudgets({
					error: err,
				});
			});
	};

	const getBudgetTotal = (userId, token) => {
		budgetTotal(userId, token)
			.then((res) => {
				setTotalBudget(res);
			})
			.catch((err) => console.log(err));
	};

	const getExpenseTotal = (userId, token) => {
		expenseTotal(userId, token)
			.then((res) => {
				setTotalExpense(res);
			})
			.catch((err) => console.log(err));
	};

	const number = (totalExpense / totalBudget) * 100;
	const percentage = Math.round((number * 10) / 10);

	useEffect(() => {
		console.log(user);
		getExpenses(user._id, token);

		getBudgetsData(user._id, token);
		getBudgetTotal(user._id, token);
		getExpenseTotal(user._id, token);
		getExpensesData(user._id, token);
		getSomeBudgetData(user._id, token);
	}, []);

	const dashboardLayout = () => (
		<div className="container">
			<section class="dashboard">
				<div class="side-nav">
					<SideNav />
				</div>
				<div class="dashboard-content">
					<div class="dashboard-heading">
						<h1>Dashboard for complete expenses</h1>
					</div>

					<div class="chart-cards">
						<div class="total-budget" id="budget">
							<h1>Budget vs Expenditure until now</h1>
							<div className="chart-content">
								{budgetData.length > 0 ? (
									<BudgetLineChart />
								) : (
									<div>
										<h2>No Budget/Expense to Display</h2>
										<h3>Add Budget & Expense</h3>
									</div>
								)}
							</div>
						</div>
						<div class="total-budget">
							<h1>All Budgets</h1>
							<div className="chart-content">
								{budgetData.length > 0 ? (
									<BudgetChart />
								) : (
									<div>
										<h2>No Budget to Display</h2>
										<h3>Add Budget</h3>
									</div>
								)}
							</div>
						</div>
						<div class="total-budget">
							<h1>All Expenses</h1>
							<div className="chart-content">
								{expenses.length > 0 ? (
									<ExpenseChart />
								) : (
									<div>
										<h2>No Expense to Display</h2>
										<h3>Add Expense</h3>
									</div>
								)}
							</div>
						</div>
						<div class="total-budget">
							<h1>Month-wise Total Budget</h1>
							<div className="chart-content">
								{budgetData.length > 0 ? (
									<MonthChart />
								) : (
									<div>
										<h2>No Budget/Expense to Display</h2>
										<h3>Add Budget & Expense</h3>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);

	return <React.Fragment>{dashboardLayout()}</React.Fragment>;
};

export default Dashboard;
