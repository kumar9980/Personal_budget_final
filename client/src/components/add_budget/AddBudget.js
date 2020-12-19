import React, { useState } from 'react';
import SideNav from '../layouts/sidenav/SideNav';
import { addBudget } from '../../actions/apiCore';
import { isAuthenticated } from '../../actions/auth';
import { Message } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import './styles.css';

const AddBudget = () => {
	const [budgetData, setBudgetData] = useState({
		name: '',
		budget: '',
		month: '',
		errors: '',
		success: false,
	});

	const { name, budget, month, success } = budgetData;
	const { user, token } = isAuthenticated();

	const handleChange = (name) => (event) => {
		setBudgetData({
			...budgetData,
			errors: false,
			[name]: event.target.value,
		});
	};

	async function addBudgetData(event) {
		event.preventDefault();
		event.target.reset();
		await addBudget(user._id, { name, budget, month }, token).then(
			(res) => {
				setBudgetData({
					name: '',
					budget: '',
					month: '',
					errors: false,
					success: true,
				});
			}
		);
	}

	const MessageExamplePositive = () => (
		<Message positive>
			<Message.Header>Budget Added Successfully!</Message.Header>
		</Message>
	);

	const addBudgetLayout = () => (
		<div className="container">
			<section class="dashboard">
				<div class="side-nav">
					<SideNav />
				</div>
				<section class="budget-card">
					<div class="budget-content">
						<div class="budget-heading">
							<h3>Add Monthly Budget</h3>
						</div>
						<div class="budget-form">
							<div className="success-message">
								{success && MessageExamplePositive()}
							</div>

							<form
								class="form-content"
								noValidate
								onSubmit={addBudgetData}
							>
								<div class="form-group">
									<input
										type="text"
										id="name"
										name="name"
										onChange={handleChange('name')}
										class="form-control"
										placeholder="Budget name"
										required
									/>
									<label for="name" class="form-label">
										Budget Name
									</label>
								</div>
								<div class="form-group">
									<input
										type="number"
										id="limit"
										name="limit"
										onChange={handleChange('budget')}
										class="form-control"
										placeholder="Budget estimate"
										required
									/>
									<label for="limit" class="form-label">
										Budget estimate
									</label>
								</div>
								<div class="form-group">
									<input
										type="datetime-local"
										id="month"
										name="month"
										onChange={handleChange('month')}
										className="form-control"
										placeholder="Select Month"
										required
									/>
								</div>
								<br />
								<input
									type="submit"
									value="Add Budget"
									class="submit-button"
								/>
							</form>
						</div>
					</div>
				</section>
			</section>
		</div>
	);

	return <React.Fragment>{addBudgetLayout()}</React.Fragment>;
};

export default AddBudget;
