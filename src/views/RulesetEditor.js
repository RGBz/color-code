import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { RulesetPropType } from '../prop-types';

import Rule from '../models/rule';
import Pattern from '../models/pattern';
import Grid from '../models/grid';

import RuleEditor from './RuleEditor';

export default class RulesetEditor extends Component {

  addRule () {
    const { ruleset, onUpdate } = this.props;
    const updatedRuleset = ruleset.clone();
    updatedRuleset.addRule(new Rule(0, [new Pattern(new Grid(5, 5))]));
    onUpdate(updatedRuleset);
  }

  updateRule (ruleIndex, rule) {
    const { ruleset, onUpdate } = this.props;
    const updatedRuleset = ruleset.clone();
    updatedRuleset.rules[ruleIndex] = rule;
    onUpdate(updatedRuleset);
  }

  render () {
    const { ruleset, palette, penValue } = this.props;
    return (
      <div className="ruleset-editor">
        {ruleset.rules.map((rule, i) =>
          <RuleEditor
            key={i}
            rule={rule}
            palette={palette}
            penValue={penValue}
            onUpdate={r => this.updateRule(i, r)}
          />
        )}
        <button onClick={() => this.addRule()}>ADD</button>
      </div>
    );
  }

}

RulesetEditor.propTypes = {
  penValue: PropTypes.number.isRequired,
  palette: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  ruleset: RulesetPropType.isRequired,
  onUpdate: PropTypes.func.isRequired,
};
