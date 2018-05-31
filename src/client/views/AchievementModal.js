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

  renderStatColumn (name, value) {
    const newRecord = this.props.newRecords.find(record => record.name === name);
    const imgPath = newRecord && newRecord.perfect ?
      `/images/${name}-solid.png` : `/images/${name}-stroke.png`;
    return (
      <div className="stat-column">
        <div className="stat-label">
          {name}
        </div>
        <div className="stat-value">
          <img src={imgPath} />
          {value}
        </div>
        {newRecord && (
          <div className="stat-caption">
            {newRecord.perfect ? 'PERFECT!' : 'NEW RECORD!'}
          </div>
        )}
      </div>
    );
  }

  renderMessage () {
    const { newRecords } = this.props;
    if (newRecords.some(record => record.type === 'completed')) {
      return 'Puzzle complete!';
    }
    return `New ${newRecords.length === 1 ? 'record' : 'records'}!`;
  }

  render () {
    const { isOpen, onDismiss, stepCount, patternCount } = this.props;
    return (
      <Modal isOpen={isOpen} style={modalStyle}>
        <div className="achievement-modal">
          <Sign
            label="CONGRATULATIONS!"
            style={signStyle}
          />
          <div className="row" style={{ marginTop: 20 }}>
            <div className="message">
              {this.renderMessage()}
            </div>
            <button onClick={onDismiss}>
              NEXT
            </button>
          </div>
          <div className="stats-table">
            {this.renderStatColumn('steps', stepCount)}
            {this.renderStatColumn('patterns', patternCount)}
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
  newRecords: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    date: PropTypes.object.isRequired,
    perfect: PropTypes.bool,
    count: PropTypes.number,
  }).isRequired).isRequired,
};
