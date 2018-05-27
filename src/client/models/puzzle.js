import uuidv4 from 'uuid/v4';
import Rulebook from './Rulebook';
import Grid from './Grid';
import Pattern from './Pattern';
import RulebookExecution from './RulebookExecution';

export default class Puzzle {

  static fromJSON ({ id, name, initialGrid, palette, goalPattern, maxTicks }) {
    return new Puzzle({
      id,
      name,
      initialGrid: Grid.fromJSON(initialGrid),
      goalPattern: Pattern.fromJSON(goalPattern),
      palette,
      maxTicks,
    });
  }

  constructor ({ id, name, initialGrid, palette, goalPattern, maxTicks }) {
    this.id = id || uuidv4();
    this.name = name;
    this.initialGrid = initialGrid;
    this.palette = palette || [];
    this.goalPattern = goalPattern;
    this.maxTicks = maxTicks || 50;
  }

  clone () {
    return new Puzzle({
      id: this.id,
      name: this.name,
      initialGrid: this.initialGrid.clone(),
      palette: this.palette.map(s => s),
      goalPattern: this.goalPattern.clone(),
      maxTicks: this.maxTicks
    });
  }

  toJSON () {
    return {
      id: this.id,
      name: this.name,
      initialGrid: this.initialGrid,
      palette: this.palette,
      goalPattern: this.goalPattern,
      maxTicks: this.maxTicks
    };
  }

}
