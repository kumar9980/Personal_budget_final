import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { monthlyBudget } from '../../actions/apiCore';
import { isAuthenticated } from '../../actions/auth';

const MonthChart = () => {
	const [month, setMonth] = useState([]);
	const { user, token } = isAuthenticated();

	const getMonthlyBudget = (userId, token) => {
		monthlyBudget(userId, token)
			.then((res) => {
				setMonth(res);
			})
			.catch((err) => console.log(err));
	};

	useEffect(() => {
		getMonthlyBudget(user._id, token);
	}, []);

	let monthlyData = Array.from(Array(12)).fill(0);
	month.map((item, i) => {
		monthlyData[parseInt(item._id) - 1] = parseInt(item.total);
	});

	const data = {
		labels: [
			'Jan',
			'Feb',
			'March',
			'April',
			'May',
			'June',
			'July',
			'Aug',
			'Sept',
			'Oct',
			'Nov',
			'Dec',
		],
		datasets: [
			{
				label: 'Monthly Budget',
				backgroundColor: [
					'#475B63',
					'#774936',
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
				borderColor: '#fff',
				borderWidth: 1,
				hoverBackgroundColor: [
					'#475B63',
					'#774936',
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
				hoverBorderColor: '#FFF',
				data: monthlyData,
			},
		],
	};

	return (
		<Bar
			data={data}
			width={400}
			height={400}
			options={{
				legend: {
					display: false,
				},
				responsive: true,
				maintainAspectRatio: false,
			}}
		/>
	);
};

export default MonthChart;
