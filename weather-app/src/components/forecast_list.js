import React from 'react';
import ForecastListItem from './forecast_list_item';

/**
  * Returns a ForecastListItem.
  * @param {props}
  * @param {object[]} props.forecastList - an array of weather objects
  * @param {char} props.tempUnit - temperature unit, either 'F' or 'C'
  * @param {function} props.onDaySelect - sets the state of selectedDay
  @return {component} ForecastListItem component
*/
const ForecastList = (props) => {
  return (
    <div className="forecast-list">
      {props.forecastList.map(weather => {
        return (
          <ForecastListItem
            key={ weather.id }
            tempUnit={ props.tempUnit }
            weather={ weather }
            onDaySelect={ props.onDaySelect }
          />
        );
      })}
    </div>
  );
}

export default ForecastList;
