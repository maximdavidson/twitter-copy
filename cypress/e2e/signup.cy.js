describe('Sign Up Flow', () => {
  beforeEach(() => {
    const appHost = Cypress.env('APP_HOST') || 'http://localhost:5173';
    cy.visit(`${appHost}/`);

    // Мокирование вызова Firebase Authentication
    cy.intercept('POST', '**/identitytoolkit/v3/relyingparty/signupNewUser**', {
      statusCode: 200,
      body: {
        idToken: 'test-id-token',
        email: 'testuser@example.com',
        refreshToken: 'test-refresh-token',
        expiresIn: '3600',
        localId: 'test-uid',
      },
    }).as('firebaseSignUp');

    // Мокирование вызова Firebase Firestore для создания профиля
    cy.intercept('POST', '**/databases/*/documents/users**', {
      statusCode: 200,
      body: {
        name: 'projects/your-project-id/databases/(default)/documents/users/test-uid',
        fields: {
          displayName: { stringValue: 'Test User' },
          email: { stringValue: 'testuser@example.com' },
        },
        createTime: '2023-09-01T00:00:00.000Z',
        updateTime: '2023-09-01T00:00:00.000Z',
      },
    }).as('createUserProfile');
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

    // Ожидание завершения запросов
    cy.wait('@firebaseSignUp');
    cy.wait('@createUserProfile');

    // Проверка, что произошел переход на страницу логинации
    cy.url().should('include', '/login');
  });
});
