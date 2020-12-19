describe('Login check', () => {
	it('Login check', () => {
		cy.visit('http://localhost:3000/login/', {
			auth: {
				username: 'kmc@gmail.com',
				password: '123456',
			},
		});
	});
});
