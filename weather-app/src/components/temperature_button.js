import React from 'react';
import { TEMP_UNIT } from '../constants';

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
