import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

const getMain = () => { 
  return cy.get('#main');
};

const getSearch = () => {
  return getMain().find('#search');
};

const getProducts = () => {
  return getMain()
    .find('[class^=product]') // allow for product big
    .not('[style="display: none;"]');
};

const typeSearch = (keys) => {
  return getSearch().type(keys)
};

const eachProduct = (f) => {
  return getProducts().each(($x) => f($x)); 
};

Given('that I am on the start page', () => {
  // Goto the start page
  cy.visit('/');
});

Given('that the user has not searched for anything', () => {
  getSearch().clear();
});

Given('that I have searched for {string}', (product) => {
  getSearch().clear();
  typeSearch(product);
});

Then('the search field should display "Type to search"', () => {
  getSearch()
    .should('have.attr', 'placeholder', 'Type to search');
});

Then('the search result display should not appear', () => {
  getProducts()
    .should('have.length', 0);
});

When('I type {string} in the search field', (keys) => {
  typeSearch(keys)
});

Then('{string} should appear as the search result', (result) => {
  const expectedProducts = result.split(";;");
  eachProduct(($x) => {
    cy.wrap($x)
      .find('.content')
      .find('h2')
      .invoke('text')
      .should('be.oneOf', expectedProducts)
  });
});

Then('product info should display', () => {
  eachProduct(($x) => {
    const outer = cy.wrap($x);
    outer.should('have.descendants', 'img');
    outer.find('.content')
      .should('have.descendants', 'p')
      .and('have.descendants', 'button');
  });
});

When('I click on the product thumbnail', () => {
  getProducts()
    .first()
    .find('img')
    .click();
});

Then('the product image preview should appear', () => {
  getProducts()
    .first()
    .should('have.class', 'product big');
});

When('I click anywhere on the image preview', () => {
  getProducts()
    .first()
    .find('img')
    .click();
});

Then('the image preview should disappear', () => {
  getProducts()
    .first()
    .should('have.class', 'product');
});

