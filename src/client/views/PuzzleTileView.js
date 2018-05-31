import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PuzzlePropType } from './prop-types';

import GridView from './GridView';
import IconButton from './buttons/IconButton';
import AchievementsIndicator from './AchievementsIndicator';

import Solution from '../models/Solution';

export default class PuzzleTileView extends Component {

  render () {
    const { puzzle, onSelectPuzzle, onEditPuzzle } = this.props;
    const grid = puzzle.thumbnailPreviewType === 'initial' ?
      puzzle.initialGrid : puzzle.goalPattern.grid;
    const solution = Solution.loadByPuzzleId(puzzle.id);
    return (
      <div className="puzzle-tile">
        <div onClick={() => onSelectPuzzle(puzzle)}>
          <GridView
            grid={grid}
            width={160}
            height={160}
            palette={puzzle.palette}
            showGrid={false}
          />
          <div className="puzzle-tile-name">{puzzle.name}</div>
          <AchievementsIndicator records={solution.records} />
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
