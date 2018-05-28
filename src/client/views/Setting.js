import React, { Component } from 'react';
import PropTypes from 'prop-types';

import IconButton from './buttons/IconButton';

export default class Setting extends Component {

  constructor (props) {
    super(props);
    this.state = { value: String(props.value) };
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.value !== this.state.value) {
      this.change(String(nextProps.value));
    }
  }

  change (value) {
    this.setState({ value });
  }

  cancel () {
    this.setState({ value: this.props.value });
  }

  render () {
    const { label, value, onChange, onApply, onCancel, style } = this.props;
    const hasChanges = String(value).trim() !== this.state.value.trim();
    return (
      <div className="setting" style={style}>
        <div className="label">{label}</div>
        <div className="row">
          <input
            value={this.state.value}
            onChange={e => this.change(e.target.value)}
          />
          <IconButton
            icon="thumbs-up"
            onPress={() => onApply(this.state.value)}
            disabled={!hasChanges}
          />
          <IconButton
            icon="times"
            onPress={() => this.cancel()}
            disabled={!hasChanges}
          />
        </div>
      </div>
    );
  }

}

Setting.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onApply: PropTypes.func.isRequired,
  style: PropTypes.object,
};
