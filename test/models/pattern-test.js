import { expect } from 'chai';
import Grid from '../../src/models/grid';
import Pattern from '../../src/models/pattern';

describe('Pattern', () => {

  describe('constructor()', () => {
    const rows = [
      [0, 0, 0],
      [0, 3, 0],
      [0, 0, 3]
    ];
    const grid = new Grid(rows);
    it('creates a pattern with the passed in grid', () => {
      const pattern = new Pattern(grid);
      expect(pattern.grid).to.equal(grid);
    });
    it('creates a pattern with the passed in array', () => {
      const pattern = new Pattern(rows);
      expect(pattern.grid.rows).to.equal(rows);
    });
  });

  describe('matchesGrid()', () => {
    const pattern = new Pattern([
      [0, 0, 0],
      [0, 3, 0],
      [0, 0, 3]
    ]);
    const exactMatchGrid = new Grid([
      [0, 0, 0],
      [0, 3, 0],
      [0, 0, 3]
    ]);
    const looseMatchGrid = new Grid([
      [3, 0, 0],
      [0, 3, 0],
      [0, 0, 3]
    ]);
    const noMatchGrid = new Grid([
      [0, 0, 0],
      [0, 3, 0],
      [0, 0, 4]
    ]);
    const differentSizeGrid = new Grid([
      [0, 0, 0, 4],
      [0, 3, 0, 5],
      [0, 0, 3, 6]
    ]);
    it('returns true if this pattern exactly matches the grid', () => {
      expect(pattern.matchesGrid(exactMatchGrid)).to.equal(true);
    });
    it('returns true if this pattern loosely matches the grid', () => {
      expect(pattern.matchesGrid(looseMatchGrid)).to.equal(true);
    });
    it('returns false if not a match', () => {
      expect(pattern.matchesGrid(noMatchGrid)).to.equal(false);
    });
    it('returns false if different size than grid', () => {
      expect(pattern.matchesGrid(differentSizeGrid)).to.equal(false);
    });
  });

  describe('matchesGridAtCoordinates()', () => {
    const pattern = new Pattern([
      [0, 0, 0],
      [0, 3, 0],
      [0, 0, 3]
    ]);
    const targetGrid = new Grid([
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 3, 0],
      [0, 3, 0, 0, 3],
      [0, 4, 3, 0, 0],
    ])
    it('returns true if this pattern is found at the coordinates in the grid', () => {
      expect(pattern.matchesGridAtCoordinates(targetGrid, 3, 2)).to.equal(true);
    });
    it('returns false if this pattern is not found at the coordinates in the grid', () => {
      expect(pattern.matchesGridAtCoordinates(targetGrid, 3, 3)).to.equal(false);
    });
    it('ignores mismatched cells if the pattern cell has a 0 value', () => {
      expect(pattern.matchesGridAtCoordinates(targetGrid, 1, 3)).to.equal(true);
    });
  });

  describe('clone()', () => {
    const pattern = new Pattern([
      [0, 0, 0],
      [0, 3, 0],
      [0, 0, 3]
    ]);
    it('makes a copy', () => {
      const clone = pattern.clone();
      expect(clone).to.not.equal(pattern);
      expect(clone.grid).to.not.equal(pattern.grid);
      expect(clone.grid.equals(pattern.grid)).to.equal(true);
    });
  });

});
