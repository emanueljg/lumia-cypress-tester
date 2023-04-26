import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

const getMain = () => { 
  return cy.get('#main');
};

const getCart = () => {
  return cy.get('#cart');
}

const getSearch = () => {
  return getMain().find('#search');
};

const getProducts = () => {
  return getMain()
    .find('[class^=product]') // allow for product big
    .not('[style="display: none;"]');
};

const typeSearch = (keys) => {
  return getSearch().type(keys);
};

const eachProduct = (f) => {
  return getProducts().each(($x) => f($x)); 
};

const storeProductName = (prod) => {
  prod
    .find('.content')
    .find('h2')
    .then(($h2) => {
      cy.wrap($h2.text()).as('prodName');
    });
}

const getForm = () => {
  return getCart().find('.cover').find('form');
}

const fillPaymentInfo = (paymentMap) => {
  for (let [k, v] of paymentMap.entries()) {
    getCart().find('#' + k).type(v);
  }
}

const pay = () => {
  return getForm().find('button').click(); 
}

const sensiblePaymentInfo = new Map([

  //---
  ["name", "John 'Piano Sea Major' Cephalopod"],
  ["card-nr", "125" + "53" + "61" + "106" + "63" + "63" + "64"], // t.ly
  ["street", "Binary Pasta St."],
  //---

  ["zip", "90210"],
  ["city", "BeverlyHills"],
  ["card-date", "04/23"],
  ["card-ccv", "123"]
]);


// background Given defined in other feature

When('I add {string} {string} to cart', 
(quantities, products) => {

  // create map
  const prodsXqtys = new Map();
  const keys = products.split(";;");
  const vals = quantities.split(";;");
  for (let i = 0; i < keys.length; i++) {
    prodsXqtys.set(keys[i], parseInt(vals[i]));
  }

  for (let [k, v] of prodsXqtys.entries()) {
    for (let n = 0; n < v; n++) {
      cy.get('.product h2')
        .contains(k)    
        .parent()
        .find('button')
        .click();
    }
  }
})

When('I go to checkout', () => {
  getCart().find('button[onclick="renderCheckout()"]').click();
});

When('I fill out sensible payment info', () => {
  fillPaymentInfo(sensiblePaymentInfo);  
});

When('click pay', () => {
  pay();
});

Then('it should confirm my payment', () => {
  cy.on('window:alert', (str) => {
    expect(str).to.equal('paying 12345')
  })
});

Then('clear the cart', () => {
  getCart().find('ul').first().should('be.empty');
});

Then('their bulk prices should match price * qty', () => {
  getCart().find('ul').first().find('span').should(span => {
    const unitPrice = parseInt(span.eq(0).text().slice(1, -2));
    const qty = parseInt(span.eq(1).text().slice(0, -1));
    const bulkPrice = parseInt(span.eq(2).text().slice(0, -2));
    expect(bulkPrice).to.equal(unitPrice * qty);
  });
});  

Then('the cart price should equal all bulk prices', () => {
  cy.wrap(0).as('counter');
  getCart().find('ul').first().find('li').each((e, i, coll) => {
    cy.get('@counter').then(counter => {
      if (e.attr('class') !== "total") {
          cy.wrap(
            counter + parseInt(e.find('span').eq(2).text().slice(0, -2))
          ).as('counter');
      } else {
        const actualTotal = parseInt(e.find('span').text());
        expect(actualTotal).to.equal(counter);
      }
    });
  });
});

When('I try paying using CardNbr {string}', (card) => {
  const paymentInfo = new Map(sensiblePaymentInfo);
  paymentInfo.set("card-nr", card);
  getCart().find('button[onclick="renderCheckout()"]').click();
  fillPaymentInfo(paymentInfo);  
  pay();
})

const payMap = new Map([
  ["works", "be.empty"],
  ["fails", "not.be.empty"]
])

Then('paying {string}', (outcome) => {
  getCart().find('ul').first().should(payMap.get(outcome));
})

When('pay', () => {
  getCart().find('button[onclick="renderCheckout()"]').click();
  fillPaymentInfo(sensiblePaymentInfo);  
});

Then('the payment should equal the cart total', () => {
  const stub = cy.stub()
  cy.on('window:alert', stub);
  cy.get('.total').find('span').then(span => {
    pay().then(() => {
      expect(stub.getCall(0)).to.be.calledWith('paying ' + span.text())
    });
  });
});





