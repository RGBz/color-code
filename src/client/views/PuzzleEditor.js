import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PuzzlePropType } from './prop-types';

import GridView from './GridView';
import PaletteView from './PaletteView';
import RulebookEditor from './RulebookEditor';
import IconButton from './buttons/IconButton';
import IconToggle from './IconToggle';
import RulebookExecutionControls from './RulebookExecutionControls';
import Sign from './Sign';
import Setting from './Setting';

import Grid from '../models/Grid';
import Rulebook from '../models/Rulebook';
import RulebookExecution from '../models/RulebookExecution';

export default class PuzzleEditor extends Component {

  constructor (props) {
    super(props);
    const { puzzle } = props;
    const solutionRulebook = new Rulebook();
    this.state = {
      puzzle,
      solutionRulebook,
      penValue: 2,
      stepIndex: 0,
      execution: new RulebookExecution(puzzle, solutionRulebook),
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

  updatePuzzle (puzzle) {
    this.setState({ puzzle }, () => this.executeSolutionRulebook());
  }

  updatePuzzleName (name) {
    const puzzle = this.state.puzzle.clone();
    puzzle.name = name;
    this.updatePuzzle(puzzle);
  }

  updateInitialGrid (grid) {
    const puzzle = this.state.puzzle.clone();
    puzzle.initialGrid = grid;
    this.updatePuzzle(puzzle);
  }

  updateGoalGrid (grid) {
    const puzzle = this.state.puzzle.clone();
    puzzle.goalPattern.grid = grid;
    this.updatePuzzle(puzzle);
  }

  updateSolutionRulebook (solutionRulebook) {
    this.setState({ solutionRulebook }, () => this.executeSolutionRulebook());
  }

  executeSolutionRulebook () {
    const execution = new RulebookExecution(this.state.puzzle, this.state.solutionRulebook);
    this.setState({ execution, stepIndex: 0 }, () => this.play());
  }

  copyGoalGridToInitialGrid () {
    const { puzzle: { goalPattern: { grid: goalGrid } } } = this.state;
    const puzzle = this.state.puzzle.clone();
    puzzle.initialGrid = goalGrid.clone();
    this.updatePuzzle(puzzle);
  }

  copyInitialGridToGoalGrid () {
    const { puzzle: { initialGrid, goalPattern } } = this.state;
    const puzzle = this.state.puzzle.clone();
    puzzle.goalPattern.grid = initialGrid.clone();
    this.updatePuzzle(puzzle);
  }

  updateGridSizes (size) {
    const { puzzle: { initialGrid, goalPattern: { grid: goalGrid } } } = this.state;
    const puzzle = this.state.puzzle.clone();
    puzzle.initialGrid = initialGrid.cloneResize(parseInt(size), parseInt(size));
    puzzle.goalPattern.grid = goalGrid.cloneResize(parseInt(size), parseInt(size));
    this.updatePuzzle(puzzle);
  }

  updatePatternSizes (size) {
    const puzzle = this.state.puzzle.clone();
    puzzle.patternSize = size;
    const solutionRulebook = new Rulebook();
    const execution = new RulebookExecution(puzzle, solutionRulebook);
    this.setState({ execution, puzzle, solutionRulebook, stepIndex: 0 }, () => this.play());
  }

  updateMaxTicks (maxTicks) {
    const puzzle = this.state.puzzle.clone();
    puzzle.maxTicks = maxTicks;
    this.updatePuzzle(puzzle);
  }

  updateThumbnailPreviewType (thumbnailPreviewType) {
    const puzzle = this.state.puzzle.clone();
    puzzle.thumbnailPreviewType = thumbnailPreviewType;
    this.updatePuzzle(puzzle);
  }

  updateGoalStepCount (goalStepCount) {
    const puzzle = this.state.puzzle.clone();
    puzzle.goalStepCount = goalStepCount;
    this.updatePuzzle(puzzle);
  }

  updateGoalPatternCount (goalPatternCount) {
    const puzzle = this.state.puzzle.clone();
    puzzle.goalPatternCount = goalPatternCount;
    this.updatePuzzle(puzzle);
  }

  render () {
    const { onSave, onBackPress, puzzle: savedPuzzle } = this.props;
    const {
      penValue,
      puzzle,
      stepIndex,
      execution,
      solutionRulebook,
      puzzle: {
        maxTicks,
        palette,
        initialGrid,
        patternSize,
        thumbnailPreviewType,
        goalStepCount,
        goalPatternCount,
        goalPattern: { grid: goalGrid },
      },
    } = this.state;
    const grid = execution.getStep(stepIndex);
    const hasChanges = puzzle !== savedPuzzle;
    const areGridsEqual = initialGrid.equals(goalGrid);
    return (
      <div className="puzzle-editor">
        <div className="header row">
          <div className="column" style={{ flex: 1, flexDirection: 'row' }}>
            <IconButton icon="arrow-left" className="back-button" onPress={onBackPress} />
            <div className="puzzle-name-container">
              <input
                className="puzzle-name"
                value={puzzle.name || ''}
                placeholder="Untitled Puzzle"
                onChange={e => this.updatePuzzleName(e.target.value)}
              />
            </div>
          </div>
          <div className="row">
            {hasChanges && (
              <IconButton
                icon="save"
                label="SAVE"
                onPress={() => onSave(this.state.puzzle)}
                style={{ marginRight: 16, background: '#FC3667', color: 'white' }}
              />
            )}
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
            <div className="inner" style={{ alignItems: 'center' }}>
              <PaletteView
                selectedPenValue={penValue}
                palette={palette}
                onSelectPen={penValue => this.setState({ penValue })}
              />
              <br /><br />
              <Setting
                label="Puzzle Size"
                value={goalGrid.width}
                onApply={puzzleSize => this.updateGridSizes(puzzleSize)}
              />
              <Setting
                label="Pattern Size"
                value={patternSize}
                onApply={patternSize => this.updatePatternSizes(patternSize)}
              />
              <Setting
                label="Max Steps"
                value={maxTicks}
                onApply={maxTicks => this.updateMaxTicks(maxTicks)}
              />
              <IconToggle
                label="THUMBNAIL"
                off={{ icon: 'square', value: 'initial' }}
                on={{ icon: 'check-square', value: 'goal' }}
                value={thumbnailPreviewType}
                onToggle={type => this.updateThumbnailPreviewType(type)}
              />
            </div>
          </div>
          <div className="column full">
            <div className="inner">
              <RulebookEditor
                rulebook={solutionRulebook}
                palette={palette}
                penValue={penValue}
                patternSize={patternSize}
                onUpdate={r => this.updateSolutionRulebook(r)}
              />
            </div>
          </div>
          <div className="column sidebar" style={{ padding: 20 }}>
            <div className="inner">
              <Sign label="YOURS" />
              <GridView
                penValue={penValue}
                grid={grid}
                width={200}
                height={200}
                palette={palette}
                onUpdate={g => this.updateInitialGrid(g)}
              />
              <div className="row" style={{ marginTop: 8, justifyContent: 'space-between' }}>
                <IconButton
                  icon="sync"
                  onPress={() => this.copyGoalGridToInitialGrid()}
                  disabled={areGridsEqual}
                />
                <IconButton
                  icon="bomb"
                  onPress={() => this.updateInitialGrid(new Grid({ width: grid.width, height: grid.height }))}
                  disabled={initialGrid.isAll(0)}
                />
              </div>
              <div style={{ height: 16 }} />
              <Sign label="GOAL" />
              <GridView
                penValue={penValue}
                grid={goalGrid}
                width={200}
                height={200}
                palette={palette}
                onUpdate={g => this.updateGoalGrid(g)}
              />
              <div className="row" style={{ marginTop: 8, justifyContent: 'space-between' }}>
                <IconButton
                  icon="sync"
                  onPress={() => this.copyInitialGridToGoalGrid()}
                  disabled={areGridsEqual}
                />
                <IconButton
                  icon="bomb"
                  onPress={() => this.updateGoalGrid(new Grid({ width: grid.width, height: grid.height }))}
                  disabled={goalGrid.isAll(0)}
                />
              </div>
              <Setting
                label="Steps Goal"
                value={goalStepCount || ''}
                onApply={goalStepCount => this.updateGoalStepCount(goalStepCount)}
              />
              <Setting
                label="Patterns Goal"
                value={goalPatternCount || ''}
                onApply={goalPatternCount => this.updateGoalPatternCount(goalPatternCount)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

}

PuzzleEditor.propTypes = {
  puzzle: PuzzlePropType.isRequired,
  onSave: PropTypes.func.isRequired,
  onBackPress: PropTypes.func.isRequired,
};
