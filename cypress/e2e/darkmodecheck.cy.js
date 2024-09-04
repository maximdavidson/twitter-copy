describe('Header Component', () => {
  beforeEach(() => {
    const appHost = Cypress.env('APP_HOST') || 'http://localhost:5173';
    cy.visit(`${appHost}/home`);
  });

  it('should toggle theme when clicking the theme switch', () => {
    cy.get('body').should('have.attr', 'data-theme', 'light');

    cy.get('[data-testid="switch"]').click();

    cy.get('body').should('have.attr', 'data-theme', 'dark');

    cy.get('[data-testid="switch"]').click();

    cy.get('body').should('have.attr', 'data-theme', 'light');
  });

  it('should navigate to profile when clicking the arrow icon', () => {
    cy.get('img[alt="Exit Arrow"]').click();

    cy.url().should('include', '/profile');
  });
});
