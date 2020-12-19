const express = require('express');
const router = express.Router();
const Budget = require('../../models/Budget');
const User = require('../../models/User');
const { protect, isAuth, authToken } = require('../../config/auth');

const fs = require('fs');

// @route GET /api/budget/:budgetId
// @desc Get budget route
// @access Private
const getBudget = (req, res) => {
	Budget.findOne({ user: req.profile._id, _id: req.budget._id }).then(
		(budget) => {
			if (!budget) {
				return res.status(400).json({
					errors: 'Budget Not Found',
				});
			} else {
				return res.json(budget);
			}
		}
	);
};
router.get('/:budgetId/:id', protect, isAuth, authToken, getBudget);

// @route POST /api/budget/create
// @desc Create budget route
// @access Private
const createBudget = (req, res) => {
	const today = new Date();
	Budget.findOne({
		user: req.params.id,
		name: req.body.name,
		month: req.body.month,
	}).then((budget) => {
		if (budget) {
			return res.status(400).json({
				errors: 'Budget Already Exists',
			});
		} else {
			const budget = new Budget({
				name: req.body.name,
				budget: req.body.budget,
				user: req.params.id,
				month: req.body.month,
			});
			budget
				.save()
				.then((budget) => {
					if (!budget) {
						return res.status(400).json({
							errors: 'Budget not created',
						});
					} else {
						return res.json(budget);
					}
				})
				.catch((err) => console.log(err));
		}
	});
};
router.post('/create/:id', protect, isAuth, authToken, createBudget);

// @route PUT /api/budget/:budgetId/:id
// @desc Update budget route
// @access Private
const updateBudget = (req, res) => {
	Budget.findOne({ name: req.body.name }).then((budget) => {
		if (budget) {
			return res.status(400).json({
				errors: 'Budget Already Exists',
			});
		} else {
			Budget.updateOne(
				{ _id: req.budget._id },
				req.body,
				(err, budget) => {
					if (err) {
						return res.status(400).json({
							errors: 'Budget not updated',
						});
					}
					return res.json(budget);
				}
			);
		}
	});
};
router.put('/:budgetId/:id', protect, isAuth, authToken, updateBudget);

// @route DELETE /api/budget/:budgetId/:id
// @desc Delete budget route
// @access Private
const deleteBudget = (req, res) => {
	const budget = req.budget;
	budget.deleteOne((err, budget) => {
		if (err) {
			return res.status(400).json({
				errors: 'Budget not deleted',
			});
		}
		return res.json({
			message: 'Budget Deleted',
		});
	});
};
router.delete('/:budgetId/:id', protect, isAuth, authToken, deleteBudget);

// @route GET /api/budget/all/budget
// @desc Get all budget route
// @access Public
const getAllBudgets = (req, res) => {
	let order = req.query.order ? req.query.order : 'asc';
	let sortBy = req.query.sortBy ? req.query.sortBy : 'createdAt';
	Budget.find({ user: req.params.id })
		.sort([[sortBy, order]])
		.exec((err, budgets) => {
			if (err) {
				return res.status(400).json({
					errors: err,
				});
			}
			return res.json(budgets);
		});
};
router.get('/all/budget/:id', protect, isAuth, authToken, getAllBudgets);

// @route GET /api/budget/sum/:id
// @desc Get budget sum route
// @access Public
const getTotal = (req, res) => {
	Budget.aggregate(
		[
			{
				$match: { user: req.profile._id },
			},
			{
				$group: {
					_id: null,
					total: {
						$sum: '$budget',
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
router.get('/sum/budget/:id', protect, isAuth, authToken, getTotal);

// @route GET /api/budget/month/:id
// @desc Get budget based on month route
// @access Public
const monthBudget = (req, res) => {
	Budget.aggregate(
		[
			{
				$match: { user: req.profile._id },
			},
			{
				$group: {
					_id: { $month: '$month' },
					total: {
						$sum: '$budget',
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

router.get('/month/budget/:id', protect, isAuth, authToken, monthBudget);

// @route GET /api/budget/month/chart/:id
// @desc Get budget based on month route
// @access Public
const getBudgetChart = (req, res) => {
	const month = parseInt(req.query.month);
	const year = parseInt(req.query.year);
	Budget.aggregate(
		[
			{
				$project: {
					doc: '$$ROOT',
					year: { $year: '$month' },
					month: { $month: '$month' },
				},
			},
			{ $match: { month: month, year: year } },
		],
		(err, budgets) => {
			if (err) {
				return res.status(400).json({
					errors: err,
				});
			}
			return res.json(budgets);
		}
	);
};
router.get('/month/chart/:id', protect, isAuth, authToken, getBudgetChart);

// @route PARAM id
// @desc Get User By Id
// @access Public
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
router.param('id', userById);

// @route PARAM budgetId
// @desc Get Budget By Id
// @access Public
const budgetById = (req, res, next, id) => {
	Budget.findById(id).exec((err, budget) => {
		if (err) {
			return res.status(400).json({
				error: 'Budget not found',
			});
		}
		req.budget = budget;
		next();
	});
};

router.param('budgetId', budgetById);

module.exports = router;
