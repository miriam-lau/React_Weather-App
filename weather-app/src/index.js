import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'whatwg-fetch';

import SearchBar from './components/search_bar';
import ForecastList from './components/forecast_list';
import ForecastDetail from './components/forecast_detail';
import TemperatureButton from './components/temperature_button';
import { TEMP_UNIT, MONTHS, WEEKDAYS } from './constants';

const API_KEY = "7bdc76a23dde6b78698183d3a8bf49ec";


// UTC to user local time
class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      weatherData: null,
      forecastList: [],
      selectedDay: null,
      city: "",
      tempUnit: TEMP_UNIT.FAHRENHEIT,
    };
  }

  /*
    Mount component with default data upon page load. 'moment' gets client
    browser location, and the location is passed to the fetchForecast function.
  */
  componentWillMount() {
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported by this browser.");
      let moment = require('moment-timezone');
      let currentTimeZone = moment.tz.guess();

      let defaultLocation = currentTimeZone.split('/');
      let defaultCityChars = defaultLocation[1].split("");

      let defaultCity = "";
      for (let i = 0; i < defaultCityChars.length; i++) {
        if (defaultCityChars[i] === '_') {
          defaultCity += " ";
          continue;
        }
        defaultCity += defaultCityChars[i];
      }

      let weatherRequestURL = this.getWeatherRequestURL(
          `${defaultCity}, ${defaultLocation[0]}`);
      this.fetchForecast(weatherRequestURL);

    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        let clientLocationLatitude = position.coords.latitude;
        let clientLocationLongtitude = position.coords.longitude;

        let city = "sunnyvale, ca";
        let newrequest = `http://api.openweathermap.org/data/2.5/forecast?q=${city},us&appid=${API_KEY}`

        let weatherRequestURL = `http://api.openweathermap.org/data/2.5/forecast?lat=${clientLocationLatitude}&lon=${clientLocationLongtitude}&appid=${API_KEY}`;
        this.fetchForecast(weatherRequestURL);
        // this.fetchForecast(newrequest);
      });
    }
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
  capitalizeFirstLetters(words) {
    let result = [];

    for (let i = 0; i < words.length; i++) {
      let currentFirstChar = words[i].charAt(0).toUpperCase();
      result.push(currentFirstChar + words[i].slice(1));
    }
    return result.join(" ");
  }

  /*
    Capitalize the first letter of the city and both letters of the state.
    @param {string} city, state
    return {string}
  */
  formatCityName(location) {
    let words = location.split(" ");

    let city = words.slice(0, (words.length - 1));
    let formattedCity = this.capitalizeFirstLetters(city);

    let country = words[(words.length - 1)].toUpperCase();

    return `${formattedCity} ${country}`;
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

      let description = currentDaySummary.description;
      let formattedDescription = "";
      if (description !== "") {
        let descriptionWords = currentDaySummary.description.split(" ");
        formattedDescription = this.capitalizeFirstLetters(descriptionWords);
      }

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
        description: formattedDescription,
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
  Updates state and passes weather data to convertToForecastList function
  but not save all the data?
  @param {char} 'F' or 'C'
  return {null}
  */
  handleTempUnitChange(unit) {
    this.setState({ tempUnit: unit });
    this.convertToForecastList(this.state.weatherData);
    return null;
  }

  /*
    API call to fetch weather data
    @param {string} city, state
    return {null}
  */
  fetchForecast(weatherURLRequest) {
    fetch(weatherURLRequest).then(response => {
      if (response.status !== 200) {
        console.log("RESPONSE ERROR", response.status);
        return;
      }
      response.json().then(data => {
        console.log("DATA", data);
        let forecastList = this.convertToForecastList(data.list);
        this.setState({
          weatherData: data.list,
          forecastList: forecastList,
          selectedDay: forecastList[0],
          city: `${data.city.name}, ${data.city.country}`
        });
      });
    }).catch(err => {
      console.log("FETCH ERROR", err);
    });
  }

  getWeatherRequestURL(city) {
    return (`http://api.openweathermap.org/data/2.5/forecast?q=${city},us&appid=${API_KEY}`);
  }

  render() {
    return (
      <div className="application-container">
        <header>
          <img className="weather-icon"
              src="/weather_favicon.png"
              alt="weather-icon" />
          <section className="search-bar-container">
            <article>Enter a City:</article>
            <SearchBar
              onSearchCityChange={ city => this.fetchForecast(this.getWeatherRequestURL(city)) }/>
          </section>
          <TemperatureButton
            currentTempUnit={ this.state.tempUnit }
            onTempUnitChange={ unit => this.handleTempUnitChange(unit) }/>
        </header>

        <main className="forecast-container">
          <div className="cityName">
              Weather for { this.formatCityName(this.state.city) }
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
