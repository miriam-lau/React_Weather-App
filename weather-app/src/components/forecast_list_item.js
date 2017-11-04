import React from 'react';

/*
  Returns a ForecastListItem.
  @param {int} key is a unique weather id
  @param {char} temperature unit, either 'F' or 'C'
  @param {object} weather object
  @param {function} onDaySelect function, on click passes the weather object to
    the onDaySelect function.
*/
const ForecastListItem = (props) => {
  let info = props.weather;
  let image = `/images/${info.imageId}.png`;

  return (
    <div className="forecast-list-item" onClick={ () => props.onDaySelect(info) }>
      <article>{ info.weekday }</article>
      <div className="forecast-image">
        <img className="forecast-list-item-img" src={ image } alt={info.group}/>
      </div>
      <article>{ info.description }</article>
      <article>{ info.highTemp } &deg;{ props.tempUnit } /&nbsp;
          { info.lowTemp } &deg;{ props.tempUnit }
      </article>
    </div>
  );
}

export default ForecastListItem;
