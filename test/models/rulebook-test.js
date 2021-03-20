import { expect } from 'chai';
import Grid from '../../src/models/grid';
import Pattern from '../../src/models/pattern';
import Rule from '../../src/models/rule';
import Rulebook from '../../src/models/rulebook';

describe('Rulebook', () => {

  describe('constructor()', () => {
    it('if no args, creates a Rulebook with no rules to execute', () => {
      const rulebook = new Rulebook();
      expect(rulebook.rules.length).to.equal(0);
    });
  });

  describe('addRule()', () => {
    it('adds a rule to the list', () => {
      const rulebook = new Rulebook();
      const rule = new Rule();
      rulebook.addRule(rule);
      expect(rulebook.rules.length).to.equal(1);
      expect(rulebook.rules[0]).to.equal(rule);
    });
  });

  describe('removeRule()', () => {
    it('removes a rule from the list', () => {
      const rulebook = new Rulebook();
      const rule1 = new Rule(1);
      const rule2 = new Rule(2);
      const rule3 = new Rule(2);
      rulebook.addRule(rule1);
      rulebook.addRule(rule2);
      rulebook.addRule(rule3);
      rulebook.removeRule(rule2);
      expect(rulebook.rules.length).to.equal(2);
      expect(rulebook.rules[0]).to.equal(rule1);
      expect(rulebook.rules[1]).to.equal(rule3);
    });
  });

  describe('getFirstRuleThatMatchesGridAtCoordinates()', () => {
    const rules = [
      new Rule(1, [
        new Pattern({ cells: [
          [0, 0, 0],
          [0, 3, 0],
          [0, 0, 3],
        ] })
      ]),
      new Rule(2, [
        new Pattern({ cells: [
          [0, 0, 0],
          [0, 2, 0],
          [0, 0, 2],
        ] })
      ]),
    ];
    const rulebook = new Rulebook(rules);
    const grid = new Grid({ cells: [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 2, 0],
      [0, 0, 0, 0, 2],
    ] });
    it('finds the first rule that matches the grid at the coordinates', () => {
      const matchingRule = rulebook.getFirstRuleThatMatchesGridAtCoordinates(grid, 3, 3);
      expect(matchingRule).to.equal(rulebook.rules[1]);
    });
    it('returns undefined if no rules match the grid at the coordinates', () => {
      const matchingRule = rulebook.getFirstRuleThatMatchesGridAtCoordinates(grid, 2, 2);
      expect(matchingRule).to.equal(undefined);
    });
  });

  describe('execute()', () => {
    const rules = [
      new Rule(8, [
        new Pattern({ cells: [
          [0, 0, 0],
          [0, 3, 0],
          [0, 0, 3],
        ] })
      ]),
      new Rule(9, [
        new Pattern({ cells: [
          [0, 0, 0],
          [0, 2, 0],
          [0, 0, 2],
        ] })
      ]),
    ];
    const rulebook = new Rulebook(rules);
    it('writes to the write grid based on the first matching rule', () => {
      const readGrid = new Grid({ cells: [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 2, 0],
        [0, 0, 0, 0, 2]
      ] });
      const writeGrid = new Grid({ width: 5, height: 5 });
      rulebook.execute(readGrid, writeGrid);
      expect(writeGrid.equals(new Grid({ cells: [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 9, 0],
        [0, 0, 0, 0, 2]
      ] }))).to.equal(true);
    });
    it('simply copies the readGrid if no rules match', () => {
      const readGrid = new Grid({ cells: [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 4, 0],
        [0, 0, 0, 0, 4]
      ] });
      const writeGrid = new Grid({ width: 5, height: 5 });
      rulebook.execute(readGrid, writeGrid);
      expect(writeGrid.equals(new Grid({ cells: [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 4, 0],
        [0, 0, 0, 0, 4]
      ] }))).to.equal(true);
    });
  });

});
