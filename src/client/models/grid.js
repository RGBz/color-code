const EMPTY_CELL_VALUE = 0;

export default class Grid {

  static fromJSON ({ rows }) {
    return new Grid(rows);
  }

  constructor (width, height) {
    if (width instanceof Array) {
      this.rows = width;
    } else if (width > 0 && height > 0){
      this.rows = [];
      for (let r = 0; r < height; r += 1) {
        const row = [];
        this.rows.push(row);
        for (let c = 0; c < width; c++) {
          row.push(EMPTY_CELL_VALUE);
        }
      }
    } else {
      throw new TypeError(`Args must either be (width, height) or (array)`);
    }
  }

  get width () {
    if (this.rows.length > 0) {
      return this.rows[0].length;
    }
    return 0;
  }

  get height () {
    return this.rows.length;
  }

  get (x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return 0;
    }
    return this.rows[y][x];
  }

  set (x, y, value) {
    this.rows[y][x] = value;
  }

  clear () {
    for (let y = 0; y < this.height; y += 1) {
      for (let x = 0; x < this.width; x++) {
        this.set(x, y, EMPTY_CELL_VALUE);
      }
    }
  }

  equals (otherGrid) {
    if (otherGrid.width !== this.width || otherGrid.height !== this.height) {
      return false;
    }
    for (let y = 0; y < this.height; y += 1) {
      for (let x = 0; x < this.width; x++) {
        if (otherGrid.get(x, y) !== this.get(x, y)) {
          return false;
        }
      }
    }
    return true;
  }

  clone (width = this.width, height = this.height) {
    const rows = [];
    for (let y = 0; y < height; y += 1) {
      const row = [];
      rows.push(row);
      for (let x = 0; x < width; x++) {
        row.push(this.get(x, y));
      }
    }
    return new Grid(rows);
  }

  toJSON () {
    return { rows: this.rows };
  }

}
