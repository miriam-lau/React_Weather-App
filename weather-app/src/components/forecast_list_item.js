import React, { Component } from 'react';

const SUNNY = "../images/sunny.png";

const weatherImages = [
  ["Cloudy", "../images/cloudy.png"],
  ["Heavy Snow", "../images/heavy_snow.png"],
  ["Lightning", "../images/lightning.png"],
  ["Partly Cloudy", "../images/partly_cloudy.png"],
  ["Rain", "../images/rain.png"],
  ["Light Rain", "../images/light_rain.png"],
  ["Snow", "../images/snow.png"],
  ["Sunny", "../images/sunny.png"],
  ["Thunderstorms", "../images/thunderstorms.png"],
  ["Windy", "../images/windy.png"]
]

class ForecastListItem extends Component {
  constructor(props) {
    super(props)

    this.renderImage = this.renderImage.bind(this);
  }

  renderImage(weather) {
    let image = "";
    for (let i = 0; i < weatherImages.length; i++) {
      if (weather === weatherImages[i][0]) {
        let image = weatherImages[i][1];
        console.log("IMAGE", image);
        return <img src={require("../images/cloudy.png")} />;
      }
    }
    return null;
  }

  render() {
    let info = this.props.forecastInfo;
    return (
      <div className="forecast-list-item">
        <section>{ info.day }</section>
        <div className="forecast-image">{ this.renderImage(info.weather) }</div>
        <section>
          <span>{ info.highTemp } / { info.lowTemp }</span>
        </section>
      </div>
    );
  }
}

export default ForecastListItem;
