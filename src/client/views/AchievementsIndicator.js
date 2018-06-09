import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AchievementIcon from './AchievementIcon';

export default class AchievementsIndicator extends Component {

  renderAccolade (name) {
    const { timestamp, perfect, count } = this.props.records[name];
    const completed = timestamp && (!count || perfect);
    return (
      <AchievementIcon key={name} type={name} styling={completed ? 'solid' : 'stroke'} />
    );
  }

  render () {
    return (
      <div className="accolades">
        {['completed', 'steps', 'patterns'].map(name => this.renderAccolade(name))}
      </div>
    );
  }

}

AchievementsIndicator.propTypes = {
  records: PropTypes.object.isRequired,
};
