import Grid from './Grid';

export default class RulebookExecution {

  constructor (puzzle, rulebook) {
    const initialGrid = puzzle.initialGrid.clone();
    this.failed = false;
    this.succeeded = false;
    this.puzzle = puzzle;
    this.rulebook = rulebook.clone();
    this.frames = [initialGrid];
  }

  get frameCount () {
    return this.frames.length - 1;
  }

  get completed () {
    return this.failed || this.succeeded || this.frameCount >= 50;//this.puzzle.maxTicks;
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
    const { completed, puzzle, frames, currentGrid, rulebook } = this;
    if (!completed) {
      const nextGrid = new Grid({ width: currentGrid.width, height: currentGrid.height });
      rulebook.execute(currentGrid, nextGrid);
      if (nextGrid.equals(currentGrid)) {
        this.failed = true;
        return this;
      }
      frames.push(nextGrid);
      if (!this.failed && puzzle.goalPattern.matchesGrid(nextGrid)) {
        this.succeeded = true;
      }
    }
    return this;
  }

  equals (otherExecution) {
    if (this.frames.length !== otherExecution.frames.length) {
      return false;
    }
    for (let i = 0; i < this.frames.length; i += 1) {
      if (!this.frames[i].equals(otherExecution.frames[i])) {
        return false;
      }
    }
    return true;
  }

}
