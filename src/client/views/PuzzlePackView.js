import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PuzzlePackPropType } from './prop-types';

import AddButton from './buttons/AddButton';
import PuzzleTileView from './PuzzleTileView';

import Puzzle from '../models/Puzzle';
import Pattern from '../models/Pattern';
import Grid from '../models/Grid';

export default class PuzzlePackView extends Component {

  createPuzzle () {
    const puzzle = new Puzzle({
      initialGrid: new Grid({ width: 9, height: 9 }),
      goalPattern: new Pattern(new Grid({ width: 9, height: 9 })),
      palette: [
        '#FFFFFF', // white
        '#90A4AE', // gray
        '#000000', // black

        '#D0011B', // red
        '#FF5BB7', // pink
        '#9012FE', // purple

        '#FFB500', // orange
        '#8B572A', // brown
        '#1190EE', // blue

        '#F8E81C', // yellow
        '#00C467', // green
        '#50E3C2', // blue-green
      ],
    });
    const puzzlePack = this.props.puzzlePack.clone();
    puzzlePack.puzzles.push(puzzle);
    this.props.updatePuzzlePack(puzzlePack);
    this.props.navigateToEditPuzzle(puzzle);
  }

  render () {
    const { puzzlePack, navigateToPlayPuzzle, navigateToEditPuzzle } = this.props;
    return (
      <div className="puzzle-pack">
        <div className="heading">{puzzlePack.name}</div>
        <div className="puzzles">
          {puzzlePack.puzzles.map(puzzle =>
            <PuzzleTileView
              key={puzzle.id}
              puzzle={puzzle}
              onSelectPuzzle={navigateToPlayPuzzle}
              onEditPuzzle={navigateToEditPuzzle}
            />
          )}
          <AddButton onPress={() => this.createPuzzle()} />
        </div>
      </div>
    );
  }

}

PuzzlePackView.propTypes = {
  puzzlePack: PuzzlePackPropType.isRequired,
  updatePuzzlePack: PropTypes.func.isRequired,
  navigateToPlayPuzzle: PropTypes.func.isRequired,
  navigateToEditPuzzle: PropTypes.func.isRequired,
};
