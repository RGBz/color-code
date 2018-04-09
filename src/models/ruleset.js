export default class Ruleset {

  constructor (rules = []) {
    this.rules = rules;
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
      for (let y = 0; y < srcGrid.width; y += 1) {
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

}
