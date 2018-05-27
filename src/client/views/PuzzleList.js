import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PuzzlePropType } from './prop-types';

import GridView from './GridView';

export default class PuzzleList extends Component {

  render () {
    const { puzzles, onCreatePuzzle, onSelectPuzzle, onEditPuzzle } = this.props;
    return (
      <div className="puzzle-list">
        {puzzles.map(puzzle => (
          <div key={puzzle.id} className="puzzle-tile" onClick={() => onSelectPuzzle(puzzle)}>
            <GridView
              grid={puzzle.goalPattern.grid}
              width={100}
              height={100}
              palette={puzzle.palette}
            />
            <div>{puzzle.name}</div>
          </div>
        ))}
        <button className="add-button" onClick={() => onCreatePuzzle()}>+</button>
      </div>
    );
  }

}

PuzzleList.propTypes = {
  puzzles: PropTypes.arrayOf(PuzzlePropType.isRequired).isRequired,
  onCreatePuzzle: PropTypes.func.isRequired,
  onSelectPuzzle: PropTypes.func.isRequired,
  onEditPuzzle: PropTypes.func.isRequired,
};
