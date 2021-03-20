import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { RulePropType } from './prop-types';

import CellView from './CellView';
import PatternEditor from './PatternEditor';

import Pattern from '../models/Pattern';
import Grid from '../models/Grid';

export default class RuleEditor extends Component {

  setTargetValue () {
    const { rule, penValue, onUpdate } = this.props;
    const updatedRule = rule.clone();
    updatedRule.targetValue = penValue;
    onUpdate(updatedRule);
  }

  addPattern () {
    const { rule, onUpdate, patternSize } = this.props;
    const updatedRule = rule.clone();
    updatedRule.patterns.push(new Pattern(new Grid({ width: patternSize, height: patternSize, fillValue: -1 })));
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

  renderPatterns () {
    const { palette, penValue, isOnlyRule, rule: { targetValue, patterns }, disabled } = this.props;
    const elements = [];
    const isOnlyOnePattern = patterns.length === 1;
    for (let i = 0; i < patterns.length; i++) {
      const pattern = patterns[i];
      const showDelete = !disabled && !(isOnlyRule && isOnlyOnePattern && pattern.isEmpty());
      elements.push(
        <div key={i} className="pattern-container">
          {showDelete && (
            <button className="delete-button" onClick={() => this.removePattern(i)}>&times;</button>
          )}
          <PatternEditor
            key={i}
            penValue={penValue}
            palette={palette}
            pattern={pattern}
            onUpdate={p => this.updatePattern(i, p)}
            disabled={disabled}
          />
        </div>
      );
      if (i + 1 < patterns.length) {
        elements.push(
          <img 
            key={`or-${i}`} 
            src="https://cdn.glitch.com/5bb393f1-e781-4a01-8e4e-4b05e66e3d36%2For.png?1528248474199" 
            height="36px" 
          />
        );
      }
    }
    return elements;
  }

  renderConsequent () {
    const { palette, penValue, rule: { targetValue, patterns }, disabled } = this.props;
    return (
      <div className="consequent">
        <div className="row">
          <div className="indicator" />
          <div className="indicator" />
          <div className="indicator" />
        </div>
        <div className="row">
          <div className="indicator" />
          <CellView
            penValue={targetValue}
            palette={palette}
            onClick={() => this.setTargetValue()}
            disabled={disabled}
          />
          <div className="indicator" />
        </div>
        <div className="row">
          <div className="indicator" />
          <div className="indicator" />
          <div className="indicator" />
        </div>
      </div>
    );
  }

  render () {
    const { disabled, style } = this.props;
    return (
      <div className="rule" style={style}>
        <div className="patterns">
          {this.renderPatterns()}
          {!disabled && (
            <button className="add-button" onClick={() => this.addPattern()}>
              <img 
                src="https://cdn.glitch.com/5bb393f1-e781-4a01-8e4e-4b05e66e3d36%2Fplus.png?1528248757779" 
                height="16px" 
              />
            </button>
          )}
        </div>
        <img 
          src="https://cdn.glitch.com/5bb393f1-e781-4a01-8e4e-4b05e66e3d36%2Fthen.png?1528248956220" 
          height="36px" 
        />
        {this.renderConsequent()}
      </div>
    );
  }

}

RuleEditor.propTypes = {
  penValue: PropTypes.number.isRequired,
  palette: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  patternSize: PropTypes.number.isRequired,
  rule: RulePropType.isRequired,
  onUpdate: PropTypes.func.isRequired,
  isOnlyRule: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
};
