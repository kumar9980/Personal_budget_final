import React, { useState, useEffect } from 'react';
import SideNav from '../layouts/sidenav/SideNav';
import { getBudgets, addExpense } from '../../actions/apiCore';
import { isAuthenticated } from '../../actions/auth';
import { Message } from 'semantic-ui-react';
import './styles.css';

const AddExpense = () => {
	const [budgets, setBudgets] = useState([]);
	const [expenseData, setExpenseData] = useState({
		name: '',
		expense: '',
		budget: '',
		error: '',
		success: false,
	});
	const { user, token } = isAuthenticated();

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

	const { name, expense, budget, success, error } = expenseData;

	const handleChange = (name) => (event) => {
		setExpenseData({ ...expenseData, [name]: event.target.value });
	};

	const addExpenses = (event) => {
		event.preventDefault();
		event.target.reset();
		addExpense(user._id, { name, expense, budget }, token).then((res) => {
			setExpenseData({
				name: '',
				budget: '',
				expense: '',
				success: true,
			});
		});
	};

	const MessageExamplePositive = () => (
		<Message positive>
			<Message.Header>Expense Added Successfully!</Message.Header>
		</Message>
	);
	const MessageExampleNegative = () => (
		<Message negative>
			<Message.Header>Expense Not Added </Message.Header>
			<p>{error}</p>
		</Message>
	);

	useEffect(() => {
		getBudgetsData(user._id, token);
	}, []);

	const addExpenseLayout = () => (
		<div className="container">
			<section class="dashboard">
				<div class="side-nav">
					<SideNav />
				</div>
				<section class="budget-card">
					<div class="budget-content">
						<div class="budget-heading">
							<h3>Add your Expense of the month</h3>
						</div>
						<div class="budget-form">
							<div className="success-message">
								{success && MessageExamplePositive()}
							</div>
							<div className="error-message">
								{error && MessageExampleNegative()}
							</div>
							<form
								class="form-content"
								noValidate
								onSubmit={addExpenses}
							>
								<div class="form-group">
									<input
										type="text"
										id="name"
										name="name"
										onChange={handleChange('name')}
										class="form-control"
										placeholder="Name"
										required
									/>
									<label for="name" class="form-label">
										Expense Name
									</label>
								</div>
								<div class="form-group">
									<input
										type="number"
										id="expense"
										name="expense"
										onChange={handleChange('expense')}
										class="form-control"
										placeholder="Expense"
										required
									/>
									<label for="expense" class="form-label">
										Expense amount
									</label>
								</div>
								<div class="form-group">
									<select
										id="expense-budget"
										class="form-control"
										onChange={handleChange('budget')}
									>
										<optgroup>
											<option value="" disabled selected>
												Select Budget category
											</option>
											{budgets.map((budget, index) => (
												<option
													key={index}
													value={budget._id}
												>
													{budget.name}
												</option>
											))}
										</optgroup>
									</select>
									<br />
								</div>
								<br />
								<input
									type="submit"
									value="Add Expense"
									class="submit-button"
								/>
							</form>
						</div>
					</div>
				</section>
			</section>
		</div>
	);

	return <React.Fragment>{addExpenseLayout()}</React.Fragment>;
};

export default AddExpense;
