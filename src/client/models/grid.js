const EMPTY_CELL_VALUE = 0;

export default class Grid {

  static fromJSON ({ width, height, cells }) {
    return new Grid(width, height, cells);
  }

  constructor (width, height, cells) {
    this.width = width;
    this.height = height;
    this.cells = cells || new Array(width * height).fill(EMPTY_CELL_VALUE);
  }

  get (x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return 0;
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
    return new Grid(this.width, this.height, this.cells.slice(0));
  }

  isEmpty () {
    return this.cells.every(c => c === EMPTY_CELL_VALUE);
  }

  toJSON () {
    return { width: this.width, height: this.height, cells: this.cells };
  }

}
