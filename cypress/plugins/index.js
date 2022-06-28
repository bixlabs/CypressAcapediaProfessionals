/// <reference types="cypress" />

const { teardown } = require('mocha');

// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  require('cypress-mochawesome-reporter/plugin')(on);
  /*
  on('task', {
    'db:teardown':() => {
      const teardown = require('../../db/teardown.js')
      return teardown()
    },
    'db:seeding':() => {
      const seeding = require('../../db/seeding.js')
      return seeding()
    }
  })
  */
}
