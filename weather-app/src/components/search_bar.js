import React, { Component } from 'react';

class SearchBar extends Component {
  constructor(props) {
    super(props)

    this.state = { cityName: "" };
  }

  onInputChange(cityName) {
    this.setState({ cityName: cityName });
    this.props.onSearchCityChange({ cityName });
  }

  render() {
    return (
      <div className="search-bar">
        <input
          value={ this.state.term }
          onChange={ (event) => this.onInputChange(event.target.value) } />
      </div>
    );
  }
}

export default SearchBar;
