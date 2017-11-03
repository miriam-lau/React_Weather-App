import React, { Component } from 'react';

// search bar should be on submit for call
// search bar needs city name as well for letters typed but not submitted
class SearchBar extends Component {
  constructor(props) {
    super(props)

    this.state = { cityName: "" };
  }

  /*
    Updates the city name and passes the city name to the onSearchCityChange
    function.
    @param {string} city name
    return {null}
  */
  handleSubmit(event) {
    console.log("EVENT", event);
    this.setState({ cityName: event });
    this.props.onSearchCityChange(event);
    return null;
  }

  render() {
    return (
      <form className="search-bar">
        <input
          value={ this.state.cityName }
          onChange={ event => this.handleSubmit(event.target.value) }/>
      </form>
    );
  }
}

export default SearchBar;
