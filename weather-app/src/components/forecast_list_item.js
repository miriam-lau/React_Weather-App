import React, { Component } from 'react';
import { convertTemp, renderWeekday } from '../utils';

class ForecastListItem extends Component {
  render() {
    let info = this.props.weatherObject;
    let weekday = renderWeekday(info.date);
    let image = `/images/${info.imageId}.png`;

    return (
      <div className="forecast-list-item" onClick={ () => this.props.onDaySelect(this.props.weatherObject) }>
        <section>{ weekday }</section>
        <div className="forecast-image">
          <img className="forecast-list-item-img" src={ image } alt={info.group}/>
        </div>
        <section className="forecast-description">{ info.description }</section>
        <section>
          <span>{ convertTemp(info.highTemp, 'F') } &deg;F /&nbsp;
            { convertTemp(info.lowTemp, 'F') } &deg;F</span>
        </section>
      </div>
    );
  }
}

export default ForecastListItem;
