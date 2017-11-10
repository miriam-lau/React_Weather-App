import React from 'react';
import { TEMPERATURE_UNITS } from '../constants';

/**
  * Renders either the 'F' or 'C' temperature button.
  * @param {props}
  * @param {char} props.currentTemperatureUnit - 'F' or 'C'
  * @param {function} onTemperatureUnitChange - passes the new temperature unit
      to the function
*/
const TemperatureButton = (props) => {
  let newTemperature =
      (props.currentTemperatureUnit === TEMPERATURE_UNITS.FAHRENHEIT) ?
          TEMPERATURE_UNITS.CELSIUS : TEMPERATURE_UNITS.FAHRENHEIT;

  return (
    <div className="temperature-button"
      onClick={ () => props.onTemperatureUnitChange(newTemperature) }>
        &deg;{ newTemperature }
    </div>
  );
}

export default TemperatureButton;
