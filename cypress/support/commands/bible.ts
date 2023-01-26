import { API_URL } from '../utils/config';

Cypress.Commands.add('getVerses', () => {
  Cypress.log({ displayName: 'GET Verses' });

  cy.api({
    method: 'GET',
    url: API_URL + 'verses/nvi/sl/23?isHowToUse=true',
  }).then((response) => {
    expect(response.status).to.eq(200, 'Should return status code');
    expect(response.body).to.have.property('verses');
    expect(response.body.verses).to.not.be.empty;

    Cypress.env('verses').push(response.body);
  });
});
