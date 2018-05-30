import uuidv4 from 'uuid/v4';

import Puzzle from './Puzzle';

export default class PuzzlePack {

  static fromJSON ({ id, name, puzzles }) {
    return new PuzzlePack({ id, name, puzzles: puzzles.map(Puzzle.fromJSON) });
  }

  constructor ({ id = uuidv4(), name = '', puzzles = [] } = {}) {
    this.id = id;
    this.name = name;
    this.puzzles = puzzles;
  }

  clone () {
    return new PuzzlePack({
      id: this.id,
      name: this.name,
      puzzles: this.puzzles.map(p => p.clone()),
    });
  }

  toJSON () {
    return {
      id: this.id,
      name: this.name,
      puzzles: this.puzzles,
    };
  }
}
