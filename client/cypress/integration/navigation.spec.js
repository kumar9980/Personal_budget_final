context('Home', () => {
	beforeEach(() => {
		cy.visit('http://localhost:3000/login');
	});

	it('should have Login to your Account in the h1 tag', () => {
		cy.get('h3').contains('Login to your Account');
	});
});
