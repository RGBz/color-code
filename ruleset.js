
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
    const xOffset = x - Math.floor(this.width / 2);
    const yOffset = y - Math.floor(this.height / 2);
    for (let r = 0; r < this.grid.length; r += 1) {
      const row = this.grid[r];
      for (let c = 0; c < row.length; c += 1) {
        const existingCellValue = biome.getCellValue(xOffset + c, yOffset + r);
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
      if (rule.isPassed(biome, x, y) && rule.targetValue) {
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
        [0, 1, 0],
        [0, 0, 0],
        [0, 0, 0],
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
