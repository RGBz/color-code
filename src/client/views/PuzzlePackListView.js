import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PuzzlePackPropType } from './prop-types';

import PuzzlePackView from './PuzzlePackView';

import Solution from '../models/Solution';

export default class PuzzlePackListView extends Component {

  render () {
    const {
      puzzlePacks,
      updatePuzzlePack,
      navigateToPlayPuzzle,
      navigateToEditPuzzle,
      isEditable,
    } = this.props;
    const lockedPuzzlePackIndex = puzzlePacks.findIndex(pack => {
      const lastPuzle = pack.puzzles[pack.puzzles.length - 1];
      return !Solution.loadByPuzzleId(lastPuzle.id).records.completed.timestamp
    }) + 1;
    const unlockedPacks = isEditable ?
      puzzlePacks :
      puzzlePacks.filter((pack, index) => index < lockedPuzzlePackIndex);
    return (
      <div className="puzzle-pack-list">
        {unlockedPacks.map(puzzlePack =>
          <PuzzlePackView
            key={puzzlePack.nme}
            puzzlePack={puzzlePack}
            updatePuzzlePack={updatePuzzlePack}
            navigateToPlayPuzzle={navigateToPlayPuzzle}
            navigateToEditPuzzle={navigateToEditPuzzle}
            isEditable={isEditable}
          />
        )}
      </div>
    );
  }

}

PuzzlePackListView.propTypes = {
  puzzlePacks: PropTypes.arrayOf(PuzzlePackPropType.isRequired).isRequired,
  updatePuzzlePack: PropTypes.func.isRequired,
  navigateToPlayPuzzle: PropTypes.func.isRequired,
  navigateToEditPuzzle: PropTypes.func.isRequired,
};
