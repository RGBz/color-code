import Rule from './rule';

export default class Ruleset {

  static fromJSON ({ rules }) {
    return new Ruleset(rules.map(r => Rule.fromJSON(r)));
  }

  constructor (rules = []) {
    this.rules = rules;
  }

  get patternCount () {
    return this.rules.reduce((count, rule) => count + rule.patterns.length, 0);
  }

  addRule (rule) {
    this.rules.push(rule);
  }

  removeRule (rule) {
    const ruleIndex = this.rules.indexOf(rule);
    if (ruleIndex >= 0) {
      this.rules.splice(ruleIndex, 1);
    }
  }

  execute (srcGrid, dstGrid) {
    for (let x = 0; x < srcGrid.width; x += 1) {
      for (let y = 0; y < srcGrid.height; y += 1) {
        const ruleToFollow = this.getFirstRuleThatMatchesGridAtCoordinates(srcGrid, x, y);
        if (ruleToFollow) {
          dstGrid.set(x, y, ruleToFollow.targetValue);
        } else {
          dstGrid.set(x, y, srcGrid.get(x, y));
        }
      }
    }
    return dstGrid;
  }

  getFirstRuleThatMatchesGridAtCoordinates (grid, x, y) {
    for (const rule of this.rules) {
      if (rule.matchesGridAtCoordinates(grid, x, y)) {
        return rule;
      }
    }
    return undefined;
  }

  clone () {
    return new Ruleset(this.rules.map(r => r.clone()));
  }

  toJSON () {
    return { rules: this.rules };
  }

}
