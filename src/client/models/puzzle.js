import uuidv4 from 'uuid/v4';
import Rulebook from './rulebook';
import Grid from './grid';
import Pattern from './pattern';
import RulebookExecution from './rulebook-execution';

export default class Puzzle {

  static fromJSON ({ id, name, initialGrid, initialRulebook, solutionRulebook, palette, goalPattern, illegalPatterns, maxTicks }) {
    return new Puzzle({
      id,
      name,
      initialGrid: Grid.fromJSON(initialGrid),
      initialRulebook: Rulebook.fromJSON(initialRulebook),
      solutionRulebook: Rulebook.fromJSON(solutionRulebook),
      goalPattern: Pattern.fromJSON(goalPattern),
      illegalPatterns: illegalPatterns.map(p => Pattern.fromJSON(p)),
      palette,
      maxTicks,
    });
  }

  constructor ({ id, name, initialGrid, initialRulebook, solutionRulebook, palette, goalPattern, illegalPatterns, maxTicks }) {
    this.id = id || uuidv4();
    this.name = name;
    this.initialGrid = initialGrid;
    this.initialRulebook = initialRulebook || new Rulebook();
    this.solutionRulebook = solutionRulebook || new Rulebook();
    this.palette = palette || [];
    this.goalPattern = goalPattern;
    this.illegalPatterns = illegalPatterns;
    this.maxTicks = maxTicks || 10;
  }

  clone () {
    return new Puzzle({
      id: this.id,
      name: this.name,
      initialGrid: this.initialGrid.clone(),
      initialRulebook: this.initialRulebook.clone(),
      solutionRulebook: this.solutionRulebook.clone(),
      palette: this.palette.map(s => s),
      goalPattern: this.goalPattern.clone(),
      illegalPatterns: this.illegalPatterns.map(p => p.clone()),
      maxTicks: this.maxTicks
    });
  }

  toJSON () {
    return {
      id: this.id,
      name: this.name,
      initialGrid: this.initialGrid,
      initialRulebook: this.initialRulebook,
      solutionRulebook: this.solutionRulebook,
      palette: this.palette,
      goalPattern: this.goalPattern,
      illegalPatterns: this.illegalPatterns,
      maxTicks: this.maxTicks
    };
  }

}
