import React, { Component } from 'react';
import PropTypes from 'prop-types';

import IconButton from './buttons/IconButton';

export default class RulebookExecutionControls extends Component {

  render () {
    const {
      style,
      stepIndex,
      stepCount,
      onReplayPress,
      onStepForwardPress,
      onStepBackwardPress,
    } = this.props;
    const containerStyle = { display: 'flex', flexDirection: 'row', ...style };
    const hasSteps = stepCount > 0;
    return (
      <div className="controls" style={containerStyle}>
        <div className="step-index">STEP {stepIndex}/{stepCount}</div>
        <IconButton 
          icon="https://cdn.glitch.com/5bb393f1-e781-4a01-8e4e-4b05e66e3d36%2Freplay.png?1528250289604" 
          onPress={onReplayPress} 
          disabled={!hasSteps} 
        />
        <IconButton 
          icon="https://cdn.glitch.com/5bb393f1-e781-4a01-8e4e-4b05e66e3d36%2Fstep-backward.png?1528248485328" 
          onPress={onStepBackwardPress} 
          disabled={!hasSteps} 
        />
        <IconButton 
          icon="https://cdn.glitch.com/5bb393f1-e781-4a01-8e4e-4b05e66e3d36%2Fstep-forward.png?1528248486585" 
          onPress={onStepForwardPress} 
          disabled={!hasSteps} 
        />
      </div>
    );
  }

}

RulebookExecutionControls.propTypes = {
  stepIndex: PropTypes.number.isRequired,
  stepCount: PropTypes.number.isRequired,
  onReplayPress: PropTypes.func.isRequired,
  onStepForwardPress: PropTypes.func.isRequired,
  onStepBackwardPress: PropTypes.func.isRequired,
};
