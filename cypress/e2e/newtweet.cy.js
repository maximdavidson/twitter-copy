describe('NewTweetInput Component', () => {
  beforeEach(() => {
    const appHost = Cypress.env('APP_HOST') || 'http://localhost:5173';
    cy.visit(`${appHost}/profile`);
  });

  it('should successfully add a new tweet', () => {
    cy.get('input[placeholder="What\'s happening?"]')
      .scrollIntoView()
      .should('be.visible')
      .type('New tweet text');

    cy.get('[data-testid="tweet-button"]').click();

    cy.contains('New tweet text').should('be.visible');
  });

  it('should successfully delete a tweet', () => {
    cy.get('input[placeholder="What\'s happening?"]').scrollIntoView().should('be.visible');

    cy.get('[data-testid="tweet-button"]').click();

    cy.get('[data-testid="more"]').first().click();

    cy.get('[data-testid="delete"]').contains('Delete').click();
  });
});
