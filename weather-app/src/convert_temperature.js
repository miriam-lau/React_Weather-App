import { TEMPERATURE_UNITS } from './constants';

/**
  * Converts temperature in Kelvin to current temperature unit.
  * @param {float} kelvin - temperature in Kelvin
  * @param {enum} TEMPERATURE_UNITS - either 'F' or 'C'
  * @return {?int}
*/
export const convertKelvinToUnit = (kelvin, unit) => {
  if (kelvin < 273.15) {
    return null;
  }

  let celsiusTemperature = kelvin - 273.15;
  switch (unit) {
    case TEMPERATURE_UNITS.CELSIUS:
      return Math.round(celsiusTemperature);
    case TEMPERATURE_UNITS.FAHRENHEIT:
      return Math.round(((celsiusTemperature * 9) / 5) + 32);
    default:
      return null;
  }
}
