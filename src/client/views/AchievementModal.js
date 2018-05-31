import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

import Sign from './Sign';

const modalStyle = {
  overlay: {
    background: 'rgba(0,0,0,0.8)',
    zIndex: 1
  },
  content: {
    top: '33%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    overflow: 'initial',
    border: 'none',
    boxShadow: '0 2px 2px rgba(0,0,0,0.1)',
  },
};

const signStyle = {
  marginLeft: -35,
  marginTop: -30,
  fontSize: 24,
  letterSpacing: 1,
  padding: '4px 12px',
};

export default class AchievementModal extends Component {

  renderStatColumn (label, value) {
    return (
      <div className="stat-column">
        <div className="stat-label">
          {label}
        </div>
        <div className="stat-value">
          {value}
        </div>
      </div>
    );
  }

  render () {
    const { isOpen, onDismiss, stepCount, patternCount } = this.props;
    return (
      <Modal isOpen={isOpen} style={modalStyle}>
        <div className="achievement-modal">
          <Sign
            label="NEW RECORD!"
            style={signStyle}
          />
          <div className="row" style={{ marginTop: 20 }}>
            <div className="message">Puzzle complete!</div>
            <button onClick={onDismiss}>
              NEXT
            </button>
          </div>
          <div className="stats-table">
            {this.renderStatColumn('STEPS', stepCount)}
            {this.renderStatColumn('PATTERNS', patternCount)}
          </div>
        </div>
      </Modal>
    );
  }

}

AchievementModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  stepCount: PropTypes.number.isRequired,
  patternCount: PropTypes.number.isRequired,
  onDismiss: PropTypes.func.isRequired,
};
