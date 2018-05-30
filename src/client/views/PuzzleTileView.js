import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PuzzlePropType } from './prop-types';

import GridView from './GridView';
import IconButton from './buttons/IconButton';

export default class PuzzleTileView extends Component {

  render () {
    const { puzzle, onSelectPuzzle, onEditPuzzle } = this.props;
    const grid = puzzle.thumbnailPreviewType === 'initial' ?
      puzzle.initialGrid : puzzle.goalPattern.grid;
    return (
      <div className="puzzle-tile">
        <div onClick={() => onSelectPuzzle(puzzle)}>
          <GridView
            grid={grid}
            width={100}
            height={100}
            palette={puzzle.palette}
            showGrid={false}
          />
          <div>{puzzle.name}</div>
        </div>
        <IconButton icon="pencil-alt" onPress={() => onEditPuzzle(puzzle)} />
      </div>
    );
  }

}

PuzzleTileView.propTypes = {
  puzzle: PuzzlePropType.isRequired,
  onSelectPuzzle: PropTypes.func.isRequired,
  onEditPuzzle: PropTypes.func.isRequired,
};
