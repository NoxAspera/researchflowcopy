/**
 * This file contains some commonly used helper functions.
 */
import * as Network from 'expo-network'
/**
 * This is a small helper function to check the connection status of the phone that is in use
 * @author August O'Rourke
 *
 * @returns bool
 */
export async function isConnected()
{
  let check = (await Network.getNetworkStateAsync()).isConnected
  return check
}

/**
* Helper function that gets the time between two dates expressed as days
* @author Blake Stambaugh
* @param date1 first date
* @param date2 second date
* @returns time passed between date1 and date2 in days
*/
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

/**
* @author Blake Stambaugh 
* 
* Takes in a tanks previous pressure, previous date checked, and its current pressure and estimates the 
* amount of days remaining until it is empty.
* 
* @param prevPress the tanks previous pressure
* @param prevDate the last date the tank was visited
* @param currPress the current pressure of the tank
* @returns how many days are left until the tank is expected to be empty
*/
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