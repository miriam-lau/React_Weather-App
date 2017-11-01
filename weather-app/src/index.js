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

    this.state = { forecastList: [
        { day: "Monday", weather: "Partly Cloudy", highTemp: 78, lowTemp: 65 },
        { day: "Tuesday", weather: "Rain", highTemp: 78, lowTemp: 65 },
        { day: "Wednesday", weather: "Sunny", highTemp: 78, lowTemp: 65 },
        { day: "Thursday", weather: "Sunny", highTemp: 78, lowTemp: 65 },
        { day: "Friday", weather: "Sunny", highTemp: 78, lowTemp: 65 },
      ]
    };
  }

  convertToForecastList(openWeatherData) {
    let forecastList;
    return forecastList;
  }

  fetchForecast(cityName) {
    let result;
    console.log("IN FETCHFORECAST");
    fetch("http://api.openweathermap.org/data/2.5/forecast?q=" + cityName + ",us&appid=" + API_KEY).then(results => {
      return results.json();
    }).then(data => {
      if (data.cod != "200") {
        // Display error.
        return;
      }
      this.setState({ forecastList: convertToForecastList(data.list) });
      console.log("FETCH FORECAST", data.list);
    })
  }

  render() {
    return (
      <div className="application-container">
        <SearchBar onSearchCityChange={ (e) => this.fetchForecast(e) }/>
        <h2>5-Day Forecast</h2>
        <ForecastList forecastList={ this.state.forecastList }/>
        <ForecastDetail />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
