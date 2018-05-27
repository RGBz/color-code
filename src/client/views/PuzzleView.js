import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PuzzlePropType } from '../prop-types';

import GridView from './GridView';
import PaletteView from './PaletteView';
import RulesetEditor from './RulesetEditor';
import AttemptControls from './AttemptControls';
import IconButton from './buttons/IconButton';
import Sign from './Sign';
import WinModal from './WinModal';

import Grid from '../models/grid';
import Pattern from '../models/pattern';
import Rule from '../models/rule';
import Ruleset from '../models/ruleset';
import PuzzleAttempt from '../models/puzzle-attempt';

const EMPTY_RULESET = new Ruleset([new Rule(0, [new Pattern(new Grid(5, 5))])]);

export default class PuzzleView extends Component {

  constructor (props) {
    super(props);
    const { puzzle } = props;
    const solutionRuleset = EMPTY_RULESET;
    const attempt = new PuzzleAttempt(puzzle, solutionRuleset);
    attempt.run();
    this.state = {
      penValue: 1,
      solutionRuleset,
      attempt,
      frameIndex: 0,
      showWinModal: false,
    };
  }

  componentWillUnmount () {
    this.pause();
  }

  play () {
    const { frameIndex, attempt } = this.state;
    if (frameIndex === attempt.frameCount) {
      this.setState({ frameIndex: 0 });
    }
    this.pause();
    this.ticker = setInterval(() => this.stepForward(), 100);
  }

  pause () {
    if (this.ticker) {
      clearTimeout(this.ticker);
      this.ticker = null;
    }
  }

  reset () {
    this.pause();
    this.setState({ frameIndex: 0 });
  }

  stepForward () {
    const { frameIndex, attempt } = this.state;
    if (frameIndex < attempt.frameCount) {
      this.setState({ frameIndex: frameIndex + 1 });
    } else {
      this.pause();
      if (attempt.succeeded) {
        this.setState({ showWinModal: true });
      }
    }
  }

  stepBackward () {
    const { frameIndex, attempt } = this.state;
    if (frameIndex > 0) {
      this.setState({ frameIndex: frameIndex - 1 });
    } else {
      this.setState({ frameIndex: attempt.frameCount });
    }
  }

  updateSolutionRuleset (ruleset) {
    const solutionRuleset = ruleset.rules.length > 0 ? ruleset : EMPTY_RULESET;
    const attempt = new PuzzleAttempt(this.props.puzzle, solutionRuleset);
    attempt.run();
    if (!attempt.equals(this.state.attempt)) {
      this.setState({ attempt, solutionRuleset, frameIndex: 0 }, () => this.play());
    } else {
      this.setState({ solutionRuleset });
    }
  }

  render () {
    const {
      onBackPress,
      puzzle: { name, maxTicks, palette, goalPattern: { grid: goalGrid } }
    } = this.props;
    const { penValue, frameIndex, attempt, solutionRuleset } = this.state;
    const grid = attempt.getFrame(frameIndex);
    return (
      <div className="puzzle-editor">
        <WinModal
          isOpen={this.state.showWinModal}
          onDismiss={onBackPress}
          stepCount={attempt.frameCount}
          patternCount={solutionRuleset.patternCount}
        />
        <div className="header row">
          <div className="column" style={{ flex: 1, flexDirection: 'row' }}>
            <IconButton icon="arrow-left" className="back-button" onPress={onBackPress} />
            <div className="puzzle-name-container">
              <div className="puzzle-name">{name || ''}</div>
            </div>
          </div>
          <AttemptControls
            frameIndex={frameIndex}
            frameCount={attempt.frameCount}
            onReplayPress={() => this.play()}
            onStepForwardPress={() => this.stepForward()}
            onStepBackwardPress={() => this.stepBackward()}
          />
        </div>
        <div className="row" style={{ background: '#E4E4E4', flex: 1 }}>
          <div className="column sidebar">
            <div className="inner">
              <PaletteView
                selectedPenValue={penValue}
                palette={palette}
                onSelectPen={penValue => this.setState({ penValue })}
              />
            </div>
          </div>
          <div className="column full">
            <div className="inner">
              <RulesetEditor
                ruleset={solutionRuleset}
                palette={palette}
                penValue={penValue}
                onUpdate={r => this.updateSolutionRuleset(r)}
              />
            </div>
          </div>
          <div className="column sidebar">
            <div className="inner" style={{ padding: 20 }}>
              <Sign label="YOURS" />
              <GridView
                grid={grid}
                width={200}
                height={200}
                palette={palette}
              />
              <div style={{ height: 16 }} />
              <Sign label="GOAL" />
              <GridView
                grid={goalGrid}
                width={200}
                height={200}
                palette={palette}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

}

PuzzleView.propTypes = {
  puzzle: PuzzlePropType.isRequired,
  onBackPress: PropTypes.func.isRequired,
};
