import Pattern from './pattern';

export default class Rule {

  static fromJSON ({ targetValue, patterns }) {
    return new Rule(targetValue, patterns.map(p => Pattern.fromJSON(p)));
  }

  constructor (targetValue = 0, patterns = []) {
    this.targetValue = targetValue;
    this.patterns = patterns;
  }

  addPattern (pattern) {
    this.patterns.push(pattern);
  }

  removePattern (pattern) {
    const patternIndex = this.patterns.indexOf(pattern);
    if (patternIndex >= 0) {
      this.patterns.splice(patternIndex, 1);
    }
  }

  matchesGridAtCoordinates (grid, x, y) {
    if (this.targetValue) {
      for (const pattern of this.patterns) {
        if (pattern.matchesGridAtCoordinates(grid, x, y)) {
          return true;
        }
      }
    }
    return false;
  }

  clone () {
    return new Rule(this.targetValue, this.patterns.map(p => p.clone()));
  }

  toJSON () {
    return {
      targetValue: this.targetValue,
      patterns: this.patterns
    };
  }

}
