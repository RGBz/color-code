import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PuzzlePropType } from '../prop-types';
import GridView from './GridView';
import PaletteView from './PaletteView';
import RulesetEditor from './RulesetEditor';
import PuzzleAttemptPlayer from './PuzzleAttemptPlayer';
import TabBar from './TabBar';

export default class PuzzleEditor extends Component {

  constructor (props) {
    super(props);
    this.state = { penValue: 1, gridTab: 'Initial', rulesetTab: 'Initial', puzzle: props.puzzle };
  }

  updateInitialGrid (grid) {
    const updatedPuzzle = this.state.puzzle.clone();
    updatedPuzzle.initialGrid = grid;
    this.setState({ puzzle: updatedPuzzle });
  }

  updateGoalGrid (grid) {
    const updatedPuzzle = this.state.puzzle.clone();
    updatedPuzzle.goalPattern.grid = grid;
    this.setState({ puzzle: updatedPuzzle });
  }

  updateInitialRuleset (ruleset) {
    const updatedPuzzle = this.state.puzzle.clone();
    updatedPuzzle.initialRuleset = ruleset;
    this.setState({ puzzle: updatedPuzzle });
  }

  updateSolutionRuleset (ruleset) {
    const updatedPuzzle = this.state.puzzle.clone();
    updatedPuzzle.solutionRuleset = ruleset;
    this.setState({ puzzle: updatedPuzzle });
  }

  renderGridTab (grid, onUpdate) {
    const { penValue, puzzle: { palette } } = this.state;
    return (
      <div>
        <GridView
          penValue={penValue}
          grid={grid}
          width={grid.width * 10}
          height={grid.height * 10}
          palette={palette}
          onUpdate={onUpdate}
        />
        <div>
          <input
            placeholder="width"
            value={`${grid.width}`}
            size={3}
            onChange={e => onUpdate(grid.clone(parseInt(e.target.value || 0), grid.height))}
          />
          &times;
          <input
            placeholder="height"
            value={`${grid.height}`}
            size={3}
            onChange={e => onUpdate(grid.clone(grid.width, parseInt(e.target.value || 0)))}
          />
        </div>
      </div>
    );
  }

  renderRulesetTab (ruleset, onUpdate) {
    const { penValue, puzzle: { palette } } = this.state;
    return (
      <RulesetEditor
        ruleset={ruleset}
        palette={palette}
        penValue={penValue}
        onUpdate={onUpdate}
      />
    );
  }

  render () {
    const { onSave, puzzle: savedPuzzle } = this.props;
    const {
      gridTab, rulesetTab, penValue, puzzle,
      puzzle: {
        palette, initialGrid, goalPattern: { grid: goalGrid }, initialRuleset, solutionRuleset
      }
    } = this.state;
    const hasChanges = puzzle !== savedPuzzle;
    return (
      <div className="puzzle">
        <PaletteView
          selectedPenValue={penValue}
          palette={palette}
          onSelectPen={penValue => this.setState({ penValue })}
        />
        <div className="row">
          <div className="column">
            <TabBar
              tabs={['Initial', 'Goal', 'Play']}
              selectedTab={gridTab}
              onTabClick={gridTab => this.setState({ gridTab })}
            />
            {gridTab === 'Initial' && this.renderGridTab(initialGrid, g => this.updateInitialGrid(g))}
            {gridTab === 'Goal' && this.renderGridTab(goalGrid, g => this.updateGoalGrid(g))}
            {gridTab === 'Play' && (<PuzzleAttemptPlayer puzzle={puzzle} ruleset={solutionRuleset} />)}
            {hasChanges && (
              <button onClick={() => onSave(this.state.puzzle)}>SAVE</button>
            )}
          </div>
          <div className="column">
            <TabBar
              tabs={['Initial', 'Solution']}
              selectedTab={rulesetTab}
              onTabClick={rulesetTab => this.setState({ rulesetTab })}
            />
            {rulesetTab === 'Initial' && this.renderRulesetTab(initialRuleset, r => this.updateInitialRuleset(r))}
            {rulesetTab === 'Solution' && this.renderRulesetTab(solutionRuleset, r => this.updateSolutionRuleset(r))}
          </div>
        </div>
      </div>
    );
  }

}

PuzzleEditor.propTypes = {
  puzzle: PuzzlePropType.isRequired,
  onSave: PropTypes.func.isRequired,
};
