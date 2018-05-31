import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class AchievementsIndicator extends Component {

  renderAccolade (name) {
    const { timestamp, perfect, count } = this.props.records[name];
    const completed = timestamp && (!count || perfect);
    return (
      <img key={name} src={`/images/${name}-${completed ? 'solid' : 'stroke'}.png`} />
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
