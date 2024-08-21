describe('SearchTweets Component', () => {
  beforeEach(() => {
    const appHost = Cypress.env('APP_HOST') || 'http://localhost:5173';
    cy.visit(`${appHost}/profile`);

    cy.intercept('GET', '/users', {
      statusCode: 200,
      body: [
        {
          displayName: 'John Doe',
          telegram: '@johndoe',
          avatar: 'http://example.com/avatar.jpg',
          tweets: [
            { text: 'This is a tweet containing the letter a' },
            { text: 'Another tweet without the letter' },
          ],
        },
      ],
    });
  });

  it('should navigate to the explore page with search results when clicking on a result', () => {
    cy.get('input[placeholder="Search Tweets"]').type('a');
    cy.get('[data-testid="search"]').click();
    cy.get('[data-testid="result"]').should('exist');
    cy.get('[data-testid="result"]').first().click();
    cy.url().should('include', '/explore');
  });
});
