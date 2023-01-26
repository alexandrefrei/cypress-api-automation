//const AllureWriter = require('@shelex/cypress-allure-plugin/writer');
import { defineConfig } from 'cypress';
const fs = require('fs-extra');
const path = require('path');
const { Client } = require('pg');

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        queryDatabase(query) {
          return executeQuery(query, config.env);
        },
      });

      //AllureWriter(on, config);
      const environment: string = config.env.configFile;
      const configurationForEnvironment = getConfigurationByFile(environment);
      return configurationForEnvironment;
    },
    env: {
      snapshotOnly: true,
    },
    specPattern: 'cypress/e2e/**/*spec.{js,ts}',
    //Ignore test files that would otherwise be shown in your list of tests
    excludeSpecPattern: ['*.page.js', 'utils.js', '*.d.ts'],
    video: false,
  },
  //Cypress only takes a screenshot when running through 'Cypress run' or in Continuous Integration, using cypress open won't take a screenshot
  screenshotOnRunFailure: true,
  //Whether Cypress will trash assets within the downloadsFolder, screenshotsFolder, and videosFolder before tests run with cypress run.
  trashAssetsBeforeRuns: true,
});

function getConfigurationByFile(environment: string) {
  let pathToConfigFile;
  if (environment == 'stage') {
    pathToConfigFile = path.resolve('environments/cypress.stage.json');
  }
  if (environment == 'prod') {
    pathToConfigFile = path.resolve('environments/cypress.prod.json');
  }
  if (environment == 'GitHub') {
    pathToConfigFile = path.resolve('cypress.env.json');
  }
  console.log('Environment: ', environment);
  return fs.readJson(pathToConfigFile);
}

// querying the database from Node
function executeQuery(query, config) {
  const client = new Client(config.env.db);

  client.connect((err) => {
    if (err) {
      console.error('connection error', err.stack);
    } else {
      console.log('connected');
    }
  });

  return new Promise((resolve, reject) => {
    client.query(query, (error, results) => {
      console.log('Executing query...');
      if (error) {
        reject(`Error executing query: ${error}`);
      } else {
        results.rows.length > 0 ? resolve(results) : reject('Empty results');
      }
      console.log('Ending DB connection');
      client.end();
    });
  });
}
