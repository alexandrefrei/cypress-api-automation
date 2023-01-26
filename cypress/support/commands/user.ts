import { API_URL } from '../utils/config';

Cypress.Commands.add('getUsers', () => {
  Cypress.log({ displayName: 'GET Users' });

  cy.log(`User: ${Cypress.env('verses')[0].verses[0].text}`);

  cy.api({
    method: 'GET',
    url: API_URL + 'verses/nvi/sl/23?isHowToUse=true',
  }).then((response) => {
    expect(response.status).to.eq(200, 'Should return status code');
    expect(response.body).to.have.property('verses');
  });
});
