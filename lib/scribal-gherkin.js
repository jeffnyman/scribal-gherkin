'use strict';

var Gherkin = require('gherkin');
var parser = new Gherkin.Parser();

function parse(text) {
  return parser.parse(text);
}

module.exports = {
  parse: parse
};
