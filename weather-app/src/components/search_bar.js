import React, { Component } from 'react';

class SearchBar extends Component {
  constructor(props) {
    super(props)

    this.state = { location: "" };
  }

  /**
    * Passes the location to the onSearchLocationChange function.
    * @param {event} object
    * @return {null}
  */
  handleSubmit(event) {
    event.preventDefault();
    this.props.onSearchLocationChange(this.state.location);
    return null;
  }

  render() {
    return (
      <form onSubmit={ event => this.handleSubmit(event) }>
        <input
          value={ this.state.location }
          onChange={ event => this.setState({ location: event.target.value }) } />
      </form>
    );
  }
}

export default SearchBar;
