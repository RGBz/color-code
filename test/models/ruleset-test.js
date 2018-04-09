import { expect } from 'chai';
import Grid from '../../src/models/grid';
import Pattern from '../../src/models/pattern';
import Rule from '../../src/models/rule';
import Ruleset from '../../src/models/ruleset';

describe('Ruleset', () => {

  describe('constructor()', () => {
    it('if no args, creates a Ruleset with no rules to execute', () => {
      const ruleset = new Ruleset();
      expect(ruleset.rules.length).to.equal(0);
    });
  });

  describe('addRule()', () => {
    it('adds a rule to the list', () => {
      const ruleset = new Ruleset();
      const rule = new Rule();
      ruleset.addRule(rule);
      expect(ruleset.rules.length).to.equal(1);
      expect(ruleset.rules[0]).to.equal(rule);
    });
  });

  describe('removeRule()', () => {
    it('removes a rule from the list', () => {
      const ruleset = new Ruleset();
      const rule1 = new Rule(1);
      const rule2 = new Rule(2);
      const rule3 = new Rule(2);
      ruleset.addRule(rule1);
      ruleset.addRule(rule2);
      ruleset.addRule(rule3);
      ruleset.removeRule(rule2);
      expect(ruleset.rules.length).to.equal(2);
      expect(ruleset.rules[0]).to.equal(rule1);
      expect(ruleset.rules[1]).to.equal(rule3);
    });
  });

  describe('getFirstRuleThatMatchesGridAtCoordinates()', () => {
    const rules = [
      new Rule(1, [
        new Pattern([
          [0, 0, 0],
          [0, 3, 0],
          [0, 0, 3],
        ])
      ]),
      new Rule(2, [
        new Pattern([
          [0, 0, 0],
          [0, 2, 0],
          [0, 0, 2],
        ])
      ]),
    ];
    const ruleset = new Ruleset(rules);
    const grid = new Grid([
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 2, 0],
      [0, 0, 0, 0, 2],
    ]);
    it('finds the first rule that matches the grid at the coordinates', () => {
      const matchingRule = ruleset.getFirstRuleThatMatchesGridAtCoordinates(grid, 3, 3);
      expect(matchingRule).to.equal(ruleset.rules[1]);
    });
    it('returns undefined if no rules match the grid at the coordinates', () => {
      const matchingRule = ruleset.getFirstRuleThatMatchesGridAtCoordinates(grid, 2, 2);
      expect(matchingRule).to.equal(undefined);
    });
  });

  describe('execute()', () => {
    const rules = [
      new Rule(8, [
        new Pattern([
          [0, 0, 0],
          [0, 3, 0],
          [0, 0, 3],
        ])
      ]),
      new Rule(9, [
        new Pattern([
          [0, 0, 0],
          [0, 2, 0],
          [0, 0, 2],
        ])
      ]),
    ];
    const ruleset = new Ruleset(rules);
    it('writes to the write grid based on the first matching rule', () => {
      const readGrid = new Grid([
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 2, 0],
        [0, 0, 0, 0, 2]
      ]);
      const writeGrid = new Grid(5, 5);
      ruleset.execute(readGrid, writeGrid);
      expect(writeGrid.equals(new Grid([
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 9, 0],
        [0, 0, 0, 0, 2]
      ]))).to.equal(true);
    });
    it('simply copies the readGrid if no rules match', () => {
      const readGrid = new Grid([
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 4, 0],
        [0, 0, 0, 0, 4]
      ]);
      const writeGrid = new Grid(5, 5);
      ruleset.execute(readGrid, writeGrid);
      expect(writeGrid.equals(new Grid([
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 4, 0],
        [0, 0, 0, 0, 4]
      ]))).to.equal(true);
    });
  });

});
