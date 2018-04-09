import { expect } from 'chai';
import Grid from '../../src/models/grid';
import Pattern from '../../src/models/pattern';
import Rule from '../../src/models/rule';
import Puzzle from '../../src/models/puzzle';

describe('Puzzle', () => {

  describe('constructor()', () => {
    it('if no args, creates a rule a targetValue of 0 and no patterns', () => {
      const rule = new Rule();
      expect(rule.targetValue).to.equal(0);
      expect(rule.patterns.length).to.equal(0);
    });
    it('creates a rule with no patterns if only targetValue is specified', () => {
      const rule = new Rule(7);
      expect(rule.targetValue).to.equal(7);
      expect(rule.patterns.length).to.equal(0);
    });
    it('creates a rule with the passed in patterns', () => {
      const patterns = [new Pattern(new Grid(1, 1)), new Pattern(new Grid(2, 2))];
      const rule = new Rule(8, patterns);
      expect(rule.patterns).to.equal(patterns);
    });
  });

  describe('addPattern()', () => {
    it('adds a pattern to the list', () => {
      const rule = new Rule(7);
      const pattern = new Pattern(new Grid(1, 1));
      rule.addPattern(pattern);
      expect(rule.patterns.length).to.equal(1);
      expect(rule.patterns[0]).to.equal(pattern);
    });
  });

  describe('removePattern()', () => {
    it('removes a pattern from the list', () => {
      const rule = new Rule(7);
      const pattern1 = new Pattern(new Grid(1, 1));
      const pattern2 = new Pattern(new Grid(2, 2));
      const pattern3 = new Pattern(new Grid(3, 3));
      rule.addPattern(pattern1);
      rule.addPattern(pattern2);
      rule.addPattern(pattern3);
      rule.removePattern(pattern2);
      expect(rule.patterns.length).to.equal(2);
      expect(rule.patterns[0]).to.equal(pattern1);
      expect(rule.patterns[1]).to.equal(pattern3);
    });
  })

  describe('matchesGridAtCoordinates()', () => {
    const patterns = [
      new Pattern([
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ]),
      new Pattern([
        [0, 0, 0],
        [0, 2, 0],
        [0, 0, 2],
      ]),
      new Pattern([
        [0, 0, 0],
        [0, 3, 0],
        [0, 0, 3],
      ]),
    ];
    const grid = new Grid([
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 3, 0],
      [0, 0, 0, 0, 3],
    ]);
    const rule = new Rule(3, patterns);
    it('returns true if at least 1 pattern matches at the coordinates', () => {
      expect(rule.matchesGridAtCoordinates(grid, 3, 3)).to.equal(true);
    });
    it('returns false if no patterns match at the coordinates', () => {
      expect(rule.matchesGridAtCoordinates(grid, 2, 2)).to.equal(false);
    });
  });

});
