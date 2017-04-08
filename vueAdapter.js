var download = require('download-git-repo');
var path = require('path');
var ora = require('ora');
var home = require('user-home');

var vueCliRoot = './node_modules/vue-cli';
var logger = require(`${vueCliRoot}/lib/logger`);
var generate = require(`${vueCliRoot}/lib/generate`);
var checkVersion = require(`${vueCliRoot}/lib/check-version`)
var warnings = require(`${vueCliRoot}/lib/warnings`)


module.exports = runWrapper;


var template = 'webpack'
var hasSlash = false
var inPlace = false
var name = 'frontend'
var to = path.resolve(name);
var clone = false;

var tmp = path.join(home, '.vue-templates', template.replace(/\//g, '-'))

function runWrapper(scope, cb) {
  console.log(scope);
  template = template;
  hasSlash = template.indexOf('/') > -1
  to = scope.rootPath;
  run(cb);
}

/**
 * Check, download and generate the project.
 */

function run(cb) {
  // check if template is local
  if (/^[./]|(\w:)/.test(template)) {
    var templatePath = template.charAt(0) === '/' || /^\w:/.test(template)
      ? template
      : path.normalize(path.join(process.cwd(), template))
    if (exists(templatePath)) {
      generate(name, templatePath, to, cb)
    } else {
      logger.fatal('Local template "%s" not found.', template)
    }
  } else {
    checkVersion(function () {
      if (!hasSlash) {
        // use official templates
        var officialTemplate = 'vuejs-templates/' + template
        if (template.indexOf('#') !== -1) {
          downloadAndGenerate(officialTemplate, cb)
        } else {
          if (template.indexOf('-2.0') !== -1) {
            warnings.v2SuffixTemplatesDeprecated(template, inPlace ? '' : name)
            return
          }

          warnings.v2BranchIsNowDefault(template, inPlace ? '' : name)
          downloadAndGenerate(officialTemplate, cb)
        }
      } else {
        downloadAndGenerate(template, cb)
      }
    })
  }
}

/**
 * Download a generate from a template repo.
 *
 * @param {String} template
 */

function downloadAndGenerate (template, cb) {
  var spinner = ora('downloading template')
  spinner.start()
  download(template, tmp, { clone: clone }, function (err) {
    spinner.stop()
    if (err) logger.fatal('Failed to download repo ' + template + ': ' + err.message.trim())
    generate(name, tmp, to, cb)
  })
}
