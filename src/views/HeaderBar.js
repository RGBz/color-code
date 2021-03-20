import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class HeaderBar extends Component {

  render () {
    const { heading, tick, onBackPress, onSavePress, onPlayPress, onStepForwardPress, onStepBackwardPress } = this.props;
    return (
      <div className="header row">
        <div className="column" style={{ flex: 1 }}>
          <div>
            <button onClick={onBackPress}>Back</button>
            <span className="heading">{heading}</span>
          </div>
        </div>
        <div className="column">
          <div>
            {onSavePress && (
              <button onClick={onSavePress}>SAVE</button>
            )}
            <button onClick={onPlayPress}>Play</button>
            <span>{tick}</span>
            <button onClick={onStepForwardPress}>Forward</button>
            <button onClick={onStepBackwardPress}>Backward</button>
          </div>
        </div>
      </div>
    );
  }

}

HeaderBar.propTypes = {
  heading: PropTypes.string.isRequired,
  tick: PropTypes.number.isRequired,
  onBackPress: PropTypes.func.isRequired,
  onSavePress: PropTypes.func,
  onPlayPress: PropTypes.func.isRequired,
  onStepForwardPress: PropTypes.func.isRequired,
  onStepBackwardPress: PropTypes.func.isRequired,
};
