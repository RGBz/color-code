import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Player from '../models/Player';

export default class IconButton extends Component {

  constructor (props) {
    super(props);
    this.state = { username: '', password: '', mode: 'login' };
  }

  async login () {
    const { username, password } = this.state;
    try {
      const player = await Player.login(username, password);
      this.props.onLogin(player);
    } catch (error) {
      this.setState({ error });
    }
  }

  async signUp () {
    const { username, password } = this.state;
    try {
      const player = await Player.signUp(username, password);
      this.props.onLogin(player);
    } catch (error) {
      this.setState({ error });
    }
  }

  submit (e) {
    e.preventDefault();
    switch (this.state.mode) {
      case 'login': return this.login();
      case 'sign up': return this.signUp();
    }
  }

  renderTabs () {
    return ['login', 'sign up'].map(mode => {
      const isSelected = this.state.mode === mode;
      const className = `tab${isSelected ? ' selected' : ''}`;
      return (
        <button className={className} onClick={() => this.setState({ mode })}>{mode}</button>
      );
    })
  }

  render () {
    const { username, password, error, mode } = this.state;
    return (
      <div className="login">
        <div className="row">
          {this.renderTabs()}
        </div>
        <form onSubmit={e => this.submit(e)}>
          <img src="https://cdn.glitch.com/5bb393f1-e781-4a01-8e4e-4b05e66e3d36%2Flogo.png?1527979638257" />

          {error && (
            <div className="error">{error}</div>
          )}

          <div className="column">
            <label for="username">username</label>
            <input id="username" value={username} onChange={e => this.setState({ username: e.target.value })} />
          </div>

          <div className="column">
            <label for="password">password</label>
            <input id="password" type="password" value={password} onChange={e => this.setState({ password: e.target.value })} />
          </div>

          <button>submit</button>
        </form>
      </div>
    );
  }

}
