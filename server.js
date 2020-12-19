const cookieParser = require('cookie-parser');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const compression = require('compression');
require('dotenv').config();
const auth = require('./routes/api/auth');
const budget = require('./routes/api/budget');
const expense = require('./routes/api/expense');
const PORT = process.env.PORT || 5000;
const path = require('path');

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to Database

mongoose
	.connect(process.env.MONGODB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: true,
	})
	.then(() => {
		console.log('Connected to Database');
	})
	.catch((err) => {
		console.log(err);
	});

// Compression Middlware
app.use(compression());

// Morgan Middleware
app.use(morgan('dev'));

// Cookie Parsor Middleware
app.use(cookieParser());

// Cors Middleware
app.use(cors());

// Route Middleware
app.use('/api/auth', auth);
app.use('/api/budget', budget);
app.use('/api/expense', expense);

// Server Static Assets in Production
if (process.env.NODE_ENV === 'production') {
	// Set Static Folder
	app.use(express.static('client/build'));
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}

// Static Middleware
app.use(express.static('public'));

// Listening on Port 5000
app.listen(PORT, (req, res) => {
	console.log(`Server Running on Port: ${PORT}`);
});
