import Grid from './Grid';

export default class RulebookExecution {

  constructor (puzzle, rulebook) {
    const initialGrid = puzzle.initialGrid.clone();
    this.failed = false;
    this.succeeded = false;
    this.puzzle = puzzle;
    this.rulebook = rulebook.clone();
    this.steps = [initialGrid];
    this.run();
  }

  get stepCount () {
    return this.steps.length - 1;
  }

  get completed () {
    return this.failed || this.succeeded || this.stepCount >= 50;//this.puzzle.maxTicks;
  }

  get currentGrid () {
    return this.steps[this.stepCount];
  }

  getStep (index) {
    return this.steps[index];
  }

  run () {
    while (!this.completed) {
      this.tick();
    }
  }

  tick () {
    const { completed, puzzle, steps, currentGrid, rulebook } = this;
    if (!completed) {
      const nextGrid = new Grid({ width: currentGrid.width, height: currentGrid.height });
      rulebook.execute(currentGrid, nextGrid);
      if (nextGrid.equals(currentGrid)) {
        this.failed = true;
        return this;
      }
      steps.push(nextGrid);
      if (!this.failed && puzzle.goalPattern.matchesGrid(nextGrid)) {
        this.succeeded = true;
      }
    }
    return this;
  }

  equals (otherExecution) {
    if (this.steps.length !== otherExecution.steps.length) {
      return false;
    }
    for (let i = 0; i < this.steps.length; i += 1) {
      if (!this.steps[i].equals(otherExecution.steps[i])) {
        return false;
      }
    }
    return true;
  }

}
