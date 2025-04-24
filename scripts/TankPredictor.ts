/**
 * Tank Tracker Code
 * @author Blake Stambaugh
 * 4/19/25
 * 
 * This code is responsible for predicting when tanks will be empty and notifying the user.
 */

import { SetStateAction } from "react";

/**
 * Gets the difference between 2 dates in days
 * 
 * @param date1 first date
 * @param date2 second date
 * @returns the time passed between date1 and date2 in days
 */
export function getTimeBetweenDates(date1: Date, date2: Date) {
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
 * gets the number of days left a tank has before it is totally empty. Based on an assumption that tanks drain linearly.
 * 
 * @param prevPress the last recorded pressure of a tank
 * @param prevDate the last date the tank was visited
 * @param currPress the current recorded pressure of a tank
 * @param endDate the current date
 * @returns the amount of days left until a tank is completely empty 
 */
export function daysUntilEmpty(prevPress: number, prevDate: Date, currPress: number, endDate: Date) {
  // get change of pressure over time, assume it is linear
  let changeOfPress = currPress - prevPress;

  // if change of pressure is positive, then it got replaced, no need to check date
  // if change of pressure is 0, then there is no need to check date bc nothing has changed
  if (changeOfPress >= 0) {
    return 365;
  }

  // get date difference
  let currTime = endDate;
  let prevTime = new Date(prevDate);
  let changeOfDate = getTimeBetweenDates(prevTime, currTime).days; // get the difference of time in days

  // if changeOfDate is 0, then the previous entry was also made today
  if (changeOfDate == 0) {
    return 365;
  }

  let rateOfDecay = changeOfPress / changeOfDate; // measured in psi lost per day

  // solve for when the tank should be under 500 psi
  let days = Math.trunc(-prevPress / rateOfDecay - changeOfDate);
  return days;
}

/**
 * checks all tanks to see if any will be empty in less than 90 days. If any are, it enables a popup that notifies the user
 * of which tanks will be empty and in how many days.
 * @param data the latests data entry
 * @param lowPressure 
 * @param midPressure 
 * @param highPressure 
 * @param ltsPressure 
 * @param n2Pressure 
 * @param endDate 
 * @param setLowDaysRemaining 
 * @param setMidDaysRemaining 
 * @param setHighDaysRemaining 
 * @param setLtsDaysRemaining 
 * @param setN2DaysRemaining 
 * @param setLowTankName 
 * @param setMidTankName 
 * @param setHighTankName 
 * @param setLtsTankName 
 * @param setN2TankName 
 * @param setTankPredictorVisibility 
 * @param lowId 
 * @param midId 
 * @param highId 
 * @param ltsId 
 */
export function checkIfRefillIsNeeded(
  data,
  lowPressure: string,
  midPressure: string,
  highPressure: string,
  ltsPressure: string,
  n2Pressure: string,
  endDate: Date,
  setLowDaysRemaining: { (value: SetStateAction<number>): void; (arg0: any): void; },
  setMidDaysRemaining: { (value: SetStateAction<number>): void; (arg0: any): void; },
  setHighDaysRemaining: { (value: SetStateAction<number>): void; (arg0: any): void; },
  setLtsDaysRemaining: { (value: SetStateAction<number>): void; (arg0: any): void; },
  setN2DaysRemaining: { (value: SetStateAction<number>): void; (arg0: any): void; },
  setLowTankName: { (value: SetStateAction<string>): void; (arg0: string): void; },
  setMidTankName: { (value: SetStateAction<string>): void; (arg0: string): void; },
  setHighTankName: { (value: SetStateAction<string>): void; (arg0: string): void; },
  setLtsTankName: { (value: SetStateAction<string>): void; (arg0: string): void; },
  setN2TankName: { (value: SetStateAction<string>): void; (arg0: string): void; },
  setTankPredictorVisibility: { (value: SetStateAction<boolean>): void; (arg0: boolean): void; },
  lowId: string,
  midId: string,
  highId: string,
  ltsId: string
) {
  // get tank values from previous entries
  let prevEntry = data.entries[0];

  // compare pressure from prev entry to current entry to see if tank will be empty soon
  let lowDays;
  if (prevEntry.low_cal) {
    lowDays = daysUntilEmpty(
      parseInt(prevEntry.low_cal.pressure),
      prevEntry.time_out,
      parseInt(lowPressure),
      endDate
    );
  }
  let midDays;
  if (prevEntry.mid_cal) {
    midDays = daysUntilEmpty(
      parseInt(prevEntry.mid_cal.pressure),
      prevEntry.time_out,
      parseInt(midPressure),
      endDate
    );
  }
  let highDays;
  if (prevEntry.high_cal) {
    highDays = daysUntilEmpty(
      parseInt(prevEntry.high_cal.pressure),
      prevEntry.time_out,
      parseInt(highPressure),
      endDate
    );
  }
  let ltsDays;
  if (prevEntry.lts) {
    ltsDays = daysUntilEmpty(
      parseInt(prevEntry.lts.pressure),
      prevEntry.time_out,
      parseInt(ltsPressure),
      endDate
    );
  }
  let n2Days;
  if (prevEntry.n2_pressure) {
    n2Days = daysUntilEmpty(
      parseInt(prevEntry.n2_pressure),
      prevEntry.time_out,
      parseInt(n2Pressure),
      endDate
    );
  }

  // if any of the tanks are predicted to be empty in 90 days or less, send a warning
  if (lowDays && lowDays <= 90) {
    setLowDaysRemaining(lowDays);
    setLowTankName(lowId);
    setTankPredictorVisibility(true);
  }
  if (midDays && midDays <= 90) {
    setMidDaysRemaining(midDays);
    setMidTankName(midId);
    setTankPredictorVisibility(true);
  }
  if (highDays && highDays <= 90) {
    setHighDaysRemaining(highDays);
    setHighTankName(highId);
    setTankPredictorVisibility(true);
  }
  if (ltsDays && ltsDays <= 90) {
    setLtsDaysRemaining(ltsDays);
    setLtsTankName(ltsId);
    setTankPredictorVisibility(true);
  }
  if (n2Days && n2Days <= 90) {
    setN2DaysRemaining(n2Days);
    setN2TankName("N2");
    setTankPredictorVisibility(true);
  }
}
