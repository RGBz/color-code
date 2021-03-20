import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PlayerPropType, PuzzlePackPropType } from './prop-types';

import PuzzlePackView from './PuzzlePackView';
import AchievementIcon from './AchievementIcon';

export default class PuzzlePackListView extends Component {

  componentDidMount () {
    const scrollingElement = (document.scrollingElement || document.body);
    scrollingElement.scrollTop = scrollingElement.scrollHeight;
  }

  renderAuthButtons () {
    const { player: { username }, onTutorialPressed } = this.props;
    const buttons = [<button className="logout" onClick={onTutorialPressed}>how to</button>];
    return buttons;
  }

  renderAchievements () {
    const { player, puzzlePacks } = this.props;
    const completedAllPuzzles = puzzlePacks.every(pack =>
      pack.puzzles.every(p => player.getSolutionByPuzzleId(p.id).records.completed.timestamp > 0)
    );
    const perfectStepsAllPuzzles = puzzlePacks.every(pack =>
      pack.puzzles.every(p => player.getSolutionByPuzzleId(p.id).records.steps.perfect)
    );
    const perfectPatternsAllPuzzles = puzzlePacks.every(pack =>
      pack.puzzles.every(p => player.getSolutionByPuzzleId(p.id).records.patterns.perfect)
    );
    if (perfectStepsAllPuzzles && perfectPatternsAllPuzzles) {
      return (
        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <AchievementIcon type="completed" styling="solid" />
          <AchievementIcon type="steps" styling="solid" />
          <AchievementIcon type="patterns" styling="solid" />
          <br/><br/>
          ACHIEVED: EVERYTHING - YOU'RE A GENIUS!
        </div>
      );
    }
    const records = [];
    if (completedAllPuzzles) {
      records.push(
        <div key="completed" style={{ marginTop: 32, textAlign: 'center' }}>
          <AchievementIcon type="completed" styling="solid" />
          <AchievementIcon type="completed" styling="solid" />
          <AchievementIcon type="completed" styling="solid" />
          <br/><br/>
          ACHIEVED: COMPLETED every puzzle!
        </div>
      );
    }
    if (perfectStepsAllPuzzles) {
      records.push(
        <div key="steps" style={{ marginTop: 32, textAlign: 'center' }}>
          <AchievementIcon type="steps" styling="solid" />
          <AchievementIcon type="steps" styling="solid" />
          <AchievementIcon type="steps" styling="solid" />
          <br/><br/>
          ACHIEVED: PERFECT STEPS every puzzle!
        </div>
      );
    }
    if (perfectPatternsAllPuzzles) {
      records.push(
        <div key="patterns" style={{ marginTop: 32, textAlign: 'center' }}>
          <AchievementIcon type="patterns" styling="solid" />
          <AchievementIcon type="patterns" styling="solid" />
          <AchievementIcon type="patterns" styling="solid" />
          <br/><br/>
          ACHIEVED: PERFECT PATTERNS every puzzle!
        </div>
      );
    }
    return records;
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
    const lockedPuzzlePackIndex = (puzzlePacks.findIndex(pack => {
      const lastPuzle = pack.puzzles[pack.puzzles.length - 1];
      return !player.getSolutionByPuzzleId(lastPuzle.id).records.completed.timestamp
    }) + 1) || puzzlePacks.length;

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
        {this.renderAchievements()}
        <div style={{ marginBottom: 200 }}>&nbsp;</div>
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
};
