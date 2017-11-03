import React, { Component } from 'react';

// search bar should be on submit for call
// search bar needs city name as well for letters typed but not submitted
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
