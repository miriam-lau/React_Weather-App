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
