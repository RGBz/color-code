import Solution from './Solution';

export default class Player {

  static fetchMe () {
    const jsonStr = localStorage.getItem('player');
    return jsonStr ? Player.fromJSON(JSON.parse()) : new Player();
  }

  static fromJSON ({ solutions }) {
    return new Player({ solutions: solutionsFromJSON(solutions) });
  }

  constructor ({ solutions = {} } = {}) {
    this.solutions = solutions;
  }

  get score () {
    let score = 0;
    for (const solution of Object.values(this.solutions)) {
      if (solution.completed.timestamp) {
        score += 3;
      }
      if (solution.patterns.timestamp) {
        score += 1;
      }
      if (solution.steps.timestamp) {
        score += 1;
      }
    }
    return score;
  }

  getSolutionByPuzzleId (puzzleId) {
    if (!this.solutions[puzzleId]) {
      this.solutions[puzzleId] = new Solution({ puzzleId });
    }
    return this.solutions[puzzleId];
  }

  updateSolution (solution) {
    this.solutions[solution.puzzleId] = solution;
    return this.save();
  }

  save () {
    localStorage.setItem('player', JSON.stringify(this.toJSON()));
  }

  logout () {
    localStorage.clear();
  }

  toJSON () {
    return {
      solutions: this.solutions,
    };
  }

}

function solutionsFromJSON (solutionsJson) {
  const solutions = {};
  Object.keys(solutionsJson).forEach(puzzleId => {
    solutions[puzzleId] = Solution.fromJSON(solutionsJson[puzzleId]);
  });
  return solutions;
}