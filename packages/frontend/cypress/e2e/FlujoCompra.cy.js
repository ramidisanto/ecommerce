describe('Flujo de Compra Real', () => {
  
  beforeEach(() => {
    cy.visit('http://localhost:3000');
    cy.intercept('GET', '**/productos/destacados').as('getDestacados');
    cy.intercept('GET', '**/vendedor/*/productos*').as('getProductosVendedor');
  });

  it('Navega desde el Home hasta el Carrito con datos reales', () => {

    cy.wait(3000); 

    cy.wait('@getDestacados');
    

    cy.get('.producto-card').should('have.length.at.least', 1);

    cy.get('.producto-name').first().invoke('text').then((text) => {
        const nombreProducto = text.trim();
        cy.wrap(nombreProducto).as('nombreGuardado');
        cy.log(`Producto seleccionado: "${nombreProducto}"`);
        
        cy.contains('.producto-card', nombreProducto)
          .parents('.carousel-card')
          .contains('Ver Tienda')
          .click();
    });


    cy.wait('@getProductosVendedor');
    cy.get('.tienda-spinner').should('not.exist');


    cy.get('body').then(($body) => {
        if ($body.find('.tienda-empty').length > 0) {
            throw new Error("¡ALERTA! La tienda está vacía.");
        }
    });

    cy.get('@nombreGuardado').then((nombre) => {

        cy.contains('.producto-tienda-card', nombre, { timeout: 10000 })
          .should('be.visible')
          .find('button')
          .contains(/Agregar|Sin Stock/i)
          .then(($btn) => {
              if ($btn.text().includes('Sin Stock')) {
                  throw new Error("Producto sin stock.");
              }
              cy.wrap($btn).click();
          });

    cy.contains('añadido al carrito', { timeout: 10000 }).should('be.visible');
    });


    cy.wait(1000); 
    
  
    cy.get('.cart-badge').should('be.visible');
    

    cy.get('.cart-badge')
      .closest('button') 
      .click({ force: true }); 

    cy.contains('Ver Carrito').click({ force: true });
    
  
    cy.url().should('include', '/carrito');
    cy.get('@nombreGuardado').then((nombre) => {
        cy.contains('.cart-item', nombre).should('be.visible');
    });
  });
});