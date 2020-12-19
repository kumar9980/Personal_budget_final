import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { getBudgetChart } from '../../actions/apiCore';
import { isAuthenticated } from '../../actions/auth';

const BudgetChart = () => {
	const { user, token } = isAuthenticated();
	const [chartBudget, setChartBudget] = useState({
		title: [],
		budget: [],
	});

	const month = new Date().getMonth() + 1;
	const getBudgetCharts = (userId, token, month) => {
		getBudgetChart(userId, token, month)
			.then((res) => {
				setChartBudget({
					...chartBudget,
					title: res.map((data) => {
						return data.name;
					}),
					budget: res.map((data) => {
						return data.budget;
					}),
				});
			})
			.catch((err) => console.log(err));
	};

	const { title, budget } = chartBudget;

	const data = {
		labels: title,
		datasets: [
			{
				data: budget,
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
		getBudgetCharts(user._id, token, month);
	}, []);

	return (
		<Pie
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

export default BudgetChart;
