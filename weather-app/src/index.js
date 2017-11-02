import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'whatwg-fetch';

import SearchBar from './components/search_bar';
import ForecastList from './components/forecast_list';
import ForecastDetail from './components/forecast_detail';

const API_KEY = "01355dbba826da379de73108f1639cc8";

class App extends Component {
  constructor(props) {
    super(props)

    this.state = { forecastList: [], selectedDay: null, cityName: "" };
  }

  formatDescription(str) {
    let resultArr = [];
    let splitStr = str.split(" ");
    for (let i = 0; i < splitStr.length; i++) {
      let currentFirstChar = splitStr[i].charAt(0).toUpperCase();
      resultArr.push(currentFirstChar + splitStr[i].slice(1));
    }
    return resultArr.join(" ");
  }

  convertToForecastList(weatherData) {
    let forecastList = [];
    for (let i = 0; i < 6; i++) {
      let currentDay = weatherData[i];
      let currentWeatherInfo = currentDay.weather[0];
      console.log("WEATHER", currentWeatherInfo);

      let description = this.formatDescription(currentWeatherInfo.description);

      let currentDayObject = {
        id: currentDay.dt,
        date: new Date(currentDay.dt_txt),
        group: currentWeatherInfo.main,
        description: description,
        currentTemp: currentDay.main.temp,
        highTemp: currentDay.main.temp_max,
        lowTemp: currentDay.main.temp_min,
        humidity: currentDay.main.humidity,
        imageId: currentWeatherInfo.icon,
        // wind speed is in meters per sec
        windSpeed: currentDay.wind.speed,
        windDirectionDeg: currentDay.wind.deg
      }

      console.log('WEATHER OBJECT', currentDayObject);

      forecastList.push(currentDayObject);
    }

    return forecastList;
  }

  fetchForecast(cityName) {
    this.setState({ cityName });
    let weatherURLRequest = `http://api.openweathermap.org/data/2.5/forecast?q=
        ${cityName},us&appid=${API_KEY}`;

    fetch(weatherURLRequest).then(response => {
      if (response.status !== 200) {
        console.log("RESPONSE ERROR", response.status);
        return;
      }
      response.json().then(data => {
        console.log("DATA", data);
        this.setState({ forecastList: this.convertToForecastList(data.list) });
        console.log("FETCH FORECAST", data.list);
      });
    }).catch(err => {
      console.log("FETCH ERROR", err);
    });
  }

  render() {
    return (
      <div className="application-container">
        <SearchBar onSearchCityChange={ cityName => this.fetchForecast(cityName) }/>
        <div className="forecast-container">
          <div className="cityName">Weather for { this.state.cityName }</div>
          <div className="forecast-info-container">
            <ForecastDetail selectedWeatherObject={ this.state.selectedDay }/>
            <section className="forecast-summary">
              <h2>5-Day Forecast</h2>
              <ForecastList
                forecastList={ this.state.forecastList }
                onDaySelect={ selectedDay => this.setState({ selectedDay }) }
              />
            </section>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
