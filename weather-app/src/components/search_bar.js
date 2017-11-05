import React, { Component } from 'react';

class SearchBar extends Component {
  constructor(props) {
    super(props)

    this.state = { city: "" };
  }

  /*
    Passes the city name in state to the onSearchCityChange function.
    @param {event} object
    return {null}
  */
  handleSubmit(event) {
    event.preventDefault();
    this.props.onSearchCityChange(this.state.city);
    return null;
  }

  render() {
    return (
      <form onSubmit={ event => this.handleSubmit(event) }>
        <input
          value={ this.state.city }
          onChange={ event => this.setState({ city: event.target.value }) } />
      </form>
    );
  }
}

export default SearchBar;
