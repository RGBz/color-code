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

  renderPatterns () {
    const { palette, penValue, rule: { targetValue, patterns } } = this.props;
    const elements = [];
    for (let i = 0; i < patterns.length; i++) {
      const pattern = patterns[i];
      elements.push(
        <div key={i} className="pattern-container">
          <button className="delete-button" onClick={() => this.removePattern(i)}>&times;</button>
          <PatternEditor
            key={i}
            penValue={penValue}
            palette={palette}
            pattern={pattern}
            onUpdate={p => this.updatePattern(i, p)}
          />
        </div>
      );
      if (i + 1 < patterns.length) {
        elements.push(<img key={`or-${i}`} src="/images/or.png" height="36px" />);
      }
    }
    return elements;
  }

  renderConsequent () {
    const { palette, penValue, rule: { targetValue, patterns } } = this.props;
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
    return (
      <div className="rule">
        <div className="patterns">
          {this.renderPatterns()}
          <button className="add-button" onClick={() => this.addPattern()}>+</button>
        </div>
        <img src="/images/then.png" height="36px" />
        {this.renderConsequent()}
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
