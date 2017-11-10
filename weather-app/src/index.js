import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'whatwg-fetch';

import SearchBar from './components/search_bar';
import ForecastList from './components/forecast_list';
import ForecastDetail from './components/forecast_detail';
import TemperatureButton from './components/temperature_button';
import { TEMPERATURE_UNITS } from './constants';

let moment = require('moment-timezone');

/**
  * OpenWeatherMap API keys.
  * @param {string[]} api key
*/
const API_KEYS = ["7bdc76a23dde6b78698183d3a8bf49ec",
    "41724c44a2967f32ad9b4f080620c0fb"];

/**
  * Number of forecast list items.
*/
const NUM_DAYS_TO_DISPLAY = 5;


class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      /** @type {object[]} weather objects */
      forecastList: [],
      /** @type {object} day selected to display in forecastDetail component */
      selectedDay: null,
      /** @type {string} city name */
      cityName: "",
      /** @type {string} city country */
      cityCountry: "",
      /** @type {char} current temperature unit either 'F' or 'C' */
      temperatureUnit: TEMPERATURE_UNITS.FAHRENHEIT,
    };
  }

  /**
    Mount component with default data upon page load.
  */
  componentWillMount() {
    if (!navigator.geolocation) {
      console.log("GEOLOCATION DISABLED OR NOT SUPPORTED");
      let currentTimeZone = moment.tz.guess();

      let clientLocation = currentTimeZone.split('/');
      let clientLocationCityChars = clientLocation[1].split("");

      let clientLocationCity = "";
      for (let i = 0; i < clientLocationCityChars.length; i++) {
        if (clientLocationCityChars[i] === '_') {
          clientLocationCity += " ";
          continue;
        }
        clientLocationCity += clientLocationCityChars[i];
      }

      let weatherRequestURL = this.getWeatherRequestURL(
        `${clientLocationCity}, ${clientLocation[0]}`);
      this.fetchForecast(weatherRequestURL);
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      let clientLatitude = position.coords.latitude;
      let clientLongtitude = position.coords.longitude;
      let ApiKey = this.getRandomApiKey();

      let weatherRequestURL = `http://api.openweathermap.org/data/2.5/` +
          `forecast?lat=${clientLatitude}&lon=${clientLongtitude}&appid=${ApiKey}`;
      this.fetchForecast(weatherRequestURL);
    });
  }

  /**
    * Get the Api Key.
    * @return {string} api key
  */
  getRandomApiKey() {
    let index = Math.floor(Math.random() * 2);
    return API_KEYS[index];
  }

  /**
    * Takes date object and parses together the month, day and year.
    * @param {object} date
    * @return {string} the date in format "month day year"
  */
  formatDate(date) {
    let month = date.toLocaleDateString("en-US", { month: "short" });
    let day = date.getDate();
    let year = date.getFullYear();

    return (`${month} ${day}, ${year}`);
  }

  /**
    * Get the day of the week.
    * @param {object} date
    * @return {string} day of week
  */
  getDayString(date) {
    let today = new Date();

    if (date.toLocaleDateString("en-US") === today.toLocaleDateString("en-US")) {
      return "Today";
    }

    return date.toLocaleDateString("en-US", { weekday: "short" });
  }

  /**
    * Capitalize the first letter of each word in the array.
    * @param {string[]} words
    * @return {string}
  */
  capitalizeFirstLetters(words) {
    let result = [];

    for (let i = 0; i < words.length; i++) {
      if (words[i].length < 1) {
        continue;
      }

      let currentFirstChar = words[i].charAt(0).toUpperCase();
      result.push(currentFirstChar + words[i].slice(1));
    }
    return result.join(" ");
  }

  /**
    * Capitalize the first letter of each word in the city and all letters of the country.
    * @param {string} name of city
    * @param {string} country
    * @return {string} city, country
  */
  formatLocationName(name, country) {
    let formattedCity;
    let formattedCountry;

    if (name.length < 1) {
      formattedCity = "ERROR";
    }

    if (country.length < 1) {
      formattedCountry = "ERROR";
    }

    formattedCity = this.capitalizeFirstLetters(name.split(" "));
    formattedCountry = country.toUpperCase();

    return `${formattedCity}, ${formattedCountry}`;
  }

  /**
    * Checks if time is a valid time.
    * @param {string} time
    * @return {boolean}
  */
  checkValidTimesToAddToForecastList(time) {
    let validTimes = ["11:00 AM", "11:30 AM", "12:00 PM",
        "12:30 PM", "1:00 PM", "1:30 PM"];
    for (let i = 0; i < validTimes.length; i++) {
      if (time === validTimes[i]) {
        return true;
      }
    }
    return false;
  }

  /**
    * Convert weather data response into objects for forecast list.
    * @param {object} weather data
    * @return {object[]} forecastList - an array of weather objects
  */
  convertToForecastList(weatherData) {
    let forecastList = [];
    let nextDayToAddToForecastList = new Date(`${weatherData[0].dt_txt} UTC`).getDate();

    for (let i = 0; i < weatherData.length; i++) {
      if (forecastList.length === NUM_DAYS_TO_DISPLAY) {
        break;
      }

      let weather = weatherData[i];
      let weatherDay = new Date(`${weather.dt_txt} UTC`);
      let time = weatherDay.toLocaleTimeString("en-US",
          { hour12: true, hour: "numeric", minute: "numeric" });

      if (weatherDay.getDate() !== nextDayToAddToForecastList) {
        continue;
      }

      if (forecastList.length !== 0) {
        if (weatherDay.getDate() !== nextDayToAddToForecastList ||
            this.checkValidTimesToAddToForecastList(time) === false) {
          continue;
        }
      }

      let description = weather.weather[0].description;
      let formattedDescription = this.capitalizeFirstLetters(description.split(" "));
      let formattedDate = this.formatDate(weatherDay);
      let weekday = this.getDayString(weatherDay);

      let newWeather = {
        id: weather.dt,
        date: weatherDay,
        dateStr: formattedDate,
        weekday: weekday,
        time: time,
        group: weather.weather[0].main,
        description: formattedDescription,
        temperature: weather.main.temp,
        humidity: weather.main.humidity,
        imageId: weather.weather[0].icon,
        /** wind speed is in meters per sec */
        windSpeed: weather.wind.speed,
        windDegrees: weather.wind.deg
      }

      forecastList.push(newWeather);
      nextDayToAddToForecastList += 1;
    }

    return forecastList;
  }

  /**
    * Updates state with the new temperature unit.
    * @param {char} unit - either 'F' or 'C'
  */
  handleTemperatureUnitChange(unit) {
    this.setState({ temperatureUnit: unit });
    return;
  }

  /**
    * API call to fetch weather data.
    * @param {string} weatherURLRequest
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
          forecastList: forecastList,
          selectedDay: forecastList[0],
          cityName: data.city.name,
          cityCountry: data.city.country
        });
      });
    }).catch(err => {
      console.log("FETCH ERROR", err);
    });
  }

  /**
    * Creates the url request string.
    * @param {string} location - format "city, country"
    * @return {string}
  */
  getWeatherRequestURL(location) {
    let ApiKey = this.getRandomApiKey();
    console.log("LOCATION", location);
    return (
      `http://api.openweathermap.org/data/2.5/forecast?q=${location},us&appid=${ApiKey}`
    );
  }

  render() {
    return (
      <div className="application-container">
        <header>
          <img className="weather-icon"
              src="/weather_favicon.png"
              alt="weather-icon" />
          <section className="search-bar-container">
            <article>Enter a Location:</article>
            <SearchBar
                onSearchLocationChange={ location => {
                  this.fetchForecast(this.getWeatherRequestURL(location))
                }} />
            <TemperatureButton
              currentTemperatureUnit={ this.state.temperatureUnit }
              onTemperatureUnitChange={ unit => this.handleTemperatureUnitChange(unit) }
            />
          </section>
          <a href="http://openweathermap.org/">
            <img src="/open_weather_map_logo.png" alt="Open Weather Map Logo" />
          </a>
        </header>

        <main className="forecast-container">
          <div className="location-name">
              Weather for { this.formatLocationName(
                  this.state.cityName, this.state.cityCountry) }
          </div>
          <div className="forecast-info-container">
            <ForecastDetail
              temperatureUnit={ this.state.temperatureUnit }
              selectedWeather={ this.state.selectedDay }/>
            <section className="forecast-summary">
              <h2>5-Day Forecast</h2>
              <ForecastList
                forecastList={ this.state.forecastList }
                temperatureUnit={ this.state.temperatureUnit }
                onDaySelect={ selectedDay => this.setState({ selectedDay }) }
              />
              <article className="forecast-summary-note">
                Future forecasts display weather between 11 AM and 2 PM local time.
              </article>
            </section>
          </div>
        </main>
        <footer>
        </footer>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
