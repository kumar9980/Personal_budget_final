import React from 'react';
import moment from 'moment';
import jwt from 'jsonwebtoken';
import { Link, withRouter } from 'react-router-dom';
import {
	isAuthenticated,
	logout,
	getNewAccessToken,
	authenticate_access,
} from '../../../actions/auth';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import './styles.css';

const Navbar = ({ history }) => {
	const [open, setOpen] = React.useState(false);

	function expire() {
		if (isAuthenticated()) {
			console.log(isAuthenticated);
			const { token } = isAuthenticated();
			console.log(token);
			let jwtToken = token.split(' ')[1];
			jwt.verify(jwtToken, 'budget is personal', function (err, decoded) {
				if (err) {
					logout(() => {
						history.push('/');
					});
					window.location.reload();
				} else {
					let tokenExpiration = decoded.exp;
					let tokenExpirationTimeInSeconds =
						tokenExpiration - moment(Math.floor(Date.now() / 1000));
					if (
						tokenExpiration &&
						tokenExpirationTimeInSeconds === 20
					) {
						setOpen(true);
					}
				}
			});
		}
	}

	const getAccess = () => {
		getNewAccessToken().then((data) => {
			localStorage.removeItem('token');
			authenticate_access(data, () => {
				setOpen(false);
			});
		});
	};

	// setTimeout(() => {
	//   setInterval(() => {
	//     expire();
	//   }, 5000);
	// }, 10000);

	return (
		<div className="container">
			<Modal
				basic
				onClose={() => setOpen(false)}
				onOpen={() => setOpen(true)}
				open={open}
				size="small"
			>
				<Header icon>
					<Icon name="archive" />
					JWT Expiration
				</Header>
				<Modal.Content>
					<p>
						JWT Token is About to Expire in 20 Seconds. Do you want
						to refresh and continue using the Application?
					</p>
				</Modal.Content>
				<Modal.Actions>
					<Button
						color="green"
						inverted
						onClick={() => {
							getAccess();
						}}
					>
						<Icon name="checkmark" /> Yes
					</Button>
					<Button
						basic
						color="red"
						inverted
						onClick={() => setOpen(false)}
					>
						<Icon name="remove" /> No
					</Button>
				</Modal.Actions>
			</Modal>
			<nav class="main-nav">
				<ul class="main-menu">
					{!isAuthenticated() && (
						<li>
							<Link to="/">Home</Link>
						</li>
					)}
				</ul>
				<ul class="right-menu">
					{!isAuthenticated() && (
						<React.Fragment>
							<li>
								<Link to="/login">Login</Link>
							</li>
							<li>
								<Link to="/register">Register</Link>
							</li>
						</React.Fragment>
					)}
					{isAuthenticated() && (
						<React.Fragment>
							<li>
								<span
									style={{
										cursor: 'pointer',
										color: '#000000',
									}}
									onClick={() =>
										logout(() => {
											history.push('/');
										})
									}
								>
									Logout
								</span>
							</li>
							<li>
								<span>
									<Link
										to="/user/dashboard"
										style={{
											cursor: 'pointer',
											color: '#000000',
										}}
									>
										Dashboard
									</Link>
								</span>
							</li>
						</React.Fragment>
					)}
				</ul>
			</nav>
		</div>
	);
};

export default withRouter(Navbar);
