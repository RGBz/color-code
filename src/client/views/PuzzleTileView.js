import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PlayerPropType, PuzzlePropType } from './prop-types';

import GridView from './GridView';
import IconButton from './buttons/IconButton';
import AchievementsIndicator from './AchievementsIndicator';

export default class PuzzleTileView extends Component {

  render () {
    const { player, puzzle, onSelectPuzzle, onEditPuzzle, isUnlocked, isEditable } = this.props;
    if (!isEditable && !isUnlocked) {
      return (
        <div className="puzzle-tile">
          <img src="https://cdn.glitch.com/5bb393f1-e781-4a01-8e4e-4b05e66e3d36%2Flock.png?1527824583311" width="160px" />
        </div>
      );
    }
    const grid = puzzle.thumbnailPreviewType === 'initial' ?
      puzzle.initialGrid : puzzle.goalPattern.grid;
    const solution = player.getSolutionByPuzzleId(puzzle.id);
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
          <AchievementsIndicator records={solution.records} />
        </div>
        {isEditable && <IconButton icon="pencil-alt" onPress={() => onEditPuzzle(puzzle)} />}
      </div>
    );
  }

}

PuzzleTileView.propTypes = {
  player: PlayerPropType.isRequired,
  puzzle: PuzzlePropType.isRequired,
  onSelectPuzzle: PropTypes.func.isRequired,
  onEditPuzzle: PropTypes.func.isRequired,
  isUnlocked: PropTypes.bool.isRequired,
};
