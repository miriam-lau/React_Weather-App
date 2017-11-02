import { TempUnit, MONTHS, WEEKDAYS } from './constants';

export const convertTemp = (temp, unit) => {
  let tempCelsius = temp - 273.15;
  switch (unit) {
    case TempUnit.ONE:
      return Math.round(tempCelsius);
    case TempUnit.TWO:
      return Math.round(((tempCelsius * 9) / 5) + 32);
    default:
      return null;
  }
}

export const formatDate = (date) => {
  let month = MONTHS[date.getMonth()];
  let day = date.getDate();
  let year = date.getFullYear();
  let dateArray = [month, day, year];
  return dateArray;
}

export const renderWeekday = (date) => {
  const todayArr = formatDate(new Date());
  let dateArr = formatDate(date);
  console.log("TODAY ARR", todayArr);
  console.log("DATE ARR", dateArr);

  for (let i = 0; i < todayArr.length; i++) {
    if (dateArr[i] !== todayArr[i]) {
      return WEEKDAYS[date.getDay()];
    }
  }
  return "Today";
}
