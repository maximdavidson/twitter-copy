describe('Navigation Component', () => {
  beforeEach(() => {
    const appHost = Cypress.env('APP_HOST') || 'http://localhost:5173';
    cy.visit(`${appHost}/profile`);
  });

  it('should open the tweet modal when clicking the Tweet button', () => {
    cy.get('button').contains('Tweet').click({ force: true });

    cy.get('[data-testid="modal"]').should('be.visible');
  });

  it('should log out when clicking the Log out button', () => {
    cy.get('a').contains('Log out').click({ force: true });

    cy.url().should('include', '/');
  });
});
