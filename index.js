/**
 * sails-generate-frontend
 *
 * Usage:
 * `sails generate frontend`
 *
 * @type {Dictionary}
 */

module.exports = {

  templatesDirectory: require('path').resolve(__dirname,'./templates'),

  /**
   * The targets to generate.
   * @type {Dictionary}
   */
  targets: {
    './webpack': { exec: require('./vueAdapter') }
  }
};

