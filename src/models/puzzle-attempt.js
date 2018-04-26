import Grid from './grid';

export default class PuzzleAttempt {

  constructor (puzzle, ruleset) {
    const initialGrid = puzzle.initialGrid.clone();
    this.failed = false;
    this.succeeded = false;
    this.puzzle = puzzle;
    this.ruleset = ruleset.clone();
    this.frames = [initialGrid];
  }

  get frameCount () {
    return this.frames.length - 1;
  }

  get completed () {
    return this.failed || this.succeeded || this.frameCount >= this.puzzle.maxTicks;
  }

  get currentGrid () {
    return this.frames[this.frameCount];
  }

  getFrame (index) {
    return this.frames[index];
  }

  run () {
    while (!this.completed) {
      this.tick();
    }
  }

  tick () {
    const { completed, puzzle, frames, currentGrid, frameCount, ruleset } = this;
    if (!completed) {
      const nextGrid = new Grid(currentGrid.width, currentGrid.height);
      ruleset.execute(currentGrid, nextGrid);
      frames.push(nextGrid);
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
