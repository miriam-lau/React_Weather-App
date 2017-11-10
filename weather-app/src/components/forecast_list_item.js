import React from 'react';
import { convertKelvinToUnit } from '../convert_temperature';

/**
  * Returns a ForecastListItem component.
  * @param {props}
  * @param {char} props.temperatureUnit - temperature unit, either 'F' or 'C'
  * @param {object} props.weather
  * @param {function} props.onDaySelect - on click passes weather to the function
  * @return {html element} div - ForecastListItem
*/
const ForecastListItem = (props) => {
  let info = props.weather;
  let temperature = convertKelvinToUnit(props.weather.temperature, props.temperatureUnit);
  let image = `/images/${info.imageId}.png`;

  return (
    <div className="forecast-list-item" onClick={ () => props.onDaySelect(info) }>
      <article>{ info.weekday }</article>
      <article>{ info.time }</article>
      <div className="forecast-image">
        <img className="forecast-list-item-img" src={ image } alt={info.group}/>
      </div>
      <section className="forecast-list-item-description">{ info.description }</section>
      <section>{ temperature } &deg;{ props.temperatureUnit }</section>
    </div>
  );
}

export default ForecastListItem;
