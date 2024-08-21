describe('SearchUsers Component', () => {
  beforeEach(() => {
    const appHost = Cypress.env('APP_HOST') || 'http://localhost:5173';
    cy.visit(`${appHost}/home`);

    cy.intercept('GET', '/users', {
      statusCode: 200,
      body: [
        {
          displayName: 'Jane Doe',
          telegram: '@janedoe',
          avatar: 'http://example.com/avatar.jpg',
          tweets: [],
        },
      ],
    });
  });

  it('should navigate to the users page with search results when clicking on a result', () => {
    cy.get('input[placeholder="Search Users"]').type('a');

    cy.get('[data-testid="search"]').click();

    cy.get('[data-testid="result"]').should('exist');

    cy.get('[data-testid="result"]').first().click();

    cy.url().should('include', '/users');
  });
});
