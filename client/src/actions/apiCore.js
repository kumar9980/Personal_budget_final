import axios from 'axios';

// Add Budget
export const addBudget = (id, data, token) => {
	return axios
		.post(`/api/budget/create/${id}`, data, {
			headers: {
				Authorization: token,
			},
		})
		.then(() => {
			return {
				success: true,
			};
		})
		.catch((err) => console.log(err));
};

// Get All Budgets
export const getBudgets = (id, token) => {
	return axios
		.get(`/api/budget/all/budget/${id}`, {
			headers: {
				Authorization: token,
			},
		})
		.then((res) => {
			return res.data;
		})
		.catch((err) => console.log(err));
};

export const getSomeBudgets = (id, token) => {
	return axios
		.get(`/api/budget/all/budget/${id}?limit=3`, {
			headers: {
				Authorization: token,
			},
		})
		.then((res) => {
			return res.data;
		})
		.catch((err) => console.log(err));
};

export const getBudgetChart = (id, token) => {
	return axios
		.get(`/api/budget/all/budget/${id}?order=desc`, {
			headers: {
				Authorization: token,
			},
		})
		.then((res) => {
			return res.data;
		})
		.catch((err) => console.log(err));
};

export const getChartExpenses = (id, token) => {
	return axios
		.get(`/api/expense/all/expense/${id}?sortBy=expense&order=desc`, {
			headers: {
				Authorization: token,
			},
		})
		.then((res) => {
			return res.data;
		})
		.catch((err) => console.log(err));
};

// Add Expense
export const addExpense = (id, data, token) => {
	return axios
		.post(`/api/expense/create/${id}`, data, {
			headers: {
				Authorization: token,
			},
		})
		.then((res) => {
			return {
				success: true,
			};
		})
		.catch((err) => {
			if (err.response) {
				return err.response.data;
			}
		});
};

// Get All Expenses
export const getAllExpenses = (id, token) => {
	return axios
		.get(`/api/expense/all/expense/${id}`, {
			headers: {
				Authorization: token,
			},
		})
		.then((res) => {
			return res.data;
		})
		.catch((err) => console.log(err));
};

// Get All Expenses
export const getSomeExpenses = (id, token) => {
	return axios
		.get(`/api/expense/all/expense/${id}?limit=3`, {
			headers: {
				Authorization: token,
			},
		})
		.then((res) => {
			return res.data;
		})
		.catch((err) => console.log(err));
};

// Delete Expense
export const deleteExpense = (id, expenseId, token) => {
	return axios
		.delete(`/api/expense/${expenseId}/${id}`, {
			headers: {
				Authorization: token,
			},
		})
		.then((res) => {
			return {
				success: true,
			};
		})
		.catch((err) => console.log(err));
};

// Get Budget Total
export const budgetTotal = (id, token) => {
	return axios
		.get(`/api/budget/sum/budget/${id}`, {
			headers: {
				Authorization: token,
			},
		})
		.then((res) => {
			return res.data[0].total;
		})
		.catch((err) => console.log(err));
};

// Get Expense Total
export const expenseTotal = (id, token) => {
	return axios
		.get(`/api/expense/sum/expense/${id}`, {
			headers: {
				Authorization: token,
			},
		})
		.then((res) => {
			return res.data[0].total;
		})
		.catch((err) => console.log(err));
};

// Get Budget Based on Month
export const monthlyBudget = (id, token) => {
	return axios
		.get(`/api/budget/month/budget/${id}`, {
			headers: {
				Authorization: token,
			},
		})
		.then((res) => {
			return res.data;
		})
		.catch((err) => console.log(err));
};
