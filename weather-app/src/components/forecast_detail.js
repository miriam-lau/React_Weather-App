import React, { Component } from 'react';

/**
  * List of cardinal directions and their starting degree values.
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
  /**
    * Converts the degrees to a cardinal direction.
    * @param {float} degres
    * @return {?string}
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

  render() {
    let info = this.props.selectedWeather;

    if (info === null) {
      return <div className="forecast-detail-loading">Loading...</div>
    }

    let image = `/images/${info.imageId}.png`;

    return (
      <div className="forecast-detail">
        <section className="forecast-detail-day">
          <ul>
            <li>{ info.weekday }</li>
            <li>{ info.dateStr }</li>
            <li>{ info.time }</li>
          </ul>
        </section>
        <section className="forecast-detail-panel">
          <img className="forecast-detail-img" src={ image } alt={info.group}/>
          <ul>
            <li>{ info.description }</li>
            <li>Temperature: { info.currentTemp } &deg;{ this.props.tempUnit }</li>
            <li>Humidity: { info.humidity }&#37;</li>
            <li>Wind Speed: { info.windSpeed } m/s</li>
            <li>Wind Direction: { this.getWindDirection(info.windDegrees) }</li>
          </ul>
        </section>
      </div>
    );
  }
}

export default ForecastDetail;
