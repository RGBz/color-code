import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PuzzlePropType } from '../prop-types';

import GridView from './GridView';
import PaletteView from './PaletteView';
import RulebookEditor from './RulebookEditor';
import IconButton from './buttons/IconButton';
import AttemptControls from './AttemptControls';
import Sign from './Sign';

import Grid from '../models/grid';
import PuzzleAttempt from '../models/puzzle-attempt';

export default class PuzzleEditor extends Component {

  constructor (props) {
    super(props);
    const { puzzle } = props;
    const attempt = new PuzzleAttempt(puzzle, puzzle.solutionRulebook);
    attempt.run();
    this.state = {
      penValue: 1,
      puzzle,
      width: puzzle.initialGrid.width,
      height: puzzle.initialGrid.height,
      attempt,
      frameIndex: 0
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
      this.reset();
      if (attempt.succeeded) {
        alert('You win!');
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

  updatePuzzle (puzzle) {
    const attempt = new PuzzleAttempt(puzzle, puzzle.solutionRulebook);
    attempt.run();
    this.setState({ puzzle, attempt, frameIndex: 0 }, () => this.play());
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
    console.log('updated', grid)
    this.updatePuzzle(puzzle);
  }

  updateInitialRulebook (rulebook) {
    const puzzle = this.state.puzzle.clone();
    puzzle.initialRulebook = rulebook;
    this.updatePuzzle(puzzle);
  }

  updateSolutionRulebook (rulebook) {
    const puzzle = this.state.puzzle.clone();
    puzzle.solutionRulebook = rulebook;
    this.updatePuzzle(puzzle);
  }

  updateGridSizes () {
    const { width, height, puzzle: { initialGrid, goalPattern: { grid: goalGrid } } } = this.state;
    const puzzle = this.state.puzzle.clone();
    puzzle.initialGrid = initialGrid.clone(parseInt(width), parseInt(height));
    puzzle.goalPattern.grid = goalGrid.clone(parseInt(width), parseInt(height));
    this.updatePuzzle(puzzle);
  }

  resetGridSizes () {
    const { puzzle: { initialGrid: { width, height } } } = this.state;
    this.setState({ width, height });
  }

  render () {
    const { onSave, onBackPress, puzzle: savedPuzzle } = this.props;
    const {
      penValue, puzzle, frameIndex, attempt, width, height,
      puzzle: { maxTicks, palette, goalPattern: { grid: goalGrid }, solutionRulebook }
    } = this.state;
    const grid = attempt.getFrame(frameIndex);
    const hasChanges = puzzle !== savedPuzzle;
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
          <div className="column">
            {hasChanges && (
              <button onClick={() => onSave(this.state.puzzle)}>SAVE</button>
            )}
            <AttemptControls
              frameIndex={frameIndex}
              frameCount={attempt.frameCount}
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
                rulebook={solutionRulebook}
                palette={palette}
                penValue={penValue}
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
              <button onClick={() => this.updateInitialGrid(new Grid({ width: grid.width, height: grid.height }))}>CLEAR</button>
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
              <button onClick={() => this.updateGoalGrid(new Grid({ width: grid.width, height: grid.height }))}>CLEAR</button>
              <div>
                <input value={width} onChange={e => this.setState({ width: e.target.value })} />
                x
                <input value={height} onChange={e => this.setState({ height: e.target.value })} />
                <button onClick={() => this.updateGridSizes()}>UPDATE</button>
                <button onClick={() => this.resetGridSizes()}>RESET</button>
              </div>
              <br/>
              <input value={maxTicks} />
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
