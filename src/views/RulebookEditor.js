import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { RulebookPropType } from './prop-types';

import Rule from '../models/Rule';
import Pattern from '../models/Pattern';
import Grid from '../models/Grid';

import RuleEditor from './RuleEditor';
import IconButton from './buttons/IconButton';

export default class RulebookEditor extends Component {

  componentWillMount () {
    if (this.props.rulebook.patternCount === 0) {
      this.addRule();
    }
  }

  addRule () {
    const { rulebook, patternSize, onUpdate } = this.props;
    const updatedRulebook = rulebook.clone();
    updatedRulebook.addRule(createEmptyRuleForSize(patternSize));
    onUpdate(updatedRulebook);
  }

  moveRuleUp (index) {
    const { rulebook, patternSize, onUpdate } = this.props;
    const updatedRulebook = rulebook.clone();
    const swap = updatedRulebook.rules[index - 1];
    updatedRulebook.rules[index - 1] = updatedRulebook.rules[index];
    updatedRulebook.rules[index] = swap;
    onUpdate(updatedRulebook);
  }

  moveRuleDown (index) {
    const { rulebook, patternSize, onUpdate } = this.props;
    const updatedRulebook = rulebook.clone();
    const swap = updatedRulebook.rules[index + 1];
    updatedRulebook.rules[index + 1] = updatedRulebook.rules[index];
    updatedRulebook.rules[index] = swap;
    onUpdate(updatedRulebook);
  }

  updateRule (ruleIndex, rule) {
    const { rulebook, patternSize, onUpdate } = this.props;
    const updatedRulebook = rulebook.clone();
    if (rule.patterns.length === 0) {
      updatedRulebook.rules.splice(ruleIndex, 1);
      if (updatedRulebook.patternCount === 0) {
        updatedRulebook.addRule(createEmptyRuleForSize(patternSize));
      }
    } else {
      updatedRulebook.rules[ruleIndex] = rule;
    }
    onUpdate(updatedRulebook);
  }

  render () {
    const { rulebook, palette, penValue, patternSize, style, disabled } = this.props;
    const isOnlyOneRule = rulebook.rules.length === 1;
    return (
      <div className="rulebook-editor" style={style}>
        
        {rulebook.rules.map((rule, i) =>
          <div key={i} className="rule-container">
            <div className="move-controls">
              <IconButton 
                icon="https://cdn.glitch.com/5bb393f1-e781-4a01-8e4e-4b05e66e3d36%2Fup.png?1528592721448" 
                onPress={() => this.moveRuleUp(i)}
                disabled={i === 0}
              />
              <IconButton 
                icon="https://cdn.glitch.com/5bb393f1-e781-4a01-8e4e-4b05e66e3d36%2Fdown.png?1528592722705" 
                onPress={() => this.moveRuleDown(i)}
                disabled={i === rulebook.rules.length - 1}
              />
            </div>
            <RuleEditor
              rule={rule}
              palette={palette}
              penValue={penValue}
              patternSize={patternSize}
              onUpdate={r => this.updateRule(i, r)}
              isOnlyRule={isOnlyOneRule}
              disabled={disabled}
            />
          </div>
        )}
        {!disabled && (
          <button className="add-button" onClick={() => this.addRule()}>
            <img 
              src="https://cdn.glitch.com/5bb393f1-e781-4a01-8e4e-4b05e66e3d36%2Fplus.png?1528248757779" 
              height="16px" 
            />
          </button>
        )}
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
  disabled: PropTypes.bool,
};


function createEmptyPatternForSize (size) {
  return new Pattern(new Grid({ width: size, height: size, fillValue: -1 }))
}

function createEmptyRuleForSize (size) {
  return new Rule(-1, [createEmptyPatternForSize(size)]);
}
