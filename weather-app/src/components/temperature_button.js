import React from 'react';
import { TEMP_UNIT } from '../constants';

/*
  Renders either the 'F' or 'C' temperature button.
  @param {char} the current temperature unit, either 'F' or 'C'
  @param {function} onTempUnitChange function that passes the unit to the
    handleTempUnitChange funciton
*/
const TemperatureButton = (props) => {
  let currentTempUnit = props.currentTempUnit;

  let newTemp = (currentTempUnit === TEMP_UNIT.FAHRENHEIT) ?
    TEMP_UNIT.CELSIUS : TEMP_UNIT.FAHRENHEIT;

  return (
    <div className="temperature-button"
      onClick={ () => props.onTempUnitChange(newTemp) }>
        &deg;{ newTemp }
    </div>
  );
}

export default TemperatureButton;
