import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { getChartExpenses } from '../../actions/apiCore';
import { isAuthenticated } from '../../actions/auth';

const ExpenseChart = () => {
	const { user, token } = isAuthenticated();
	const [chartExpense, setChartExpense] = useState({
		title: [],
		expense: [],
	});
	const getChartExpense = (userId, token) => {
		getChartExpenses(userId, token)
			.then((res) => {
				setChartExpense({
					...chartExpense,
					title: res.map((data) => {
						return data.name;
					}),
					expense: res.map((data) => {
						return data.expense;
					}),
				});
			})
			.catch((err) => console.log(err));
	};

	const { title, expense } = chartExpense;
	const data = {
		labels: title,
		datasets: [
			{
				data: expense,
				backgroundColor: [
					'#e1c904',
					'#a3d56c',
					'#57a092',
					'#e32b21',
					'#950231',
					'#119904',
					'#b3056c',
					'#c7cb92',
					'#a62b21',
					'#9ba231',
				],
			},
		],
	};

	useEffect(() => {
		getChartExpense(user._id, token);
	}, []);

	return (
		<Doughnut
			data={data}
			width={400}
			height={400}
			options={{
				responsive: true,
				maintainAspectRatio: false,
			}}
		/>
	);
};

export default ExpenseChart;
