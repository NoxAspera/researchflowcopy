/**
 * Dates
 * @authors
 *
 * These functions are helper functions that involve date changes.
 */
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { SetStateAction } from "react";

//pops up date picker for start date
export function showStartMode(
  currentMode: any,
  startDateValue: Date,
  onStartChange: (event: any, selectedDate: any) => void
) {
  DateTimePickerAndroid.open({
    value: startDateValue,
    onChange: onStartChange,
    mode: currentMode,
    is24Hour: false,
  });
}

//pops up date picker for end date
export function showEndMode(
  currentMode: any,
  endDateValue: Date,
  onEndChange: (event: any, selectedDate: any) => void
) {
  DateTimePickerAndroid.open({
    value: endDateValue,
    onChange: onEndChange,
    mode: currentMode,
    is24Hour: false,
  });
}

//sets start date hours and minutes
export function setStartDateHourMinutes(
  pickedDuration: { hours: any; minutes: any; seconds?: number },
  startDateValue: Date,
  setStartDateValue: { (value: SetStateAction<Date>): void; (arg0: any): void }
) {
  const tempDate = startDateValue;
  tempDate.setHours(pickedDuration.hours);
  tempDate.setMinutes(pickedDuration.minutes);
  setStartDateValue(tempDate);
}

//sets end date hours and minutes
export function setEndDateHourMinutes(
  pickedDuration: { hours: any; minutes: any; seconds?: number },
  endDateValue: Date,
  setEndDateValue: { (value: SetStateAction<Date>): void; (arg0: any): void }
) {
  const tempDate = endDateValue;
  tempDate.setHours(pickedDuration.hours);
  tempDate.setMinutes(pickedDuration.minutes);
  setEndDateValue(tempDate);
}

// formats date for diagnostics
export function formatDate(timestamp: string): string {
  const date = new Date(timestamp);
  return `${date.getMonth() + 1}/${date.getDate()}/${date
    .getFullYear()
    .toString()
    .substring(2, 4)}`;
}

// gets current data in a specific format for tank tracker
export function getCurrentUtcDateTime() {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");
  const hours = String(now.getUTCHours()).padStart(2, "0");
  const minutes = String(now.getUTCMinutes()).padStart(2, "0");
  const seconds = String(now.getUTCSeconds()).padStart(2, "0");

  // Format as "YYYY-MM-DDTHH:MM:SSZ"
  const utcDateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
  return utcDateTime;
}
