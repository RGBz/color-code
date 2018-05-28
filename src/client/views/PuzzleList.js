import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PuzzlePropType } from './prop-types';

import GridView from './GridView';
import AddButton from './buttons/AddButton';
import IconButton from './buttons/IconButton';

export default class PuzzleList extends Component {

  renderPuzzle (puzzle) {
    const { onSelectPuzzle, onEditPuzzle } = this.props;
    const grid = puzzle.thumbnailPreviewType === 'initial' ?
      puzzle.initialGrid : puzzle.goalPattern.grid;
    return (
      <div key={puzzle.id} className="puzzle-tile">
        <div onClick={() => onSelectPuzzle(puzzle)}>
          <GridView
            grid={grid}
            width={100}
            height={100}
            palette={puzzle.palette}
          />
          <div>{puzzle.name}</div>
        </div>
        <IconButton icon="pencil-alt" onPress={() => onEditPuzzle(puzzle)} />
      </div>
    );
  }

  render () {
    const { puzzles, onCreatePuzzle } = this.props;
    return (
      <div className="puzzle-list">
        {puzzles.map(puzzle => this.renderPuzzle(puzzle))}
        <AddButton onPress={onCreatePuzzle} />
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
