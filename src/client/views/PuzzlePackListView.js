import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PlayerPropType, PuzzlePackPropType } from './prop-types';

import PuzzlePackView from './PuzzlePackView';

export default class PuzzlePackListView extends Component {

  componentDidMount () {
    const scrollingElement = (document.scrollingElement || document.body);
    scrollingElement.scrollTop = scrollingElement.scrollHeight;
  }

  renderAuthButtons () {
    const { player: { username }, onLoginPressed, onLogoutPressed, onSignUpPressed } = this.props;
    if (!username) {
      return [
        <button className="logout" onClick={onLoginPressed}>login</button>,
        <button className="logout" onClick={onSignUpPressed}>register</button>
      ];
    }
    return (
      <button className="logout" onClick={onLogoutPressed}>logout</button>
    );
  }

  render () {
    const {
      player,
      puzzlePacks,
      updatePuzzlePack,
      navigateToPlayPuzzle,
      navigateToEditPuzzle,
      isEditable,
    } = this.props;
    const lockedPuzzlePackIndex = puzzlePacks.findIndex(pack => {
      const lastPuzle = pack.puzzles[pack.puzzles.length - 1];
      return !player.getSolutionByPuzzleId(lastPuzle.id).records.completed.timestamp
    }) + 1;
    const unlockedPacks = isEditable ?
      puzzlePacks :
      puzzlePacks.filter((pack, index) => index < lockedPuzzlePackIndex);
    return (
      <div className="puzzle-pack-list">
        <div className="header">
          <img src="https://cdn.glitch.com/5bb393f1-e781-4a01-8e4e-4b05e66e3d36%2Flogo.png?1527979638257" />
          {this.renderAuthButtons()}
        </div>
        {unlockedPacks.map(puzzlePack =>
          <PuzzlePackView
            key={puzzlePack.name}
            player={player}
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
  player: PlayerPropType.isRequired,
  puzzlePacks: PropTypes.arrayOf(PuzzlePackPropType.isRequired).isRequired,
  updatePuzzlePack: PropTypes.func.isRequired,
  navigateToPlayPuzzle: PropTypes.func.isRequired,
  navigateToEditPuzzle: PropTypes.func.isRequired,
  onLogoutPressed: PropTypes.func.isRequired,
  onLoginPressed: PropTypes.func.isRequired,
  onSignUpPressed: PropTypes.func.isRequired,
};
