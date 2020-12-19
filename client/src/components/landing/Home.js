import React from 'react';
import './styles.css';

const Home = () => {
	const homeLayout = () => (
		<div className="container">
			<header class="heading">
				<h2>Personal Budget</h2>
				<p>The simplest tool to track your expenses monthly</p>
				<img
					src="./assets/bg.png"
					alt="heading"
					class="heading-image"
				/>
			</header>
		</div>
	);
	return <React.Fragment>{homeLayout()}</React.Fragment>;
};

export default Home;
