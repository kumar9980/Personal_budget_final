import React, { useState } from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import classnames from 'classnames';
import { isAuthenticated, authenticate } from '../../actions/auth';
import './styles.css';

const Login = () => {
	const [input, setInput] = useState({
		email: '',
		password: '',
		errors: '',
	});

	const { email, password, errors } = input;

	const handleChange = (name) => (event) => {
		setInput({ ...input, errors: false, [name]: event.target.value });
	};

	const login = (user) => {
		return axios
			.post('/api/auth/login', user)
			.then((res) => {
				authenticate(res.data, () => {
					setInput({
						...input,
					});
				});
			})
			.catch((err) => {
				setInput({ ...input, errors: err.response.data });
			});
	};

	const loginUser = (event) => {
		event.preventDefault();
		login({ email, password });
	};

	const redirectUser = () => {
		if (isAuthenticated()) {
			return <Redirect to="/user/dashboard" />;
		}
	};

	const loginLayout = () => (
		<section class="login-card">
			<div class="login-content">
				<div class="login-heading">
					<h3>Login to your Account</h3>
				</div>
				<div class="login-form">
					<form class="form-content" noValidate onSubmit={loginUser}>
						<div class="form-group">
							<input
								type="text"
								id="email"
								name="email"
								onChange={handleChange('email')}
								className={classnames('form-control', {
									invalid_feedback: errors.email,
								})}
								placeholder="Email"
								required
							/>
							<label for="email" class="form-label">
								Email
							</label>
							{errors.email && (
								<div
									class="invalid_feedback"
									data-error={errors.email}
								></div>
							)}
						</div>

						<div class="form-group">
							<input
								type="password"
								placeholder="Password"
								name="password"
								id="password"
								onChange={handleChange('password')}
								className={classnames('form-control', {
									'is-invalid': errors.password,
								})}
								required
							/>
							<label for="password" class="form-label">
								Password
							</label>
							{errors.password && (
								<div
									class="invalid_feedback"
									data-error={errors.password}
								></div>
							)}
						</div>
						<input
							type="submit"
							value="Login"
							class="submit-button"
						/>
					</form>
				</div>
			</div>
		</section>
	);

	return (
		<React.Fragment>
			{loginLayout()}
			{redirectUser()}
		</React.Fragment>
	);
};

export default Login;
