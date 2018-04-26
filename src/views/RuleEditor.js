import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { RulePropType } from '../prop-types';

import CellView from './CellView';
import PatternEditor from './PatternEditor';

import Pattern from '../models/pattern';
import Grid from '../models/grid';

export default class RuleEditor extends Component {

  setTargetValue () {
    const { rule, penValue, onUpdate } = this.props;
    const updatedRule = rule.clone();
    updatedRule.targetValue = penValue;
    onUpdate(updatedRule);
  }

  addPattern () {
    const { rule, onUpdate } = this.props;
    const updatedRule = rule.clone();
    updatedRule.patterns.push(new Pattern(new Grid(5, 5)));
    onUpdate(updatedRule);
  }

  updatePattern (index, pattern) {
    const { rule, onUpdate } = this.props;
    const updatedRule = rule.clone();
    updatedRule.patterns[index] = pattern;
    onUpdate(updatedRule);
  }

  removePattern (index) {
    const { rule, onUpdate } = this.props;
    const updatedRule = rule.clone();
    updatedRule.patterns.splice(index, 1);
    onUpdate(updatedRule);
  }

  render () {
    const { palette, penValue, rule: { targetValue, patterns } } = this.props;
    return (
      <div className="rule">
        {patterns.map((pattern, i) => (
          <div key={i} className="pattern-container">
            <PatternEditor
              key={i}
              penValue={penValue}
              palette={palette}
              pattern={pattern}
              onUpdate={p => this.updatePattern(i, p)}
            />
            <button onClick={() => this.removePattern(i)}>DELETE</button>
          </div>
        ))}
        <button onClick={() => this.addPattern()}>ADD</button>
        <CellView
          penValue={targetValue}
          palette={palette}
          onClick={() => this.setTargetValue()}
        />
      </div>
    );
  }

}

RuleEditor.propTypes = {
  penValue: PropTypes.number.isRequired,
  palette: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  rule: RulePropType.isRequired,
  onUpdate: PropTypes.func.isRequired,
};
