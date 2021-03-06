import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PlayerPropType, PuzzlePropType } from './prop-types';

import GridView from './GridView';
import PaletteView from './PaletteView';
import RulebookEditor from './RulebookEditor';
import RulebookExecutionControls from './RulebookExecutionControls';
import IconButton from './buttons/IconButton';
import Sign from './Sign';
import AchievementModal from './AchievementModal';
import AchievementsIndicator from './AchievementsIndicator';

import Rulebook from '../models/Rulebook';
import RulebookExecution from '../models/RulebookExecution';

export default class PuzzleView extends Component {

  constructor (props) {
    super(props);
    const { player, puzzle } = props;
    const solution = player.getSolutionByPuzzleId(puzzle.id);
    this.state = {
      penValue: 1,
      solution,
      execution: new RulebookExecution(puzzle, solution.mostRecentRulebook),
      stepIndex: 0,
      newRecords: [],
      showAchievementModal: false,
    };
  }

  componentDidMount () {
    this.play();
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
    const { stepIndex, execution, newRecords } = this.state;
    if (stepIndex < execution.stepCount) {
      this.setState({ stepIndex: stepIndex + 1 });
    } else {
      this.pause();
      if (newRecords.length > 0) {
        this.setState({ showAchievementModal: true });
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
    const oldSolution = this.state.solution;
    const solution = oldSolution.clone();
    solution.mostRecentRulebook = rulebook.rules.length > 0 ? rulebook : new Rulebook();
    const execution = solution.executeRulebookForPuzzle(this.props.puzzle);
    this.props.player.updateSolution(solution);
    if (!execution.equals(this.state.execution)) {
      const newRecords = Object.keys(solution.records).filter(type =>
        solution.records[type].timestamp !== oldSolution.records[type].timestamp
      ).map(name => ({ name, ...solution.records[name] }));
      this.setState({ execution, solution, newRecords, stepIndex: 0 }, () => this.play());
    } else {
      this.setState({ solution });
    }
  }

  render () {
    const {
      onBackPress,
      puzzle: { name, maxTicks, palette, goalPattern: { grid: goalGrid }, patternSize }
    } = this.props;
    const { penValue, stepIndex, execution, solution, newRecords } = this.state;
    const grid = execution.getStep(stepIndex);
    return (
      <div className="puzzle-editor">
        <AchievementModal
          isOpen={this.state.showAchievementModal}
          onDismiss={onBackPress}
          newRecords={newRecords}
          stepCount={execution.stepCount}
          patternCount={solution.mostRecentRulebook.patternCount}
        />
        <div className="header row">
          <div className="column" style={{ flex: 1, flexDirection: 'row' }}>
            <IconButton 
              icon="https://cdn.glitch.com/5bb393f1-e781-4a01-8e4e-4b05e66e3d36%2Fback.png?1528248484044" 
              className="back-button" 
              onPress={onBackPress} 
            />
            <div className="puzzle-name-container">
              <div className="puzzle-name">{name || ''}</div>
            </div>
          </div>
          <div className="column" style={{ flexDirection: 'row' }}>
            <AchievementsIndicator records={solution.records} />
            <RulebookExecutionControls
              stepIndex={stepIndex}
              stepCount={execution.stepCount}
              onReplayPress={() => this.play()}
              onStepForwardPress={() => this.stepForward()}
              onStepBackwardPress={() => this.stepBackward()}
            />
          </div>
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
                rulebook={solution.mostRecentRulebook}
                palette={palette}
                patternSize={patternSize}
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
  player: PlayerPropType.isRequired,
  puzzle: PuzzlePropType.isRequired,
  onBackPress: PropTypes.func.isRequired,
};
