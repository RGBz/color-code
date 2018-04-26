import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PuzzlePropType } from '../prop-types';
import GridView from './GridView';
import RuleEditor from './RuleEditor';

import Rule from '../models/rule';
import Pattern from '../models/pattern';
import Grid from '../models/grid';

export default class PuzzleView extends Component {

  constructor (props) {
    super(props);
    this.state = {
      penValue: 1,
      currentGrid: props.puzzle.initialGrid.clone(),
      ruleset: props.puzzle.initialRuleset.clone(),
    };
  }

  addRule () {
    const updatedRuleset = this.state.ruleset.clone();
    updatedRuleset.addRule(new Rule(0, [new Pattern(new Grid(5, 5))]));
    this.setState({ ruleset: updatedRuleset });
  }

  updateRule (ruleIndex, rule) {
    const updatedRuleset = this.state.ruleset.clone();
    updatedRuleset.rules[ruleIndex] = rule;
    this.setState({ ruleset: updatedRuleset });
  }

  render () {
    const { puzzle: { palette } } = this.props;
    const { penValue, currentGrid, ruleset } = this.state;
    return (
      <div className="puzzle">
        <div className="row">
          {/* Palette goes here... */}
        </div>
        <div className="row">
          <div className="column">
            <GridView
              grid={currentGrid}
              width={300}
              height={300}
              palette={palette}
            />
          </div>
          <div className="column">
            {ruleset.rules.map((rule, i) =>
              <RuleEditor
                key={i}
                rule={rule}
                penValue={penValue}
                onUpdate={r => this.updateRule(i, r)}
              />
            )}
            <button onClick={() => this.addRule()}>ADD</button>
          </div>
        </div>
      </div>
    );
  }

}

PuzzleView.propTypes = {
  puzzle: PuzzlePropType.isRequired,
};
