import Ruleset from './ruleset';
import PuzzleAttempt from './puzzle-attempt';

export default class Puzzle {

  constructor ({ initialGrid, initialDude, goalPattern, illegalPatterns, maxTicks }) {
    this.initialGrid = initialGrid;
    this.initialDude = initialDude || new Ruleset();
    this.goalPattern = goalPattern;
    this.illegalPatterns = illegalPatterns;
    this.maxTicks = maxTicks || 10;
  }

}
