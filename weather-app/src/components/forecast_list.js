import React from 'react';
import ForecastListItem from './forecast_list_item';

const ForecastList = (props) => {
  if (props.forecastList === undefined) {
    return (
      <div>Loading...</div>
    );
  }

  return (
    <div className="forecast-list">
      {props.forecastList.map(weatherObject => {
        return (
          <ForecastListItem
            key={ weatherObject.id }
            onDaySelect={ props.onDaySelect }
            weatherObject={ weatherObject }
          />
        );
      })}
    </div>
  );
}

export default ForecastList;
