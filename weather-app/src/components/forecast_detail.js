import React, { Component } from 'react';

/*
  List of cardinal directions and their starting degree values.
*/
const CARDINAL_DIRECTIONS = [
  ['N', 348.75],
  ['NNE', 11.25],
  ['NE', 33.75],
  ['ENE', 56.25],
  ['E', 78.75],
  ['ESE', 101.25],
  ['SE', 101.75],
  ['SSE', 146.25],
  ['S', 168.75],
  ['SSW', 191.25],
  ['SW', 213.75],
  ['WSW', 236.25],
  ['W', 258.75],
  ['WNW', 281.25],
  ['NW', 303.75],
  ['NNW', 326.75],
]

class ForecastDetail extends Component {
  /*
    Converts the degrees to a cardinal direction.
    @param {float degrees} wind degrees
    return {string | null}
  */
  getWindDirection(degrees) {
    for (let i = 0; i < (CARDINAL_DIRECTIONS.length); i++) {
      if (i === 0 && (degrees >= CARDINAL_DIRECTIONS[i][1] ||
          degrees < CARDINAL_DIRECTIONS[i + 1][1])) {
            return CARDINAL_DIRECTIONS[i][0];
      }

      if (degrees >= CARDINAL_DIRECTIONS[i][1] &&
          degrees < CARDINAL_DIRECTIONS[i + 1][1]) {
            return CARDINAL_DIRECTIONS[i][0];
      }
    }
    return null;
  }
  // normal convert 11 degrees to 'N'
  // normal convert 350 to degrees to 'N'
  // normal convert 45.1 degrees to "NE"
  // if degress < 0 should fail
  // if degrees > 360 should fail

  render() {
    let info = this.props.selectedWeather;

    if (info === null) {
      return <div className="forecast-detail-loading">Loading...</div>
    }

    let image = `/images/${info.imageId}.png`;

    return (
      <div className="forecast-detail">
        <section className="forecast-detail-date">
          <article>{ info.weekday }</article>
          <article>{ info.dateStr }</article>
        </section>
        <div className="forecast-detail-panel-container">
          <section className="forecast-detail-left-panel">
            <img className="forecast-detail-img" src={ image } alt={info.group}/>
            <article>{ info.description }</article>
            <article>Current Temperature</article>
            <article>{ info.currentTemp } &deg;{ this.props.tempUnit }</article>
          </section>
          <section className="forecast-detail-right-panel">
            <ul>
              <li>Highs: { info.highTemp } &deg;{ this.props.tempUnit }</li>
              <li>Lows: { info.lowTemp } &deg;{ this.props.tempUnit }</li>
              <li>Humidity: { info.humidity }&#37;</li>
              <li>Wind Speed: { info.windSpeed } m/s</li>
              <li>Wind Direction: { this.getWindDirection(info.windDegrees) }</li>
            </ul>
          </section>
        </div>
      </div>
    );
  }
}

export default ForecastDetail;
