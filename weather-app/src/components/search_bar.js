import React, { Component } from 'react';

class SearchBar extends Component {
  constructor(props) {
    super(props)

    this.state = { city: "" };
  }

  onInputSubmit(cityName) {
    this.setState({ city: cityName });
    this.props.onSearchCityChange("sunnyvale, ca");
  }

  render() {
    return (
      <div className="search-bar">
        <input
          value={ this.state.term }
          onChange={ (event) => this.onInputSubmit(event.target.value) } />
      </div>
    );
  }
}

export default SearchBar;
