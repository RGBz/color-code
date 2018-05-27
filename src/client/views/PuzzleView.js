import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PuzzlePropType } from './prop-types';

import GridView from './GridView';
import PaletteView from './PaletteView';
import RulebookEditor from './RulebookEditor';
import RulebookExecutionControls from './RulebookExecutionControls';
import IconButton from './buttons/IconButton';
import Sign from './Sign';
import WinModal from './WinModal';

import Grid from '../models/Grid';
import Pattern from '../models/Pattern';
import Rule from '../models/Rule';
import Rulebook from '../models/Rulebook';
import RulebookExecution from '../models/RulebookExecution';

const EMPTY_RULEBOOK = new Rulebook([new Rule(0, [new Pattern(new Grid({ width: 5, height: 5, fillValue: -1 }))])]);

export default class PuzzleView extends Component {

  constructor (props) {
    super(props);
    const { puzzle } = props;
    const solutionRulebook = EMPTY_RULEBOOK;
    this.state = {
      penValue: 1,
      solutionRulebook,
      execution: new RulebookExecution(puzzle, solutionRulebook),
      stepIndex: 0,
      showWinModal: false,
    };
  }

  componentWillUnmount () {
    this.pause();
  }

  play () {
    const { stepIndex, execution } = this.state;
    if (stepIndex === execution.stepCount) {
      this.setState({ stepIndex: 0 });
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
    this.setState({ stepIndex: 0 });
  }

  stepForward () {
    const { stepIndex, execution } = this.state;
    if (stepIndex < execution.stepCount) {
      this.setState({ stepIndex: stepIndex + 1 });
    } else {
      this.pause();
      if (execution.succeeded) {
        this.setState({ showWinModal: true });
      }
    }
  }

  stepBackward () {
    const { stepIndex, execution } = this.state;
    if (stepIndex > 0) {
      this.setState({ stepIndex: stepIndex - 1 });
    } else {
      this.setState({ stepIndex: execution.stepCount });
    }
  }

  updateSolutionRulebook (rulebook) {
    const solutionRulebook = rulebook.rules.length > 0 ? rulebook : EMPTY_RULEBOOK;
    const execution = new RulebookExecution(this.props.puzzle, solutionRulebook);
    if (!execution.equals(this.state.execution)) {
      this.setState({ execution, solutionRulebook, stepIndex: 0 }, () => this.play());
    } else {
      this.setState({ solutionRulebook });
    }
  }

  render () {
    const {
      onBackPress,
      puzzle: { name, maxTicks, palette, goalPattern: { grid: goalGrid } }
    } = this.props;
    const { penValue, stepIndex, execution, solutionRulebook } = this.state;
    const grid = execution.getStep(stepIndex);
    return (
      <div className="puzzle-editor">
        <WinModal
          isOpen={this.state.showWinModal}
          onDismiss={onBackPress}
          stepCount={execution.stepCount}
          patternCount={solutionRulebook.patternCount}
        />
        <div className="header row">
          <div className="column" style={{ flex: 1, flexDirection: 'row' }}>
            <IconButton icon="arrow-left" className="back-button" onPress={onBackPress} />
            <div className="puzzle-name-container">
              <div className="puzzle-name">{name || ''}</div>
            </div>
          </div>
          <RulebookExecutionControls
            stepIndex={stepIndex}
            stepCount={execution.stepCount}
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
              <RulebookEditor
                rulebook={solutionRulebook}
                palette={palette}
                penValue={penValue}
                onUpdate={r => this.updateSolutionRulebook(r)}
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
