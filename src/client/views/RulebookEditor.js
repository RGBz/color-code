import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { RulebookPropType } from './prop-types';

import Rule from '../models/Rule';
import Pattern from '../models/Pattern';
import Grid from '../models/Grid';

import RuleEditor from './RuleEditor';

export default class RulebookEditor extends Component {

  addRule () {
    const { rulebook, patternSize, onUpdate } = this.props;
    const updatedRulebook = rulebook.clone();
    updatedRulebook.addRule(createEmptyRuleForSize(patternSize));
    onUpdate(updatedRulebook);
  }

  updateRule (ruleIndex, rule) {
    const { rulebook, onUpdate } = this.props;
    const updatedRulebook = rulebook.clone();
    if (rule.patterns.length === 0) {
      updatedRulebook.rules.splice(ruleIndex, 1);
    } else {
      updatedRulebook.rules[ruleIndex] = rule;
    }
    onUpdate(updatedRulebook);
  }

  render () {
    const { rulebook, palette, penValue } = this.props;
    const isOnlyOneRule = rulebook.rules.length === 1;
    return (
      <div className="rulebook-editor">
        {rulebook.rules.map((rule, i) =>
          <RuleEditor
            key={i}
            rule={rule}
            palette={palette}
            penValue={penValue}
            onUpdate={r => this.updateRule(i, r)}
            isOnlyRule={isOnlyOneRule}
          />
        )}
        <button className="add-button" onClick={() => this.addRule()}>+</button>
      </div>
    );
  }

}

RulebookEditor.propTypes = {
  penValue: PropTypes.number.isRequired,
  patternSize: PropTypes.number.isRequired,
  palette: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  rulebook: RulebookPropType.isRequired,
  onUpdate: PropTypes.func.isRequired,
};


function createEmptyPatternForSize (size) {
  return new Pattern(new Grid({ width: size, height: size, fillValue: -1 }))
}

function createEmptyRuleForSize (size) {
  return new Rule(-1, [createEmptyPatternForSize(size)]);
}
