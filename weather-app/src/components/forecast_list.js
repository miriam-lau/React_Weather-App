import React from 'react';
import ForecastListItem from './forecast_list_item';

/*
  Returns a ForecastListItem
  @param {array{objects}} forecastList array of weather objects
  @param {char} temperature unit, either 'F' or 'C'
  @param {function} onDaySelect function sets the state of selectedDay
  return {component} ForecastListItem component
*/
const ForecastList = (props) => {
  return (
    <div className="forecast-list">
      {props.forecastList.map(weather => {
        return (
          <ForecastListItem
            key={ weather.id }
            tempUnit={ props.tempUnit }
            onDaySelect={ props.onDaySelect }
            weather={ weather }
          />
        );
      })}
    </div>
  );
}

export default ForecastList;
