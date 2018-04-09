const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const WIDTH = 200;
const HEIGHT = 200;

const COLORS = ['black', 'red', 'orange', 'yellow', 'green', 'blue', 'violet', 'brown', 'white', 'black'];
const MAX_VALUE = COLORS.length - 1;

ctx.fillStyle = 'rgb(0,0,0)';
ctx.fillRect(0, 0, WIDTH, HEIGHT);

function rand(min, max) {
  if (min && max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  return Math.floor(Math.random() * min);
}

function prob(p) {
  return Math.floor(Math.random() * 100) < p ? 1 : 0;
}

function zeroes(width, height) {
  const grid = [];
  for (let y = 0; y < height; y += 1) {
    const row = [];
    grid.push(row);
    for (let x = 0; x < width; x += 1) {
      row.push(0);
    }
  }
  return grid;
}

function printGrid(grid) {
  for (let y = 0; y < grid.length; y += 1) {
    console.log(y + ': ' + grid[y].join(' '));
  }
}

class Condition {

  constructor(grid) {
    this.grid = grid;
  }

  get width() {
    return this.grid[0].length;
  }

  get height() {
    return this.grid.length;
  }

  getCellValue(x, y) {
    return this.grid[y][x];
  }

  isPassed(biome, x, y) {
    for (let r = 0; r < this.height; r += 1) {
      const row = this.grid[r];
      for (let c = 0; c < this.width; c += 1) {
        const checkX = (x - Math.floor(this.width / 2)) + c;
        const checkY = (y - Math.floor(this.height / 2)) + r;
        const existingCellValue = biome.getCellValue(checkX, checkY);
        const conditionCellValue = this.getCellValue(c, r);
        if (conditionCellValue && existingCellValue !== conditionCellValue) {
          return false;
        }
      }
    }
    return true;
  }

  toJSON() {
    return this.grid;
  }

}

// a cell needs food and water, if it runs out of either it dies
class Rule {

  constructor(conditions, targetValue) {
    this.conditions = conditions;
    this.targetValue = targetValue;
  }

  isPassed(biome, x, y) {
    for (let i = 0; i < this.conditions.length; i += 1) {
      if (this.conditions[i].isPassed(biome, x, y)) {
        return true;
      }
    }
    return false;
  }

  static fromJSON(json) {
    return new Rule(json.conditions.map(c => new Condition(c)), json.targetValue);
  }

  toJSON() {
    return {
      conditions: this.conditions.map(c => c.toJSON()),
      targetValue: this.targetValue,
    };
  }

}

class Ruleset {

  constructor(rules) {
    this.rules = rules;
  }

  getNextCellValue(biome, x, y) {
    for (let i = 0; i < this.rules.length; i += 1) {
      const rule = this.rules[i];
      if (rule.isPassed(biome, x, y)) {
        return rule.targetValue;
      }
    }
    return biome.getCellValue(x, y);
  }

  static fromJSON(jsonRules) {
    return new Ruleset(jsonRules.map(r => Rule.fromJSON(r)));
  }

  toJSON() {
    return this.rules.map(r => r.toJSON());
  }

}

const RULESET = Ruleset.fromJSON([
  {
    targetValue: 1,
    conditions: [
      [
        [0, 0, 0],
        [0, 0, 0],
        [1, 0, 0],
      ],
    ],
  },
  {
    targetValue: 0,
    conditions: [
      [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0],
      ],
    ],
  },
]);

class Biome {

  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.body = zeroes(width, height, 3);
    this.buffer = zeroes(width, height, 3);
  }

  setCellValue(x, y, value) {
    this.body[y][x] = value;
    return this;
  }

  getCellValue(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return 0;
    }
    return this.body[y][x];
  }

  tick() {
    const clone = [];
    for (let y = 0; y < this.height; y += 1) {
      for (let x = 0; x < this.width; x += 1) {
        this.buffer[y][x] = RULESET.getNextCellValue(this, x, y);
      }
    }
    const swap = this.body;
    this.body = this.buffer;
    this.buffer = swap;
    return this;
  }

  draw(ctx) {
    ctx.clearRect(0, 0, this.width, this.height);
    for (let y = 0; y < this.height; y += 1) {
      for (let x = 0; x < this.width; x += 1) {
        const value = this.body[y][x];
        ctx.fillStyle = COLORS[value];
        ctx.fillRect(x * 2, y * 2, 2, 2);
      }
    }
    return this;
  }

}

const biome = new Biome(WIDTH, HEIGHT);
for (let i = 0; i < 5; i += 1) {
  biome.setCellValue(rand(WIDTH), rand(HEIGHT), 1);
}
// for (let i = 0; i < 5; i += 1) {
//   biome.setCellValue((i * (WIDTH / 5)) + (WIDTH / 10), HEIGHT - 20, 7);
// }
// biome.setCellValue(Math.floor(WIDTH / 2), Math.floor(HEIGHT / 2), 1);


function tick() {
  biome.tick().draw(ctx);
  window.requestAnimationFrame(tick);
}

window.requestAnimationFrame(tick);
