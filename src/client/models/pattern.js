import Grid from './Grid';

export default class Pattern {

  static fromJSON ({ grid }) {
    return new Pattern(Grid.fromJSON(grid));
  }

  constructor (grid) {
    if (grid instanceof Grid) {
      this.grid = grid;
    } else if (grid instanceof Array) {
      this.grid = new Grid(grid);
    } else {
      throw new TypeError(`'grid' argument must either be of type Grid or type Array`);
    }
  }

  isEmpty () {
    return this.grid.isEmpty();
  }

  matchesGrid (gridToCheck) {
    if (
      this.grid.width !== gridToCheck.width ||
      this.grid.height !== gridToCheck.height ||
      this.isEmpty()
    ) {
      return false;
    }
    for (let x = 0; x < this.grid.width; x += 1) {
      for (let y = 0; y < this.grid.height; y += 1) {
        const patternCellValue = this.grid.get(x, y);
        if (patternCellValue >= 0 && patternCellValue !== gridToCheck.get(x, y)) {
          return false;
        }
      }
    }
    return true;
  }

  matchesGridAtCoordinates (gridToCheck, x, y) {
    if (this.isEmpty()) {
      return false;
    }
    const startX = x - Math.floor(this.grid.width / 2);
    const startY = y - Math.floor(this.grid.height / 2);
    for (let patternX = 0; patternX < this.grid.width; patternX += 1) {
      for (let patternY = 0; patternY < this.grid.height; patternY += 1) {
        const patternCellValue = this.grid.get(patternX, patternY);
        if (patternCellValue >= 0) {
          const checkX = startX + patternX;
          const checkY = startY + patternY;
          if (gridToCheck.get(checkX, checkY) !== patternCellValue) {
            return false;
          }
        }
      }
    }
    return true;
  }

  clone () {
    return new Pattern(this.grid.clone());
  }

  toJSON () {
    return { grid: this.grid };
  }

}
