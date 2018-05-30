import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PuzzlePackPropType } from './prop-types';

import PuzzlePackView from './PuzzlePackView';

export default class PuzzlePackListView extends Component {

  render () {
    const {
      puzzlePacks,
      updatePuzzlePack,
      navigateToPlayPuzzle,
      navigateToEditPuzzle,
    } = this.props;
    return (
      <div className="puzzle-pack-list">
        {puzzlePacks.map(puzzlePack =>
          <PuzzlePackView
            key={puzzlePack.nme}
            puzzlePack={puzzlePack}
            updatePuzzlePack={updatePuzzlePack}
            navigateToPlayPuzzle={navigateToPlayPuzzle}
            navigateToEditPuzzle={navigateToEditPuzzle}
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
