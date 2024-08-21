describe('Sign Up Flow', () => {
  beforeEach(() => {
    const appHost = Cypress.env('APP_HOST') || 'http://localhost:5173';
    cy.visit(`${appHost}/`);
  });

  it('should successfully sign up a user', () => {
    cy.contains('Sign up with email').click();
    cy.get('form').should('be.visible');

    cy.get('input[placeholder="Name"]').type('Test User');
    cy.get('input[placeholder="Email"]').type('testuser@example.com');
    cy.get('input[placeholder="Password"]').type('password123');

    cy.get('select[name="month"]').select('January');
    cy.get('select[name="day"]').select('1');
    cy.get('select[name="year"]').select('2000');

    cy.get('button[type="submit"]').click();
  });
});
