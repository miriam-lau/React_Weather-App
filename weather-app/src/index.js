import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'whatwg-fetch';

import SearchBar from './components/search_bar';
import ForecastList from './components/forecast_list';
import ForecastDetail from './components/forecast_detail';
import TemperatureButton from './components/temperature_button';
import { TEMP_UNIT } from './constants';

const API_KEY = "7bdc76a23dde6b78698183d3a8bf49ec";
const API_KEY2 = "41724c44a2967f32ad9b4f080620c0fb";
const FIVE = 5;
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday",
    "Friday", "Saturday"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug",
    "Sep", "Oct", "Nov", "Dec"];


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
        let clientLatitude = position.coords.latitude;
        let clientLongtitude = position.coords.longitude;

        let weatherRequestURL = `http://api.openweathermap.org/data/2.5/forecast?lat=${clientLatitude}&lon=${clientLongtitude}&appid=${API_KEY}`;
        this.fetchForecast(weatherRequestURL);
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
    return {array} an array of weather objects
  */
  convertToForecastList(weatherData) {
    let forecastList = [];
    let dayToAddToForecastList = new Date(weatherData[0].dt_txt).getDate();
    for (let i = 0; i < weatherData.length; i++) {
      if (forecastList.length === FIVE) {
        break;
      }

      let currentWeather = weatherData[i];
      let currentWeatherDay = new Date(currentWeather.dt_txt);
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
  Updates state and passes weather data to convertToForecastList function
  but not save all the data?
  @param {char} 'F' or 'C'
  return {null}
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
