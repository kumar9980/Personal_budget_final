const User = require('../models/User');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const validator = require('validator');

let refreshTokens = [];

const isEmpty = (value) => {
	return (
		value === undefined ||
		value === null ||
		(typeof value === 'object' && Object.keys(value).length === 0) ||
		(typeof value === 'string' && value.trim().length === 0)
	);
};

function validateRegisterInput(data) {
	let errors = {};

	data.name = !isEmpty(data.name) ? data.name : '';
	data.email = !isEmpty(data.email) ? data.email : '';
	data.password = !isEmpty(data.password) ? data.password : '';
	data.password2 = !isEmpty(data.password2) ? data.password2 : '';

	if (!validator.isLength(data.name, { min: 2, max: 30 })) {
		errors.name = 'Name must be between 2 and 30 characters';
	}

	if (validator.isEmpty(data.name)) {
		errors.name = 'Name field is required';
	}

	if (!validator.isEmail(data.email)) {
		errors.email = 'Email is invalid';
	}

	if (validator.isEmpty(data.email)) {
		errors.email = 'Email field is required';
	}

	if (!validator.isLength(data.password, { min: 6, max: 30 })) {
		errors.password = 'Password must be between 6 and 30 characters';
	}

	if (validator.isEmpty(data.password)) {
		errors.password = 'Password field is required';
	}

	if (!validator.equals(data.password, data.password2)) {
		errors.password2 = 'Passwords must match';
	}

	if (validator.isEmpty(data.password2)) {
		errors.password2 = 'Confirm Password field is required';
	}

	return {
		errors,
		isValid: isEmpty(errors),
	};
}

function validateLoginInput(data) {
	let errors = {};

	data.email = !isEmpty(data.email) ? data.email : '';
	data.password = !isEmpty(data.password) ? data.password : '';

	if (!validator.isEmail(data.email)) {
		errors.email = 'Email is invalid';
	}

	if (validator.isEmpty(data.email)) {
		errors.email = 'Email field is required';
	}

	if (!validator.isLength(data.password, { min: 6, max: 30 })) {
		errors.password = 'Password must be between 6 and 30 characters';
	}

	if (validator.isEmpty(data.password)) {
		errors.password = 'Password field is required';
	}

	return {
		errors,
		isValid: isEmpty(errors),
	};
}

// Generate Access Token
const generateAccessToken = (user) => {
	return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '10000s' });
};

// Register User
exports.register = (req, res) => {
	const { errors, isValid } = validateRegisterInput(req.body);
	// Check Validation
	if (!isValid) {
		return res.status(400).json(errors);
	}

	User.findOne({ email: req.body.email }).then((user) => {
		if (user) {
			errors.email = 'Email already registered';
			return res.status(403).json(errors);
		} else {
			const newUser = new User({
				name: req.body.name,
				email: req.body.email,
				password: req.body.password,
				phone: req.body.phone,
			});

			newUser
				.save()
				.then((user) => {
					user.salt = undefined;
					user.hashed_password = undefined;

					const payload = {
						id: user._id,
						name: user.name,
						email: user.email,
					};
					// Sign Token
					const accessToken = generateAccessToken(payload);
					const refreshToken = jwt.sign(
						payload,
						process.env.REFRESH_TOKEN,
						{
							expiresIn: '1w',
						}
					);
					refreshTokens.push(refreshToken);
					res.cookie('token', accessToken);
					// Return user and token to client
					const { _id, name, email } = user;
					return res.json({
						success: true,
						user: { _id, name, email },
						token: `Bearer ${accessToken}`,
						refresh: refreshToken,
					});
				})
				.catch((err) => console.log(err));
		}
	});
};

// Login User
exports.login = (req, res) => {
	const { errors, isValid } = validateLoginInput(req.body);

	if (!isValid) {
		return res.status(400).json(errors);
	}

	const email = req.body.email;
	const password = req.body.password;
	// Find the user by email
	User.findOne({ email }).then((user) => {
		// Check for User
		if (!user) {
			errors.email = 'User not found';
			return res.status(400).json(errors);
		} else {
			// Check for Password
			if (!user.authenticate(password)) {
				errors.password = 'Incorrect Password';
				return res.status(400).json(errors);
			}
			// Generate a token for authentication
			const payload = {
				id: user._id,
				name: user.name,
				email: user.email,
			};
			const accessToken = generateAccessToken(payload);
			const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN);
			refreshTokens.push(refreshToken);
			res.cookie('token', accessToken);
			// Return user and token to client
			const { _id, name, email } = user;
			return res.json({
				success: true,
				user: { _id, name, email },
				token: `Bearer ${accessToken}`,
				refresh: refreshToken,
			});
		}
	});
};

// New Token Generation
exports.token = (req, res) => {
	const refreshToken = req.body.token;
	if (!refreshToken) {
		return res.status(401).json({
			errors: 'Refresh Token Not Found',
		});
	}
	if (!refreshTokens.includes(refreshToken)) {
		return res.status(403).json({
			errors: 'Invalid Refresh Token',
		});
	}
	jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, user) => {
		if (err) {
			return res.status(403).json({
				errors: err,
			});
		}
		console.log(user);
		const accessToken = generateAccessToken({
			id: user.id,
			name: user.name,
			email: user.email,
		});
		res.cookie('token', accessToken);
		const { id, name, email } = user;
		return res.json({
			success: true,
			user: { _id: id, name, email },
			token: `Bearer ${accessToken}`,
		});
	});
};

// Logout User
exports.logout = (req, res) => {
	res.clearCookie('token');
	res.json({
		message: 'Logout Successful',
	});
};

// Login Check
exports.protect = expressJwt({
	secret: process.env.JWT_SECRET,
	userProperty: 'auth',
	algorithms: ['HS256'],
});

// User Authentication
exports.isAuth = (req, res, next) => {
	let user = req.profile && req.auth && req.profile._id == req.auth.id;
	if (!user) {
		return res.status(403).json({
			errors: 'Access Denied! Unauthorized User',
		});
	}
	next();
};

// Token Authentication
exports.authToken = (req, res, next) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];
	if (!token) {
		return res.status(401).json({
			errors: 'Token expired',
		});
	}
	jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
		if (err) {
			return res.status(403).json({
				errors: err,
			});
		}
		req.user = user;
		next();
	});
};
