/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-namespace */
// in cypress/support/index.ts
// load type definitions that come with Cypress module
/// <reference types="cypress" />

beforeEach(() => {
  Cypress.env('verses', []);
  Cypress.env('users', []);
});

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to create users
     * @example cy.createUsers();
     */
    getUsers(): Chainable<Element>;

    getVerses(): Chainable<Element>;
  }
}
