const EMPTY_CELL_VALUE = 0;

export default class Grid {

  static fromJSON ({ width, height, cells }) {
    return new Grid({ width, height, cells });
  }

  constructor ({ width, height, cells, fillValue }) {
    this.width = width;
    this.height = height;
    if (cells && cells[0].length) {
      this.cells = cells.flat();
      this.height = cells.length;
      this.width = cells[0].length;
    } else if (cells) {
      this.cells = cells;
    } else {
      this.cells = new Array(width * height).fill(fillValue || EMPTY_CELL_VALUE);
    }
  }

  get (x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return -1;
    }
    return this.cells[this.getCellIndex(x, y)];
  }

  set (x, y, value) {
    this.cells[this.getCellIndex(x, y)] = value;
  }

  getCellIndex (x, y) {
    return y * this.width + x;
  }

  clear () {
    this.cells.fill(EMPTY_CELL_VALUE);
  }

  equals (otherGrid) {
    if (otherGrid.width !== this.width || otherGrid.height !== this.height) {
      return false;
    }
    return this.cells.every((c, i) => c === otherGrid.cells[i]);
  }

  clone () {
    const clone = new Grid({ width: this.width, height: this.height });
    clone.cells = [...this.cells];
    return clone;
  }

  cloneResize (width, height) {
    const cells = new Array(width * height);
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const index = y * width + x;
        if (x < this.width && y < this.height) {
          cells[index] = this.get(x, y);
        } else {
          cells[index] = EMPTY_CELL_VALUE;
        }
      }
    }
    return new Grid({ width, height, cells });
  }

  isEmpty () {
    return this.cells.every(c => c < 0);
  }

  isAll (value) {
    return this.cells.every(c => c === value);
  }

  toJSON () {
    const cells = [];
    for (let y = 0; y < this.height; y++) {
      const row = [];
      for (let x = 0; x < this.width; x++) {
        row.push(this.get(x, y));
      }
    }
    return { width: this.width, height: this.height, cells };
  }

}
