const express = require('express');
const router = express.Router();
const Budget = require('../../models/Budget');
const Expense = require('../../models/Expense');
const User = require('../../models/User');
const { protect, isAuth, authToken } = require('../../config/auth');
const fs = require('fs');

// Get User By Id - Middleware
const userById = (req, res, next, id) => {
	User.findById(id).exec((err, user) => {
		if (err || !user) {
			return res.status(400).json({
				errors: 'User not found',
			});
		}
		req.profile = user;
		next();
	});
};

// @route GET /api/expense/:expenseId
// @desc Get expense route
// @access Private
const getExpense = (req, res) => {
	Expense.findOne({ user: req.params.id, _id: req.expense._id }).then(
		(expense) => {
			if (!expense) {
				return res.status(400).json({
					errors: 'Expense Not Found',
				});
			} else {
				return res.json(expense);
			}
		}
	);
};

router.get('/:expenseId/:id', protect, isAuth, authToken, getExpense);

// @route POST /api/expense/create
// @desc Create expense route
// @access Private
const createExpense = (req, res) => {
	Expense.findOne({ user: req.params.id, name: req.body.name }).then(
		(expense) => {
			if (expense) {
				return res.status(400).json({
					errors: 'Expense Already Exists',
				});
			} else {
				const expense = new Expense({
					name: req.body.name,
					expense: req.body.expense,
					budget: req.body.budget,
					user: req.params.id,
				});
				expense
					.save()
					.then((expense) => {
						if (!expense) {
							return res.status(400).json({
								errors: 'Expense not created',
							});
						} else {
							return res.json(expense);
						}
					})
					.catch((err) => {
						return res.status(400).json({
							errors: err,
						});
					});
			}
		}
	);
};
const increaseCapacity = (req, res, next) => {
	Budget.findOne({ _id: req.body.budget }).then((data) => {
		console.log(data);
		const id = req.body.budget;
		Budget.updateOne(
			{ _id: id },
			{ $inc: { capacity: req.body.expense } }
		).then((data) => {
			if (!data) {
				return res.status(400).json({
					errors: 'Not Updated',
				});
			}
			next();
		});
	});
};
router.post(
	'/create/:id',
	protect,
	isAuth,
	authToken,
	increaseCapacity,
	createExpense
);

// @route PUT /api/expense/:expenseId/:id
// @desc Update expense route
// @access Private
const updateExpense = (req, res) => {
	Expense.findOne({ user: req.params.id, name: req.body.name }).then(
		(expense) => {
			if (expense) {
				return res.status(400).json({
					errors: 'Expense Already Exists',
				});
			} else {
				Expense.updateOne(
					{ _id: req.expense._id },
					req.body,
					(err, expense) => {
						if (err) {
							return res.status(400).json({
								errors: 'Expense not updated',
							});
						}
						return res.json(expense);
					}
				);
			}
		}
	);
};
router.put('/:expenseId/:id', protect, isAuth, authToken, updateExpense);

// @route DELETE /api/expense/:expenseId/:id
// @desc Delete expense route
// @access Private
const deleteExpense = (req, res) => {
	const expense = req.expense;
	expense.deleteOne((err, expense) => {
		if (err) {
			return res.status(400).json({
				errors: 'Expense not deleted',
			});
		}
		return res.json({
			message: 'Expense Deleted',
		});
	});
};

const decreaseCapacity = (req, res, next) => {
	const expense = req.expense;
	const budgetId = expense.budget;
	Budget.findOne({ _id: budgetId }).then((data) => {
		Budget.updateOne(
			{ _id: budgetId },
			{ $inc: { capacity: -expense.expense } }
		).then((data) => {
			if (!data) {
				return res.status(400).json({
					errors: 'Not Updated',
				});
			}
			next();
		});
	});
};
router.delete(
	'/:expenseId/:id',
	protect,
	isAuth,
	authToken,
	decreaseCapacity,
	deleteExpense
);

// @route GET /api/expense/all/expense
// @desc Get all expense route
// @access Public
const getAllExpenses = (req, res) => {
	let errors = {};
	let order = req.query.order ? req.query.order : 'asc';
	let sortBy = req.query.sortBy ? req.query.sortBy : 'createdAt';
	Expense.find({ user: req.params.id })
		.populate('budget')
		.sort([[sortBy, order]])
		.exec((err, expenses) => {
			if (err) {
				errors.expense = 'Expense not found';
				return res.status(400).json(errors);
			}
			return res.json(expenses);
		});
};

router.get('/all/expense/:id', protect, isAuth, authToken, getAllExpenses);

// @route GET /api/expense/all/expense/:id/:budgetId
// @desc Get all expense based on budget route
// @access Public
const expenseBudget = (req, res) => {
	let errors = {};
	let order = req.query.order ? req.query.order : 'asc';
	Expense.find({ user: req.params.id, budget: req.params.budgetId })
		.populate('budget')
		.sort([[order]])
		.exec((err, expenses) => {
			if (err) {
				errors.expense = 'Expense not found';
				return res.status(400).json(errors);
			}
			return res.json(expenses);
		});
};
router.get(
	'/all/expense/:id/:budgetId',
	protect,
	isAuth,
	authToken,
	expenseBudget
);

// @route GET /api/expense/sum/expense/:id
// @desc Get expense sum route
// @access Public
const getTotal = (req, res) => {
	Expense.aggregate(
		[
			{
				$match: { user: req.profile._id },
			},
			{
				$group: {
					_id: null,
					total: {
						$sum: '$expense',
					},
				},
			},
		],
		(err, data) => {
			if (err) {
				return res.status(400).json({
					error: err,
				});
			}
			return res.json(data);
		}
	);
};
router.get('/sum/expense/:id', protect, isAuth, authToken, getTotal);

// @route PARAM id
// @desc Get User By Id
// @access Public
router.param('id', userById);

// @route PARAM budgetId
// @desc Get Budget By Id
// @access Public
const expenseById = (req, res, next, id) => {
	Expense.findById(id).exec((err, expense) => {
		if (err) {
			return res.status(400).json({
				error: 'Expense not found',
			});
		}
		req.expense = expense;
		next();
	});
};
router.param('expenseId', expenseById);

module.exports = router;
