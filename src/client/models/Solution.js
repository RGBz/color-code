import Rulebook from './Rulebook';

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
      steps: { count: undefined, date: undefined },
      patterns: { count: undefined, date: undefined },
    };
  }

  clone () {
    return new Solution({
      puzzleId: this.puzzleId,
      mostRecentRulebook: this.mostRecentRulebook.clone(),
      records: {
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
