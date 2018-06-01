import Rulebook from './Rulebook';
import RulebookExecution from './RulebookExecution';

export default class Solution {

  static loadByPuzzleId (puzzleId) {
    const jsonStr = localStorage.getItem(getSolutionPathForPuzzleId(puzzleId));
    return jsonStr ? Solution.fromJSON(JSON.parse(jsonStr)) : new Solution({ puzzleId });
  }

  static fromJSON ({ puzzleId, mostRecentRulebook, records }) {
    return new Solution({
      puzzleId,
      mostRecentRulebook: Rulebook.fromJSON(mostRecentRulebook),
      records,
    });
  }

  constructor ({ puzzleId, mostRecentRulebook, records }) {
    this.puzzleId = puzzleId;
    this.mostRecentRulebook = mostRecentRulebook || new Rulebook();
    this.records = records || {
      completed: { timestamp: undefined },
      steps: { count: undefined, pefect: false, timestamp: undefined },
      patterns: { count: undefined, perfect: false, timestamp: undefined },
    };
  }

  executeRulebookForPuzzle (puzzle) {
    const execution = new RulebookExecution(puzzle, this.mostRecentRulebook);
    if (execution.succeeded) {
      const timestamp = Date.now();
      if (!this.records.completed.timestamp) {
        this.records.completed = { timestamp };
      }
      const stepCount = execution.stepCount;
      if (!this.records.steps.count || stepCount < this.records.steps.count) {
        const perfect = stepCount <= puzzle.goalStepCount;
        this.records.steps = { count: stepCount, perfect, timestamp };
      }
      const patternCount = this.mostRecentRulebook.patternCount;
      if (!this.records.patterns.count || patternCount < this.records.patterns.count) {
        const perfect = patternCount <= puzzle.goalPatternCount;
        this.records.patterns = { count: patternCount, perfect, timestamp };
      }
    }
    return execution;
  }

  clone () {
    return new Solution({
      puzzleId: this.puzzleId,
      mostRecentRulebook: this.mostRecentRulebook.clone(),
      records: {
        completed: { ...this.records.completed },
        steps: { ...this.records.steps },
        patterns: { ...this.records.patterns },
      },
    });
  }

  toJSON () {
    return {
      puzzleId: this.puzzleId,
      mostRecentRulebook: this.mostRecentRulebook,
      records: this.records,
    };
  }

  save () {
    localStorage.setItem(getSolutionPathForPuzzleId(this.puzzleId), JSON.stringify(this));
  }
}

function getSolutionPathForPuzzleId (puzzleId) {
  return `solution/${puzzleId}`;
}
