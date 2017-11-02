import React, { Component } from 'react';
import { convertTemp, formatDate, renderWeekday } from '../utils';

const windDirections = [
  ['N', 348.75, 11.25],
  ['NNE', 11.26, 33.75],
  ['NE', 33.76, 56.25],
  ['ENE', 56.26, 78.75],
  ['E', 78.76, 101.25],
  ['ESE', 101.26, 123.75],
  ['SE', 101.76, 146.25],
  ['SSE', 146.26, 168.75],
  ['S', 168.76, 191.25],
  ['SSW', 191.26, 213.75],
  ['SW', 213.76, 236.25],
  ['WSW', 236.26, 258.75],
  ['W', 258.76, 281.25],
  ['WNW', 281.26, 303.75],
  ['NW', 303.76, 326.25],
  ['NNW', 326.76, 348.74],
]

class ForecastDetail extends Component {
  renderWindDirection(windDegree) {
    for (let i = 0; i < windDirections.length; i++) {
      if (i === 0 && (windDegree >= windDirections[i][1] ||
          windDegree <= windDirections[i][2])) {
            return windDirections[i][0];
      }

      if (windDegree >= windDirections[i][1] &&
          windDegree <= windDirections[i][2]) {
            return windDirections[i][0];
      }
    }
    return null;
  }


  render() {
    let day = this.props.selectedWeatherObject;

    if (day === null) {
      return (
        <div>Loading...</div>
      );
    } else {
      let image = `/images/${day.imageId}.png`;
      let weekday = renderWeekday(day.date);
      let date = formatDate(day.date).join(' ');

      return (
        <div className="forecast-detail-container">
          <div className="forecast-detail-date">
            <section>{ weekday }</section>
            <section>{ date }</section>
          </div>
          <div className="forecast-detail">
            <section className="forecast-detail-panel">
              <div>
                <img className="forecast-detail-img" src={ image } alt={day.group}/>
              </div>
              <section>{ day.description }</section>
              <section>Current Temperature</section>
              <section>{ convertTemp(day.currentTemp, 'F') }&deg;F</section>
            </section>
            <section className="forecast-detail-panel">
              <ul className="forecast-detail-list">
                <li>Highs: { convertTemp(day.highTemp, 'F') } &deg;F</li>
                <li>Lows: { convertTemp(day.lowTemp, 'F') } &deg;F</li>
                <li>Humidity: { day.humidity }&#37;</li>
                <li>Wind Speed: {day.windSpeed} meters/sec</li>
                <li>Wind Direction: { this.renderWindDirection(day.windDirectionDeg) }</li>
              </ul>
            </section>
          </div>
        </div>
      );
    }
  }
}

export default ForecastDetail;
