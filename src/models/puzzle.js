import Ruleset from './ruleset';
import Grid from './grid';
import Pattern from './pattern';
import PuzzleAttempt from './puzzle-attempt';

export default class Puzzle {

  static fromJSON ({ initialGrid, initialRuleset, solutionRuleset, palette, goalPattern, illegalPatterns, maxTicks }) {
    return new Puzzle({
      initialGrid: Grid.fromJSON(initialGrid),
      initialRuleset: Ruleset.fromJSON(initialRuleset),
      solutionRuleset: Ruleset.fromJSON(solutionRuleset),
      goalPattern: Pattern.fromJSON(goalPattern),
      illegalPatterns: illegalPatterns.map(p => Pattern.fromJSON(p)),
      palette,
      maxTicks,
    });
  }

  constructor ({ initialGrid, initialRuleset, solutionRuleset, palette, goalPattern, illegalPatterns, maxTicks }) {
    this.initialGrid = initialGrid;
    this.initialRuleset = initialRuleset || new Ruleset();
    this.solutionRuleset = solutionRuleset || new Ruleset();
    this.palette = palette || [];
    this.goalPattern = goalPattern;
    this.illegalPatterns = illegalPatterns;
    this.maxTicks = maxTicks || 10;
  }

  clone () {
    return new Puzzle({
      initialGrid: this.initialGrid.clone(),
      initialRuleset: this.initialRuleset.clone(),
      solutionRuleset: this.solutionRuleset.clone(),
      palette: this.palette.map(s => s),
      goalPattern: this.goalPattern.clone(),
      illegalPatterns: this.illegalPatterns.map(p => p.clone()),
      maxTicks: this.maxTicks
    });
  }

  toJSON () {
    return {
      initialGrid: this.initialGrid,
      initialRuleset: this.initialRuleset,
      solutionRuleset: this.solutionRuleset,
      palette: this.palette,
      goalPattern: this.goalPattern,
      illegalPatterns: this.illegalPatterns,
      maxTicks: this.maxTicks
    };
  }

}
