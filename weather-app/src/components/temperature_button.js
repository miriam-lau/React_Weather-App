import React from 'react';
import { TEMP_UNIT } from '../constants';

const TemperatureButton = (props) => {
  let newTemp = (TEMP_UNIT.FAHRENHEIT === 'F') ?
    TEMP_UNIT.CELSIUS : TEMP_UNIT.FAHRENHEIT;

  return (
    <div className="temperature-button"
      onClick={ () => props.onTempUnitChange(newTemp) }>
        &deg;{ newTemp }
    </div>
  );
}

export default TemperatureButton;
