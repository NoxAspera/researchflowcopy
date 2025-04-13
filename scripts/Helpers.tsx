/**
 * This file contains some commonly used helper functions.
 */
import * as Network from 'expo-network'

export async function isConnected()
{
  let check = (await Network.getNetworkStateAsync()).isConnected
  return check
}

export function getTimeBetweenDates(date1, date2) {
  const timeDiffMs = Math.abs(date2.getTime() - date1.getTime());
  const seconds = Math.floor(timeDiffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  return {
    days,
    hours: hours % 24,
    minutes: minutes % 60,
    seconds: seconds % 60,
    milliseconds: timeDiffMs % 1000,
  };
}

export function daysUntilEmpty(prevPress, prevDate, currPress, currDate) {
  // get change of pressure over time, assume it is linear
  let changeOfPress = currPress - prevPress;
  console.log(`${currPress} - ${prevPress} = ${changeOfPress}`);

  // if change of pressure is positive, then it got replaced, no need to check date
  // if change of pressure is 0, then there is no need to check date bc nothing has changed
  if (changeOfPress >= 0) {
    return 365;
  }

  // get date difference
  let currTime = new Date(currDate);
  let prevTime = new Date(prevDate);
  let changeOfDate = getTimeBetweenDates(prevTime, currTime).days; // get the difference of time in days
  console.log(`Days between: ${changeOfDate}`);

  // if changeOfDate is 0, then the previous entry was also made today
  if (changeOfDate == 0) {
    return 365;
  }

  let rateOfDecay = changeOfPress / changeOfDate; // measured in psi lost per day
  console.log(
    `Rate of decay: ${changeOfPress} / ${changeOfDate} = ${rateOfDecay}`
  );

  // solve for when the tank should be under 500 psi
  let days = Math.trunc(-prevPress / rateOfDecay - changeOfDate);
  return days;
}