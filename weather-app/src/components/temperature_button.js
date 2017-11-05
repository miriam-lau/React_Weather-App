import React from 'react';
import { TEMP_UNIT } from '../constants';

/*
  Renders either the 'F' or 'C' temperature button.
  @param {props}
    {char} the current temperature unit, either 'F' or 'C'
    {function onTempUnitChange} passes the new temperature unit to the
      handleTempUnitChange function in index
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
