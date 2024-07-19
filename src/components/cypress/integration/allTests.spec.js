// cypress/integration/allTests.spec.js

describe('E2E Tests', () => {

    beforeEach(() => {
      // Vous pouvez ajouter ici des actions communes à tous les tests, comme la connexion
      // ou le nettoyage des données.
    });
  
    // Test de connexion et déconnexion
    it('should login and logout successfully', () => {
      cy.visit('/login');
  
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('input[name="password"]').type('password');
      cy.get('button[type="submit"]').click();
  
      cy.url().should('include', '/profile');
      cy.contains('Welcome, test@example.com');
  
      cy.get('button.logout').click();
      cy.url().should('include', '/login');
    });
  
    // Test de création de ticket
    it('should create a new ticket', () => {
      cy.login(); // Assurez-vous d'avoir une commande personnalisée pour la connexion
  
      cy.visit('/profile');
  
      cy.get('input[name="boardName"]').type('Test Board');
      cy.get('button.create-board').click();
  
      cy.contains('Test Board');
  
      cy.visit('/trello-board/test-board-id'); // Remplacez par l'ID de la board créée
      cy.get('input[name="title"]').type('Test Ticket');
      cy.get('textarea[name="description"]').type('This is a test ticket');
      cy.get('select[name="priority"]').select('High');
      cy.get('input[name="assignedTo"]').type('test@example.com');
      cy.get('button[type="submit"]').click();
  
      cy.contains('Test Ticket');
    });
  
    // Test de changement de thème
    it('should change the theme', () => {
      cy.login(); // Assurez-vous d'avoir une commande personnalisée pour la connexion
  
      cy.visit('/settings');
  
      cy.contains('Theme 1').click();
      cy.get('body').should('have.css', 'background-image', 'url("/images/image1.jpg")');
      cy.get('.navbar').should('have.css', 'background-color', 'rgb(248, 249, 250)');
  
      cy.contains('Theme 2').click();
      cy.get('body').should('have.css', 'background-image', 'url("/images/image2.png")');
      cy.get('.navbar').should('have.css', 'background-color', 'rgb(0, 56, 255)');
    });
  
    // Test d'accès aux pages protégées
    it('should redirect to login if not authenticated', () => {
      cy.visit('/profile');
      cy.url().should('include', '/login');
    });
  
    it('should allow access to protected pages if authenticated', () => {
      cy.login(); // Assurez-vous d'avoir une commande personnalisée pour la connexion
  
      cy.visit('/profile');
      cy.url().should('include', '/profile');
      cy.contains('Welcome, test@example.com');
    });
  });
  