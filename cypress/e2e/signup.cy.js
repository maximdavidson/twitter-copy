describe('Sign Up Flow', () => {
  beforeEach(() => {
    // Задаем базовый URL приложения
    const appHost = Cypress.env('APP_HOST') || 'http://localhost:5173';
    cy.visit(`${appHost}/signup`);

    // Мокируем запрос к Firebase для регистрации пользователя
    cy.intercept(
      'POST',
      '**/identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAU3xiBKNKJh-HX23YKgEL8HytUDc225tE',
      (req) => {
        req.reply({
          statusCode: 200,
          body: {
            email: 'testuser@example.com',
          },
        });
      },
    ).as('signUpUserWithEmail');
  });

  it('should successfully sign up a user', () => {
    // Заполняем форму регистрации
    cy.get('input[placeholder="Name"]').type('Test User');
    cy.get('input[placeholder="Email"]').type('testuser@example.com');
    cy.get('input[placeholder="Password"]').type('password123');

    // Выбираем дату рождения
    cy.get('select[name="month"]').select('January');
    cy.get('select[name="day"]').select('1');
    cy.get('select[name="year"]').select('2000');

    // Нажимаем на кнопку для регистрации
    cy.get('button[type="submit"]').click();

    // Ожидаем завершения запроса регистрации
    cy.wait('@signUpUserWithEmail');
  });
});
