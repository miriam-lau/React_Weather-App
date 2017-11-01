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
      {props.forecastList.map(item => {
        return (
          <ForecastListItem
            key={ item.day }
            forecastInfo={ item }
          />
        );
      })}
    </div>
  );
}

export default ForecastList;
