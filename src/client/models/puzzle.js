import uuidv4 from 'uuid/v4';
import Rulebook from './Rulebook';
import Grid from './Grid';
import Pattern from './Pattern';
import RulebookExecution from './RulebookExecution';

export default class Puzzle {

  static fromJSON (json) {
    return new Puzzle({
      ...json,
      initialGrid: Grid.fromJSON(json.initialGrid),
      goalPattern: Pattern.fromJSON(json.goalPattern),
    });
  }

  constructor ({
    id,
    name,
    thumbnailPreviewType,
    palette,
    patternSize,
    maxTicks,
    initialGrid,
    goalPattern,
    goalStepCount,
    goalPatternCount,
  }) {
    this.id = id || uuidv4();
    this.name = name;
    this.initialGrid = initialGrid;
    this.palette = palette || [];
    this.goalPattern = goalPattern;
    this.patternSize = patternSize || 5;
    this.maxTicks = maxTicks || 50;
    this.thumbnailPreviewType = thumbnailPreviewType || 'initial';
    this.goalStepCount = goalStepCount;
    this.goalPatternCount = goalPatternCount;
  }

  clone () {
    return new Puzzle({
      id: this.id,
      name: this.name,
      initialGrid: this.initialGrid.clone(),
      palette: this.palette.map(s => s),
      goalPattern: this.goalPattern.clone(),
      patternSize: this.patternSize,
      maxTicks: this.maxTicks,
      thumbnailPreviewType: this.thumbnailPreviewType,
      goalStepCount: this.goalStepCount,
      goalPatternCount: this.goalPatternCount,
    });
  }

  toJSON () {
    return {
      id: this.id,
      name: this.name,
      initialGrid: this.initialGrid,
      palette: this.palette,
      goalPattern: this.goalPattern,
      patternSize: this.patternSize,
      maxTicks: this.maxTicks,
      thumbnailPreviewType: this.thumbnailPreviewType,
      goalStepCount: this.goalStepCount,
      goalPatternCount: this.goalPatternCount,
    };
  }

}
