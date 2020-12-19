import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { getBudgetChart } from '../../actions/apiCore';
import { isAuthenticated } from '../../actions/auth';

const BudgetLineChart = () => {
	const { user, token } = isAuthenticated();
	const [chartBudget, setChartBudget] = useState({
		budget: [],
		capacity: [],
		title: [],
	});
	const month = new Date().getMonth() + 1;
	const getChartBudgets = (userId, token, month) => {
		getBudgetChart(userId, token, month)
			.then((res) => {
				setChartBudget({
					...chartBudget,
					budget: res.map((data) => {
						return data.budget;
					}),
					capacity: res.map((data) => {
						return data.capacity;
					}),
					title: res.map((data) => {
						return data.name;
					}),
				});
			})
			.catch((err) => console.log(err));
	};

	const { budget, capacity, title } = chartBudget;

	const data = {
		labels: title,
		datasets: [
			{
				label: 'Budget',
				data: budget,
				backgroundColor: 'rgba(200, 200, 180, 0.7)',
				hoverBackgroundColor: 'rgba(200, 200, 180, 0.7)',
				hoverBorderWidth: 2,
				hoverBorderColor: 'red',
			},
			{
				label: 'Expense',
				data: capacity,
				backgroundColor: 'rgba(1, 47, 90, 0.7)',
				hoverBackgroundColor: 'rgba(1, 47, 90, 0.7)',
				hoverBorderWidth: 2,
				hoverBorderColor: 'red',
			},
		],
	};

	let options = {
		maintainAspectRatio: false,
		animation: {
			duration: 10,
		},
		scales: {
			xAxes: [
				{
					stacked: true,
					gridLines: { display: false },
				},
			],
			yAxes: [
				{
					stacked: false,
					ticks: {
						beginAtZero: true,
					},
				},
			],
		}, // scales
		legend: { display: true },
	}; // options

	useEffect(() => {
		getChartBudgets(user._id, token, month);
	}, []);

	return <Line data={data} width={400} height={400} options={options} />;
};

export default BudgetLineChart;
