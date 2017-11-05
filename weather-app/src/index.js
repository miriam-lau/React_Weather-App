import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'whatwg-fetch';

import SearchBar from './components/search_bar';
import ForecastList from './components/forecast_list';
import ForecastDetail from './components/forecast_detail';
import TemperatureButton from './components/temperature_button';
import { TEMP_UNIT } from './constants';

/**
*/
const API_KEY = "7bdc76a23dde6b78698183d3a8bf49ec";

/**
*/
const API_KEY2 = "41724c44a2967f32ad9b4f080620c0fb";

/**
*/
const FIVE = 5;


class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      /** {object data} in weather response */
      weatherData: null,
      forecastList: [], // an array of weather objects
      selectedDay: null, // day selected to display in forecastDetail component
      city: "", // location for weather data in format "city, country"
      tempUnit: TEMP_UNIT.FAHRENHEIT, // temp unit to convert temperature to,
        // either 'F' or 'C'
    };
  }

  /*
    Mount component with default data upon page load. If geolocation is not
      supported, 'moment' gets client timezone. The location is passed to the
      fetchForecast function.
  */
  componentWillMount() {
    if (!navigator.geolocation) {
      console.log("GEOLOCATION DISABLED OR NOT SUPPORTED");
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
        let clientLatitude = position.coords.latitude;
        let clientLongtitude = position.coords.longitude;

        let weatherRequestURL = `http://api.openweathermap.org/data/2.5/forecast?lat=${clientLatitude}&lon=${clientLongtitude}&appid=${API_KEY}`;
        this.fetchForecast(weatherRequestURL);
      });
    }
  }

  /*
    Converts temperature in Kelvin to either Celsius or Fahrenheit.
    @param {int temp} temperature in Kelvin
    @return {int | null}
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
    @param {object date} Date object
    return {string} string with format "month day year"
  */
  formatDate(date) {
    let month = date.toLocaleDateString("en-US", { month: "short" });
    let day = date.getDate();
    let year = date.getFullYear();

    return (`${month} ${day}, ${year}`);
  }

  /*
    Get the associated weekday for the date.
    @param {object date} Date object
    @return {string} weekday
  */
  getWeekday(date) {
    let today = new Date();
    let todayLocalTime = new Date(`${today} UTC`);

    if (date.getMonth() === todayLocalTime.getMonth() &&
        date.getDate() === todayLocalTime.getDate() &&
        date.getFullYear() === todayLocalTime.getFullYear()) {
          return "Today";
    }

    return date.toLocaleDateString("en-US", { weekday: "short" });
  }

  /*
    Capitalize the first letter of each word in the array.
    @param {array words} an array of words
    @return {string}
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
    @param {string location} city, country
    @return {string} city, country
  */
  formatCityName(location) {
    let words = location.split(" ");

    let city = words.slice(0, (words.length - 1));
    let formattedCity = this.capitalizeFirstLetters(city);

    let country = words[(words.length - 1)].toUpperCase();

    return `${formattedCity} ${country}`;
  }

  /*
    Convert weather data response into objects for forecast list.
    @param {object weather} weather data
    @return {array forecastList{objects weather}} an array of weather objects
  */
  convertToForecastList(weatherData) {
    let forecastList = [];

    let dayToAddToForecastList = new Date(`${weatherData[0].dt_txt} UTC`).getDate();
    for (let i = 0; i < weatherData.length; i++) {
      if (forecastList.length === FIVE) {
        break;
      }

      let currentWeather = weatherData[i];
      let currentWeatherDay = new Date(`${currentWeather.dt_txt} UTC`);
      if (currentWeatherDay.getDate() !== dayToAddToForecastList) {
        continue;
      }

      let description = currentWeather.weather[0].description;
      let formattedDescription = (description === "" ?
          "" : this.capitalizeFirstLetters(description.split(" ")));

      let formattedDate = this.formatDate(currentWeatherDay);
      let weekday = this.getWeekday(currentWeatherDay);
      let currentTemp = this.convertTemp(currentWeather.main.temp);
      let highTemp = this.convertTemp(currentWeather.main.temp_max);
      let lowTemp = this.convertTemp(currentWeather.main.temp_min);

      let newCurrentWeather = {
        id: currentWeather.dt,
        date: currentWeatherDay,
        dateStr: formattedDate,
        weekday: weekday,
        group: currentWeather.weather[0].main,
        description: formattedDescription,
        currentTemp: currentTemp,
        highTemp: highTemp,
        lowTemp: lowTemp,
        humidity: currentWeather.main.humidity,
        imageId: currentWeather.weather[0].icon,
        windSpeed: currentWeather.wind.speed, // wind speed is in meters per sec
        windDegrees: currentWeather.wind.deg
      }

      forecastList.push(newCurrentWeather);
      dayToAddToForecastList += 1;
    }

    return forecastList;
  }

  /*
  Updates state properties:
    "tempUnit" with new temperature unit
    "forecastList" with result from calling convertToForecastList function passing
      in the weather data
    "selectedDay" with a new object with the same id in the new forecastList
  @param {char} 'F' or 'C'
  */
  handleTempUnitChange(unit) {
    this.setState({ tempUnit: unit }, () => {
      this.setState({ forecastList: this.convertToForecastList(this.state.weatherData) },
        () => {
          let forecastList = this.state.forecastList;
          for (let i = 0; i < forecastList.length; i++) {
            if (forecastList[i].id === this.state.selectedDay.id) {
              this.setState({ selectedDay: forecastList[i] });
            }
          }
        }
      );
    });
  }

  /*
    API call to fetch weather data
    @param {string weatherURLRequest} URL request
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

  /*
    Creates the url request string.
    @param {string city} city, country
    @return {string}
  */
  getWeatherRequestURL(city) {
    return (
      `http://api.openweathermap.org/data/2.5/forecast?q=${city},us&appid=${API_KEY}`
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
            <article>Enter a City:</article>
            <SearchBar
                onSearchCityChange={ city => {
                  this.fetchForecast(this.getWeatherRequestURL(city))
                }} />
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
