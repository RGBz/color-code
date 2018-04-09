import { expect } from 'chai';
import Grid from '../../src/models/grid';

describe('Grid', () => {

  describe('constructor()', () => {
    it('creates an empty grid of width x height', () => {
      const grid = new Grid(2, 3);
      expect(grid.width).to.equal(2);
      expect(grid.height).to.equal(3);
      verifyGridIsEmpty(grid);
    });
    it('creates a grid based on the passed in multi-dimensional array', () => {
      const grid = new Grid([
        [1, 2],
        [3, 4],
        [5, 6]
      ]);
      expect(grid.width).to.equal(2);
      expect(grid.height).to.equal(3);
      expect(grid.get(0, 0)).to.equal(1);
      expect(grid.get(1, 0)).to.equal(2);
      expect(grid.get(0, 1)).to.equal(3);
      expect(grid.get(1, 1)).to.equal(4);
      expect(grid.get(0, 2)).to.equal(5);
      expect(grid.get(1, 2)).to.equal(6);
    });
  });

  describe('get()', () => {
    const grid = new Grid(2, 3);
    it('gets the value at a location', () => {
      expect(grid.get(1, 2)).to.equal(0);
    });
    it('returns 0 for values out of bounds', () => {
      expect(grid.get(3, 4)).to.equal(0);
    });
  });

  describe('set()', () => {
    const grid = new Grid(2, 3);
    it('changes the value at a location', () => {
      const x = 1;
      const y = 2;
      const expectedValue = 9;
      grid.set(x, y, expectedValue);
      expect(grid.get(x, y)).to.equal(expectedValue);
    });
  });

  describe('clear()', () => {
    const grid = new Grid(2, 3);
    it('resets all the cell values to 0', () => {
      grid.set(1, 2, 9);
      grid.clear();
      verifyGridIsEmpty(grid);
    });
  });

  describe('clone()', () => {
    const grid = new Grid([
      [9, 8, 7],
      [6, 5, 4]
    ]);
    it('makes a copy of the grid', () => {
      const clone = grid.clone();
      expect(clone.width).to.equal(grid.width);
      expect(clone.height).to.equal(grid.height);
      expect(clone).to.not.equal(grid);
      expect(clone.rows).to.not.equal(grid.rows);
      for (let i = 0; i < clone.rows.length; i += 1) {
        expect(clone.rows[i]).to.not.equal(grid.rows[i]);
      }
      for (let x = 0; x < clone.width; x += 1) {
        for (let y = 0; y < clone.height; y += 1) {
          expect(clone.get(x, y)).to.equal(grid.get(x, y));
        }
      }
    });
  });

  describe('equals()', () => {
    const grid = new Grid([
      [1, 2],
      [3, 4],
      [5, 6]
    ]);
    const sameGrid = new Grid([
      [1, 2],
      [3, 4],
      [5, 6]
    ]);
    const differentGrid = new Grid([
      [6, 5],
      [4, 3]
      [2, 1]
    ]);
    const gridOfDifferentSize = new Grid([
      [1, 2, 7],
      [3, 4, 8],
      [5, 6, 9]
    ]);
    it('makes sure two different grids with the same cell values are seen as equal', () => {
      expect(grid.equals(sameGrid)).to.equal(true);
    });
    it('makes sure two grids with the same dimensions, but different values are not equal', () => {
      expect(grid.equals(differentGrid)).to.equal(false);
    });
    it('makes sure two grids with different dimensions, are not equal', () => {
      expect(grid.equals(gridOfDifferentSize)).to.equal(false);
    });
  });

});

function verifyGridIsEmpty (grid) {
  for (let x = 0; x < grid.width; x += 1) {
    for (let y = 0; y < grid.height; y += 1) {
      expect(grid.get(x, y)).to.equal(0);
    }
  }
}
