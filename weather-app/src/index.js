import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'whatwg-fetch';

import SearchBar from './components/search_bar';
import ForecastList from './components/forecast_list';
import ForecastDetail from './components/forecast_detail';
import TemperatureButton from './components/temperature_button';
import { TEMP_UNIT, MONTHS, WEEKDAYS } from './constants';

const API_KEY = "01355dbba826da379de73108f1639cc8";


// UTC to user local time
class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      forecastList: [],
      selectedDay: null,
      cityName: "san francisco, ca",
      tempUnit: TEMP_UNIT.FAHRENHEIT,
    };
  }

  componentWillMount() {
    this.fetchForecast("san francisco, ca");
  }

  /*
    Converts temperature in Kelvin to either Celsius or Fahrenheit.
    @param {int} temperature in Kelvin
    @param {char} 'F' or 'C'
    return {int}
  */
  convertTemp(temp) {
    let tempCelsius = temp - 273.15;
    switch (this.state.tempUnit) {
      case TEMP_UNIT.CELSIUS:
        return Math.round(tempCelsius);
      case TEMP_UNIT.FAHRENHEIT:
        return Math.round(((tempCelsius * 9) / 5) + 32);
      default:
        return null;
    }
  }

  /*
    Takes date object and parses together the month, day and year.
    @param {date} Date object
    return {string} string with format "month day year"
  */
  formatDate(date) {
    let month = MONTHS[date.getMonth()];
    let day = date.getDate();
    let year = date.getFullYear();

    return (`${month} ${day}, ${year}`);
  }

  /*
    Get the associated weekday for the date.
    @param {date} Date object
    return {string} weekday
  */
  getWeekday(date) {
    let today = new Date();

    if (date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate() &&
        date.getFullYear() === today.getFullYear()) {
          return "Today";
    }

    return WEEKDAYS[date.getDay()];
  }

  /*
    Capitalize the first letter of each word in the description string.
    @param {string} description
    return {string}
  */
  formatDescription(str) {
    let resultArr = [];
    let splitStr = str.split(" ");

    if (splitStr.length < 1) {
      return;
    }

    for (let i = 0; i < splitStr.length; i++) {
      let currentFirstChar = splitStr[i].charAt(0).toUpperCase();
      resultArr.push(currentFirstChar + splitStr[i].slice(1));
    }
    return resultArr.join(" ");
  }

  /*
    Capitalize the first letter of the city and both letters of the state.
    @param {string} city, state
    return {string}
  */
  formatCityName(str) {
    let resultArr = [];
    let splitStr = str.split(" ");

    if (splitStr.length < 2) {
      return;
    }

    for (let i = 0; i < (splitStr.length - 1); i++) {
      let cityFirstLetter = splitStr[i].charAt(0).toUpperCase();
      resultArr.push(cityFirstLetter + splitStr[i].slice(1));
    }

    let state = splitStr[(splitStr.length - 1)].toUpperCase();
    resultArr.push(state);

    return resultArr.join(" ");
  }

  /*
    Parse weather data response to objects for forecast list.
    @param {object{object}} weather data
    @param {string} temperature unit, default to 'F' if no char is passed in
    return {array} an array of weather objects
  */
  convertToForecastList(weatherData) {
    let forecastList = [];
    // james: make the 6 a constant.
    for (let i = 0; i < 6; i++) {
      let currentDay = weatherData[i];
      let currentDaySummary = currentDay.weather[0];

      let description = this.formatDescription(currentDaySummary.description);
      let date = new Date(currentDay.dt_txt);
      let formattedDate = this.formatDate(date);
      let weekday = this.getWeekday(date);
      let currentTemp = this.convertTemp(currentDay.main.temp, this.state.tempUnit);
      let highTemp = this.convertTemp(currentDay.main.temp_max, this.state.tempUnit);
      let lowTemp = this.convertTemp(currentDay.main.temp_min, this.state.tempUnit);

      let newCurrentDay = {
        id: currentDay.dt,
        date: date,
        dateStr: formattedDate,
        weekday: weekday,
        group: currentDaySummary.main,
        description: description,
        currentTemp: currentTemp,
        highTemp: highTemp,
        lowTemp: lowTemp,
        humidity: currentDay.main.humidity,
        imageId: currentDaySummary.icon,
        windSpeed: currentDay.wind.speed, // wind speed is in meters per sec
        windDegrees: currentDay.wind.deg
      }

      forecastList.push(newCurrentDay);
    }

    return forecastList;
  }

  /*
    API call to fetch weather data
    @param {string} city, state
    return {null}
  */
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
        let forecastList = this.convertToForecastList(data.list);
        this.setState({
          forecastList: forecastList,
          selectedDay: forecastList[0]
        });
      });
    }).catch(err => {
      console.log("FETCH ERROR", err);
    });
  }

  /*
    Updates state and re-fetches the data  // way to not have to re-fetch data
    but not save all the data?
    @param {char} 'F' or 'C'
    return {null}
  */
  handleTempUnitChange(unit) {
    this.setState({ tempUnit: unit });
    this.fetchForecast(this.state.cityName);
    return null;
  }

  render() {
    return (
      <div className="application-container">
        <header>
          <section className="weather-icon-container">
            <img
              className="weather-icon"
              src="/weather_favicon.png"
              alt="weather-icon"/>
          </section>
          <SearchBar
            onSearchCityChange={ cityName => this.fetchForecast(cityName) }/>
          <TemperatureButton
            currentTempUnit={ this.state.tempUnit }
            onTempUnitChange={ unit => this.handleTempUnitChange(unit) }/>
        </header>

        <main className="forecast-container">
          <div className="cityName">
              Weather for { this.formatCityName(this.state.cityName) }
          </div>
          <div className="forecast-info-container">
            <ForecastDetail
              tempUnit={ this.state.tempUnit }
              selectedWeather={ this.state.selectedDay }/>
            <section className="forecast-summary">
              <h2>5-Day Forecast</h2>
              <ForecastList
                forecastList={ this.state.forecastList }
                tempUnit={ this.state.tempUnit }
                onDaySelect={ selectedDay => this.setState({ selectedDay }) }
              />
            </section>
          </div>
        </main>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
