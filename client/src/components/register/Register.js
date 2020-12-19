import React, { useState } from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import classnames from 'classnames';
import { authenticate } from '../../actions/auth';
import './styles.css';

const Register = () => {
	const [input, setInput] = useState({
		name: '',
		email: '',
		password: '',
		password2: '',
		errors: '',
		redirect: false,
	});

	const { name, email, password, password2, errors, redirect } = input;

	const handleChange = (name) => (event) => {
		setInput({ ...input, errors: false, [name]: event.target.value });
	};

	const registerUser = (event) => {
		event.preventDefault();
		register({ name, email, password, password2 });
	};

	const register = (user) => {
		console.log('inside register func');
		return axios
			.post('/api/auth/register', user)
			.then((res) => {
				console.log('res ', res);
				authenticate(res.data, () => {
					setInput({
						...input,
						redirect: true,
					});
				});
			})
			.catch((err) => {
				console.log('in error catch');
				setInput({ ...input, errors: err.response.data });
			});
	};

	const redirectUser = () => {
		if (redirect) {
			return <Redirect to="/user/dashboard" />;
		}
	};

	const registerLayout = () => (
		<section class="register-card">
			<div className="register-content">
				<div className="register-heading">
					<h3>Create an Account</h3>
				</div>
				<div className="register-form">
					<form
						className="form-content"
						noValidate
						onSubmit={registerUser}
					>
						<div className="form-group">
							<input
								type="text"
								id="name"
								name="name"
								onChange={handleChange('name')}
								className={classnames('form-control', {
									'is-invalid': errors.name,
								})}
								placeholder="Name"
								required
							/>
							<label for="name" className="form-label">
								Name
							</label>
							{errors.name && (
								<div
									className="invalid_register"
									data-error={errors.name}
								></div>
							)}
						</div>
						<div className="form-group">
							<input
								type="text"
								id="email"
								name="email"
								onChange={handleChange('email')}
								className={classnames('form-control', {
									'is-invalid': errors.email,
								})}
								placeholder="Email"
								required
							/>
							<label for="email" className="form-label">
								Email
							</label>
							{errors.email && (
								<div
									className="invalid_register"
									data-error={errors.email}
								></div>
							)}
						</div>

						<div className="form-group">
							<input
								type="password"
								onChange={handleChange('password')}
								className={classnames('form-control', {
									'is-invalid': errors.password,
								})}
								placeholder="Password"
								name="password"
								id="password"
								required
							/>
							<label for="password" className="form-label">
								Password
							</label>
							{errors.password && (
								<div
									className="invalid_register"
									data-error={errors.password}
								></div>
							)}
						</div>
						<div class="form-group">
							<input
								type="password"
								onChange={handleChange('password2')}
								className={classnames('form-control', {
									'is-invalid': errors.password2,
								})}
								placeholder="Password2"
								name="password2"
								id="password2"
								required
							/>
							<label for="password2" className="form-label">
								Confirm Password
							</label>
							{errors.password2 && (
								<div
									className="invalid_register"
									data-error={errors.password2}
								></div>
							)}
						</div>
						<input
							type="submit"
							value="Register"
							className="submit-button"
						/>
					</form>
				</div>
			</div>
		</section>
	);
	return (
		<React.Fragment>
			{registerLayout()}
			{redirectUser()}
		</React.Fragment>
	);
};

export default Register;
