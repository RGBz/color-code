import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class TabBar extends Component {

  render () {
    const { tabs, selectedTab, onTabClick } = this.props;
    return (
      <div className="tab-bar">
        {tabs.map(label => {
          const className = ['tab'];
          if (label === selectedTab) {
            className.push('selected');
          }
          return (
            <div key={label} className={className.join(' ')} onClick={() => onTabClick(label)}>
              {label}
            </div>
          );
        })}
      </div>
    );
  }

}

TabBar.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  selectedTab: PropTypes.string.isRequired,
  onTabClick: PropTypes.func,
};
