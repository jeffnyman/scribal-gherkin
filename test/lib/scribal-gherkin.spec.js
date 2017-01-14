'use strict';

var chai = require('chai');
var expect = chai.expect;

var gherkin = require('../../lib/scribal-gherkin');

describe('scribal gherkin', function() {
  describe('parsing', function() {
    it('handles a feature with a single scenario', function() {
      var example =
        "Feature: Triangle Calculation\n" +
        "\n" +
        "  Side lengths determine if a valid triangle is formed." +
        "\n" +
        "  Scenario: Scalene\n" +
        "    Given the length values 10, 8, 3\n" +
        "    When  the triangle is calculated\n" +
        "    Then  the triangle type is \"scalene\"\n";

      var source = gherkin.parse(example);

      expect(source.feature).to.have.property('language', 'en');
      expect(source.feature).to.have.property('type', 'Feature');
      expect(source.feature).to.have.property('keyword', 'Feature');
      expect(source.feature).to.have.property('name', 'Triangle Calculation');

      var scenarios = source.feature.children;

      expect(scenarios[0]).to.have.property('type', 'Scenario');
      expect(scenarios[0]).to.have.property('keyword', 'Scenario');
      expect(scenarios[0]).to.have.property('name', 'Scalene');

      expect(scenarios[0]).to.have.deep.property('steps[0].type', 'Step');
      expect(scenarios[0]).to.have.deep.property('steps[0].keyword', 'Given ');
      expect(scenarios[0]).to.have.deep.property('steps[0].text', 'the length values 10, 8, 3');

      expect(scenarios[0]).to.have.deep.property('steps[1].type', 'Step');
      expect(scenarios[0]).to.have.deep.property('steps[1].keyword', 'When ');
      expect(scenarios[0]).to.have.deep.property('steps[1].text', 'the triangle is calculated');

      expect(scenarios[0]).to.have.deep.property('steps[2].type', 'Step');
      expect(scenarios[0]).to.have.deep.property('steps[2].keyword', 'Then ');
      expect(scenarios[0]).to.have.deep.property('steps[2].text', 'the triangle type is "scalene"');
    });

    it('handles a feature with a background', function() {
      var example =
        "Feature: Calculate Weight on Other Planets\n" +
        "\n" +
        "Background: Planet Page\n" +
        "  Given an authenticated user on the planets page\n" +
        "\n" +
        "Scenario: Weight on Mercury\n" +
        "  When the weight calculated is 200\n" +
        "  Then the weight on Mercury will be exactly 75.6\n";

      var source = gherkin.parse(example);

      expect(source.feature).to.have.property('keyword', 'Feature');
      expect(source.feature).to.have.property('name', 'Calculate Weight on Other Planets');

      var scenarios = source.feature.children;

      expect(scenarios[0]).to.have.property('type', 'Background');
      expect(scenarios[0]).to.have.property('keyword', 'Background');
      expect(scenarios[0]).to.have.property('name', 'Planet Page');

      expect(scenarios[0]).to.have.deep.property('steps[0].type', 'Step');
      expect(scenarios[0]).to.have.deep.property('steps[0].keyword', 'Given ');
      expect(scenarios[0]).to.have.deep.property('steps[0].text', 'an authenticated user on the planets page');

      expect(scenarios[1]).to.have.property('type', 'Scenario');
      expect(scenarios[1]).to.have.property('keyword', 'Scenario');
      expect(scenarios[1]).to.have.property('name', 'Weight on Mercury');

      expect(scenarios[1]).to.have.deep.property('steps[0].type', 'Step');
      expect(scenarios[1]).to.have.deep.property('steps[0].keyword', 'When ');
      expect(scenarios[1]).to.have.deep.property('steps[0].text', 'the weight calculated is 200');

      expect(scenarios[1]).to.have.deep.property('steps[1].type', 'Step');
      expect(scenarios[1]).to.have.deep.property('steps[1].keyword', 'Then ');
      expect(scenarios[1]).to.have.deep.property('steps[1].text', 'the weight on Mercury will be exactly 75.6');
    });

    it('handles a feature with tags', function() {
      var example =
        "@manual\n" +
        "Feature: Triangle Calculation\n" +
        "\n" +
        "@named\n" +
        "Scenario: Scalene\n" +
        "@angle @named\n" +
        "Scenario: Right\n" +
        "@bad\n" +
        "Scenario: Impossible\n";

        var source = gherkin.parse(example);

        expect(source.feature.tags[0].name).to.equal('@manual');

        var scenarios = source.feature.children;

        expect(scenarios[0].tags[0].name).to.equal('@named');
        expect(scenarios[1].tags[0].name).to.equal('@angle');
        expect(scenarios[1].tags[1].name).to.equal('@named');
        expect(scenarios[2].tags[0].name).to.equal('@bad');
    });
  });
});
