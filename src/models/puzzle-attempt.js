export default class PuzzleAttempt {

  constructor (puzzle, ruleset) {
    const initialGrid = puzzle.initialGrid.clone();
    this.failed = false;
    this.succeeded = false;
    this.puzzle = puzzle;
    this.ruleset = ruleset.clone();
    this.history = [initialGrid];
  }

  get tickCount () {
    return this.history.length - 1;
  }

  get complete () {
    return this.failed || this.succeeded || this.tickCount >= this.puzzle.maxTicks;
  }

  get currentGrid () {
    return this.history[this.tickCount];
  }

  tick () {
    const { complete, puzzle, history, currentGrid } = this;
    if (!complete) {
      const nextGrid = new Grid(currentGrid.width, currentGrid.height);
      ruleset.execute(currentGrid, nextGrid);
      history.push(nextGrid);
      for (let x = 0; x < nextGrid.width; x++) {
        for (let y = 0; y < nextGrid.height; y += 1) {
          for (const illegalPattern of puzzle.illegalPatterns) {
            if (illegalPattern.matchesGridAtCoordinates(nextGrid, x, y)) {
              this.failed = true;
              break;
            }
          }
        }
      }
      if (!this.failed && puzzle.goalPattern.matchesGrid(nextGrid)) {
        this.succeeded = true;
      }
    }
    return this;
  }

}
