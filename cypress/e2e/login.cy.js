describe('Login Flow', () => {
  beforeEach(() => {
    const appHost = Cypress.env('APP_HOST') || 'http://localhost:5173';
    cy.visit(`${appHost}/login`);
  });

  it('should successfully log in an existing user', () => {
    cy.get('input[placeholder="Email address"]').type('testuser@example.com');

    cy.get('input[placeholder="Password"]').type('password123');

    cy.get('button[type="submit"]').click();

    cy.url({ timeout: 10000 }).should('include', '/profile');
  });

  it('should show an error message for invalid credentials', () => {
    cy.get('input[placeholder="Email address"]').type('wronguser@example.com');

    cy.get('input[placeholder="Password"]').type('wrongpassword');

    cy.get('button[type="submit"]').click();

    cy.contains('Invalid email or password. Please try again.').should('be.visible');

    cy.url().should('include', '/login');
  });
});
