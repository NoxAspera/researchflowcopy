/**
 * Add Notes Page
 * @author Blake Stambaugh, Megan Ostlie, August O'Rourke, and David Schiwal
 * Updated: 3/23/25 - DS
 * This page will take in input from the user, format it, and upload it to the
 * github repo.
 */
import { StyleSheet, KeyboardAvoidingView, Modal, View, TouchableOpacity, Platform  } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { ScrollView, Pressable } from 'react-native-gesture-handler';
import { buildNotes, copyTankRecord, Entry } from '../scripts/Parsers';
import TextInput from './TextInput'
import NoteInput from './NoteInput'
import { IndexPath, Layout, Select, SelectItem, Button, Text, Icon, CheckBox } from '@ui-kitten/components';
import { customTheme } from './CustomTheme'
import { setSiteFile, getFileContents, getLatestTankEntry, offlineTankEntry, TankRecord, setTankTracker, addEntrytoTankDictionary, getDirectory, setInstrumentFile, setBadData } from '../scripts/APIRequests';
import { parseNotes, ParsedData } from '../scripts/Parsers'
import PopupProp from './Popup';
import PopupProp2Button from './Popup2Button';
import { NavigationType, routeProp } from './types'
import { ThemeContext } from './ThemeContext';
import LoadingScreen from './LoadingScreen';
import DateTimePicker, {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import * as Network from 'expo-network'
import VisitPopupProp from './VisitPopup';

/**
 * @author Megan Ostlie
 *  a function that pulls the current note document for the specified site from GitHub
 *  @param siteName the name of the site
 * 
 * @returns a ParsedData object that contains the information of the given document
 */
async function processNotes(siteName: string) {
  const fileContents = await getFileContents(`site_notes/${siteName}`);
  if(fileContents.data){
    return parseNotes(fileContents.data)
  }
  else
  {
    return null
  }
}

async function isConnected()
{
  let check = (await Network.getNetworkStateAsync()).isConnected
  return check
}

/**
 * @author August O'Rourke, Blake Stambaugh, David Schiwal, Megan Ostlie
 *  Creates the input elements for the user to input site note information.
 *  Pulls the current notes for the selected site from GitHub and autofills certain fields.
 *  Takes the inputted information from the user to build a new string that is added to that site's note document.
 * 
 */
export default function AddNotes({ navigation }: NavigationType) {
    
    const route = useRoute<routeProp>();
    const { site, info } = route.params || {}
    const themeContext = React.useContext(ThemeContext);
    const isDarkMode = themeContext.theme === 'dark';

  const onStartChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setStartDateValue(currentDate);
  };

  const onEndChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setEndDateValue(currentDate);
  };


  const showStartMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: startDateValue,
      onChange: onStartChange,
      mode: currentMode,
      is24Hour: false,
    });
  };

  const showEndMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: endDateValue,
      onChange: onEndChange,
      mode: currentMode,
      is24Hour: false,
    });
  };

  const showStartDatepicker = () => {
    showStartMode("date");
  };

  const showStartTimepicker = () => {
    showStartMode("time");
  };

  const showEndDatepicker = () => {
    showEndMode("date");
  };

  const showEndTimepicker = () => {
    showEndMode("time");
  };
    // State to hold parsed data
    const [data, setData] = useState<ParsedData | null>(null);
    const [networkStatus, setNetworkStatus] = useState(true)

    // Get current notes for the site
    useEffect(() => {
        async function fetchData() {
          setNetworkStatus(await isConnected())

            if (site && !data && networkStatus) {
                try {
                    const parsedData = await processNotes(site);
                    setData(parsedData); // Update state with the latest entry
                } catch (error) {
                    console.error("Error processing notes:", error);
                }
            }
        }
        fetchData();
    }, [site]); // Re-run if `site` changes

    // Get list of possible instruments
    useEffect(() => {
        const fetchInstrumentNames = async () => {
          try {
            let names = await getDirectory(`instrument_maint/LGR_UGGA`);
    
            if(names?.success)
            {
              setInstrumentNames(names.data);
            }
        }
          catch (error)
          {
            console.error("Error processing instrument names:", error);
          }
        };
    
        fetchInstrumentNames();
      }, [site]);

    //Get latest notes entry from site
    let latestEntry = null;
    if (data) {
      latestEntry = data.entries[0];
    }
    
    // these use states to set and store values in the text inputs
    const [startDateValue, setStartDateValue] = useState(new Date());
    const [endDateValue, setEndDateValue] = useState(new Date());
    const [nameValue, setNameValue] = useState("");
    const [ltsId, setLTSId] = useState("");
    const [ltsValue, setLTSValue] = useState("");
    const [ltsPressure, setLTSPressure] = useState("");
    const [lowId, setLowId] = useState("");
    const [lowValue, setLowValue] = useState("");
    const [lowPressure, setLowPressure] = useState("");
    const [midId, setMidId] = useState("");
    const [midValue, setMidValue] = useState("");
    const [midPressure, setMidPressure] = useState("");
    const [highId, setHighId] = useState("");
    const [highValue, setHighValue] = useState("");
    const [highPressure, setHighPressure] = useState("");
    const [n2Value, setN2Value] = useState("");
    const [notesValue, setNotesValue] = useState("");
    const [instrumentInput, setInstrumentInput] = useState("");
    const [ltsTankRecord, setLtsTankRecord] = useState<TankRecord>(undefined);
    const [originalLts, setOriginalLts] = useState<TankRecord>(undefined);
    const [lowTankRecord, setLowTankRecord] = useState<TankRecord>(undefined);
    const [originalLow, setOriginalLow] = useState<TankRecord>(undefined);
    const [midTankRecord, setMidTankRecord] = useState<TankRecord>(undefined);
    const [originalMid, setOriginalMid] = useState<TankRecord>(undefined);
    const [highTankRecord, setHighTankRecord] = useState<TankRecord>(undefined);
    const [originalHigh, setOriginalHigh] = useState<TankRecord>(undefined);
    const [instrumentNames, setInstrumentNames] = useState<string[]>();
    const [originalInstrument, setOriginalInstrument] = useState("");
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [customInstrument, setCustomInstrument] = useState<string>("");
    const [addToBadData, setAddToBadData] = useState(false);
    const [badDataReason, setBadDataReason] = useState("");
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [selectedTank, setSelectedTank] = useState("");

    // used for determining if PUT request was successful
    // will set the success/fail notification to visible, aswell as the color and text
    const [visible, setVisible] = useState(false);
    const [messageColor, setMessageColor] = useState("");
    const [message, setMessage] = useState("");
    const [returnHome, retHome] = useState(false);
    const visibleRef = useRef(false);

    // used for popup if info is missing
    const [visible2, setVisible2] = useState(false);

    // used for loading screen
    const [loadingValue, setLoadingValue] = useState(false);
    
    // tank predictor
    const [tankPredictorVisibility, setTankPredictorVisibility] = useState(false);
    const [lowTankName, setLowTankName] = useState("");
    const [lowDaysRemaining, setLowDaysRemaining] = useState(-1);
    const [midDaysRemaining, setMidDaysRemaining] = useState(-1);
    const [midTankName, setMidTankName] = useState("");
    const [highDaysRemaining, setHighDaysRemaining] = useState(-1);
    const [highTankName, setHighTankName] = useState("");
    const [ltsDaysRemaining, setLtsDaysRemaining] = useState(-1);
    const [ltsTankName, setLtsTankName] = useState("");
    const [n2DaysRemaining, setN2DaysRemaining] = useState(-1);
    const [n2TankName, setN2TankName] = useState("");

    function getTimeBetweenDates(date1, date2) {
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
        milliseconds: timeDiffMs % 1000
      };
    }

    function daysUntilEmpty(prevPress, prevDate, currPress) {
      // get change of pressure over time, assume it is linear
      let changeOfPress = currPress - prevPress;
      console.log(`${currPress} - ${prevPress} = ${changeOfPress}`);

      // if change of pressure is positive, then it got replaced, no need to check date
      // if change of pressure is 0, then there is no need to check date bc nothing has changed
      if (changeOfPress >= 0) {
        return 365;
      }

      // get date difference
      let currTime = endDateValue;
      let prevTime = new Date(prevDate);
      let changeOfDate = getTimeBetweenDates(prevTime, currTime).days; // get the difference of time in days
      console.log(`Days between: ${changeOfDate}`);

      // if changeOfDate is 0, then the previous entry was also made today
      if (changeOfDate == 0) {
        return 365;
      }
      
      let rateOfDecay = changeOfPress / changeOfDate; // measured in psi lost per day
      console.log(`Rate of decay: ${changeOfPress} / ${changeOfDate} = ${rateOfDecay}`);

      // solve for when the tank should be under 500 psi
      let days = Math.trunc((-prevPress / rateOfDecay) - changeOfDate);
      return days;
    }

    function checkIfRefillIsNeeded() {
      // get tank values from previous entries
      let prevEntry = data.entries[0];

      // compare pressure from prev entry to current entry to see if tank will be empty soon
      let lowDays = daysUntilEmpty(parseInt(prevEntry.low_cal.pressure), prevEntry.time_out, parseInt(lowPressure));
      let midDays = daysUntilEmpty(parseInt(prevEntry.mid_cal.pressure), prevEntry.time_out, parseInt(midPressure));
      let highDays = daysUntilEmpty(parseInt(prevEntry.high_cal.pressure), prevEntry.time_out, parseInt(highPressure));
      let ltsDays = daysUntilEmpty(parseInt(prevEntry.lts.pressure), prevEntry.time_out, parseInt(ltsPressure));
      let n2Days = daysUntilEmpty(parseInt(prevEntry.n2_pressure), prevEntry.time_out, parseInt(n2Value));

      console.log(`
        Low Days: ${lowDays}
        Mid Days: ${midDays}
        highDays: ${highDays}
        lts Days: ${ltsDays}
        n2 Days:  ${n2Days}`);

      // if any of the tanks are predicted to be empty in 90 days or less, send a warning
      if (lowDays <= 90) {
        setLowDaysRemaining(lowDays);
        setLowTankName(lowId);
        setTankPredictorVisibility(true);
      }
      if (midDays <= 90) {
        setMidDaysRemaining(midDays);
        setMidTankName(midId);
        setTankPredictorVisibility(true);
      }
      if (highDays <= 90) {
        setHighDaysRemaining(highDays);
        setHighTankName(highId);
        setTankPredictorVisibility(true);
      }
      if (ltsDays <= 90) {
        setLtsDaysRemaining(ltsDays);
        setLtsTankName(ltsId);
        setTankPredictorVisibility(true);
      }
      if (n2Days <= 90) {
        setN2DaysRemaining(n2Days);
        setN2TankName("N2");
        setTankPredictorVisibility(true);
      }
    }

    //method will warn user if fields haven't been input
    function checkTextEntries(){
        if(nameValue == "" ||
           ltsId == "" ||
           ltsValue == "" ||
           ltsPressure == "" ||
           lowId == "" ||
           lowValue == "" ||
           lowPressure == "" ||
           midId == "" ||
           midValue == "" ||
           midPressure == "" ||
           highId == "" ||
           highValue == "" ||
           highPressure == "" ||
           n2Value == "" ||
           notesValue == ""){
               setVisible2(true);
        }
        else{
            handleUpdate();
           }
    }

    const installedInstrumentNotes = (time: string): string => {
      let result: string = `- Time in: ${time}\n`;
  
      result += `- Name: ${nameValue}\n`;
      result += `- Notes: Installed at ${site}\n`;
      result += "---\n";
  
      return result;
    };

    const removedInstrumentNotes = (time: string): string => {
      let result: string = `- Time in: ${time}\n`;
  
      result += `- Name: ${nameValue}\n`;
      result += `- Notes: Removed from ${site}\n`;
      result += "---\n";
  
      return result;
    };

    const buildBadDataString = (): string => {
      const startTime = startDateValue.toISOString().split(".")[0] + "Z";
      const endTime = endDateValue.toISOString().split(".")[0] + "Z";
      const currentTime = (new Date()).toISOString().split(".")[0] + "Z";
      let result: string = `${startTime},${endTime},all,NA,${currentTime},${nameValue},${badDataReason}`;
  
      return result;
    };

    // will call setFile to send the PUT request. 
    // If it is successful it will display a success message
    // if it fails then it will display a failure message
    const handleUpdate = async () => {
      // show spinner while submitting
      setLoadingValue(true);

      const LTSignored: boolean = (ltsId == "" && ltsValue == "" && ltsPressure == "")

      const start = new Date(startDateValue);
      const startYear = start.getUTCFullYear();
      const startMonth = String(start.getUTCMonth() + 1).padStart(2, "0");
      const startDay = String(start.getUTCDate()).padStart(2, "0");
      const startHours = String(start.getUTCHours()).padStart(2, "0");
      const startMinutes = String(start.getUTCMinutes()).padStart(2, "0");

      const end = new Date(endDateValue);
      const endYear = end.getUTCFullYear();
      const endMonth = String(end.getUTCMonth() + 1).padStart(2, "0");
      const endDay = String(end.getUTCDate()).padStart(2, "0");
      const endHours = String(end.getUTCHours()).padStart(2, "0");
      const endMinutes = String(end.getUTCMinutes()).padStart(2, "0");
      const endSeconds = String(end.getUTCSeconds()).padStart(2, "0");
        
      console.log("creating data")
        // create an entry object data that will be sent off to the repo
        let data: Entry = 
        {
          time_in: `${startYear}-${startMonth}-${startDay} ${startHours}:${startMinutes}`,
          time_out: `${endYear}-${endMonth}-${endDay} ${endHours}:${endMinutes}`,
          names: nameValue,
          instrument: instrumentInput ? instrumentInput: null,
          n2_pressure: n2Value ? n2Value: null,
          lts: LTSignored ? null:
          {
            id: ltsId,
            value: ltsValue,
            unit: "ppm",
            pressure: ltsPressure
          },
          low_cal:
          {
            id:lowId,
            value:lowValue,
            unit:"ppm",
            pressure: lowPressure
          },
          mid_cal:
          {
            id:midId,
            value:midValue,
            unit: "ppm",
            pressure: midPressure
          },
          high_cal:
          {
            id:highId,
            value:highValue,
            unit: "ppm",
            pressure: highPressure
          },
          additional_notes: notesValue 
        };
        console.log("entry created")
        const utcTime = `${endYear}-${endMonth}-${endDay} ${endHours}:${endMinutes}:${endSeconds}Z`;
        if (originalLts && (!ltsTankRecord || (originalLts.tankId != ltsTankRecord.tankId))) {
          removeTankFromSite(originalLts, utcTime);
        }
        if(networkStatus){
          if (ltsTankRecord) {
            let ltsTank = copyTankRecord(ltsTankRecord);
            ltsTank.location = site;
            ltsTank.updatedAt = utcTime;
            ltsTank.pressure = parseInt(ltsPressure);
            ltsTank.userId = nameValue;
            console.log("calling this")
            addEntrytoTankDictionary(ltsTank);
          }
          
          console.log("tank pressure point")
          if (originalLow && (!lowTankRecord || (originalLow.tankId != lowTankRecord.tankId))) {
            removeTankFromSite(originalLow, utcTime);
          }
          console.log("tank pressure point 2")
          if (lowTankRecord) {
            let lowTank = copyTankRecord(lowTankRecord);
            lowTank.location = site;
            lowTank.updatedAt = utcTime;
            lowTank.pressure = parseInt(lowPressure);
            lowTank.userId = nameValue;
            addEntrytoTankDictionary(lowTank);
          }

          if (originalMid && (!midTankRecord || (originalMid.tankId != midTankRecord.tankId))) {
            removeTankFromSite(originalMid, utcTime);
          }
          if (midTankRecord) {
            let midTank = copyTankRecord(midTankRecord);
            midTank.location = site;
            midTank.updatedAt = utcTime;
            midTank.pressure = parseInt(midPressure);
            midTank.userId = nameValue;
            addEntrytoTankDictionary(midTank);
          }

          if (originalHigh && (!highTankRecord || (originalHigh.tankId != highTankRecord.tankId))) {
            removeTankFromSite(originalHigh, utcTime);
          }
          if (highTankRecord) {
            let highTank = copyTankRecord(highTankRecord);
            highTank.location = site;
            highTank.updatedAt = utcTime;
            highTank.pressure = parseInt(highPressure);
            highTank.userId = nameValue;
            addEntrytoTankDictionary(highTank);
          }
        }
        else
        {
          if(ltsId && ltsPressure)
          {
            await offlineTankEntry(ltsId, parseInt(ltsPressure), site, utcTime, nameValue)
          }
          if(lowId && lowPressure)
          {
            await offlineTankEntry(lowId, parseInt(lowPressure), site, utcTime, nameValue)
          }
          if(midId && midPressure)
          {
            await offlineTankEntry(midId, parseInt(midPressure), site, utcTime, nameValue)
          }
          if(highId && highPressure)
          {
            await offlineTankEntry(highId, parseInt(highPressure), site, utcTime, nameValue)
          }
        }

        console.log("sending add notes")
        // send the request
        const result = await setSiteFile(site, buildNotes(data), "updating notes from researchFlow");
        console.log("sending tank tracker")
        const tankResult = await setTankTracker();

        let instMaintResult;
        let instMaintResult2;
        let badDataResult;

        // If a new instrument was added
        if (instrumentInput && (!originalInstrument || (originalInstrument != instrumentInput))) {
          if (instrumentNames.includes(instrumentInput)) {
            const notes = installedInstrumentNotes(utcTime);
            //console.log("sending instrument")
            instMaintResult = await setInstrumentFile(`instrument_maint/LGR_UGGA/${instrumentInput}`, notes, `Updated ${instrumentInput}.md`, true, site);
          }
        }

        // If instrument was removed
        if (originalInstrument && (!instrumentInput || (originalInstrument != instrumentInput))) {
          if (instrumentNames.includes(originalInstrument)) {
            const notes = removedInstrumentNotes(utcTime);
            console.log("sending instrument 2")
            instMaintResult2 = await setInstrumentFile(`instrument_maint/LGR_UGGA/${originalInstrument}`, notes, `Updated ${originalInstrument}.md`, true, 'WBB - Spare');
          }
        }

        if (addToBadData) {
          let instrument = "";
          const badDataString = buildBadDataString();
          if (instrumentInput.includes("LGR")) {
            instrument = "lgr_ugga";
          } else if (instrumentInput.includes("7000")) {
            instrument = "licor_7000";
          } else if (instrumentInput.includes("6262")) {
            instrument = "licor_6262";
          }
          console.log("sending bad data")
          badDataResult = await setBadData(
            site,
            instrument,
            badDataString,
            `Update ${instrument}.csv`
          );
        }

      // remove spinner once we have results back
      setLoadingValue(false);

        // check to see if the request was ok, give a message based on that
        if (result.success && tankResult.success && (!instMaintResult || instMaintResult.success) && (!instMaintResult2 || instMaintResult2.success) && (!badDataResult || badDataResult.success)) {
            setMessage("File updated successfully!");
            setMessageColor(customTheme['color-success-700']);
            retHome(true);
          } else {
            if (result.error) {
              setMessage(`Error: ${result?.error}`);
            } else if (tankResult.error) {
              setMessage(`Error: ${tankResult.error}`);
            } else if (instMaintResult && instMaintResult.error) {
              setMessage(`Error: ${instMaintResult.error}`);
            } else if (instMaintResult2 && instMaintResult2.error) {
              setMessage(`Error: ${instMaintResult2.error}`);
            } else if (badDataResult && badDataResult.error) {
              setMessage(`Error: ${badDataResult.error}`);
            }
            setMessageColor(customTheme['color-danger-700']);
          }
          setTimeout(() => {
            setVisible(true);
            visibleRef.current = true;
          }, 100);
    };

    //method to navigate home to send to popup so it can happen after dismiss button is clicked
    function navigateHome(nav:boolean){
      if(nav){
        navigation.navigate("Home")
      }
      if(networkStatus)
      {
        setTimeout(checkIfRefillIsNeeded, 100);
      }
    }

    function navigatePlanVisit(nav:boolean){
      if(nav){
        navigation.navigate("PlanVisit", {site: site})
      }
    }

    const removeTankFromSite = (tank: TankRecord, time: string) => {
      let newTankEntry = copyTankRecord(tank);
      newTankEntry.location = "ASB279";
      newTankEntry.pressure = 500;
      newTankEntry.userId = nameValue;
      newTankEntry.updatedAt = time;
      addEntrytoTankDictionary(newTankEntry);
    }

    const clearTankEntry = (tank: string) => {
      if (tank == "lts") {
        setLTSId("");
        setLTSValue("");
        setLtsTankRecord(undefined);
      } else if (tank == "low") {
        setLowId("");
        setLowValue("");
        setLowTankRecord(undefined);
      } else if (tank == "mid") {
        setMidId("");
        setMidValue("");
        setMidTankRecord(undefined);
      } else if (tank == "high") {
        setHighId("");
        setHighValue("");
        setHighTankRecord(undefined);
      }
    }

    const handleTankChange = (tank: string) => {
      setSelectedTank(tank);
    };

    const handleInstrumentUpdate = (index: IndexPath | IndexPath[]) => {
      const selectedRow = (index as IndexPath).row;
      if (selectedRow === instrumentNames?.length) {
        setInstrumentInput("");
      } else if (selectedRow === instrumentNames.length + 1) {
        setModalVisible(true);
      } else {
        const selectedInstrument = instrumentNames?.[selectedRow] ?? "";
        setInstrumentInput(selectedInstrument);
      }
    };

    const addCustomInstrument = () => {
      if (customInstrument.trim() !== "") {
        setInstrumentInput(customInstrument);
        setCustomInstrument("");
      }
      setModalVisible(false);
    }

    useEffect(() => {
      if (selectedTank) {
        if (selectedTank == "lts") {
          setTimeout(() => {
            navigation.navigate('SelectTank', {
              from: 'AddNotes',
              onSelect: (tank) => {
                if(networkStatus)
                {
                  setLTSId(tank);
                  const entry = getLatestTankEntry(tank) || getLatestTankEntry(tank.toLowerCase());
                  setLtsTankRecord(entry);
                  setLTSValue(entry.co2.toString() + " ~ " + entry.ch4.toString());
                }
                else
                {
                  setLTSId(tank)
                  //it won't display the tankID unless we give this an empty value, haven't a clue why
                  setLTSValue(" ")
                }
              }
            });
          }, 10);
        } else if (selectedTank == "low") {
          setTimeout(() => {
            navigation.navigate('SelectTank', {
              from: 'AddNotes',
              onSelect: (tank) => {
                if(networkStatus)
                {
                  setLowId(tank);
                  const entry = getLatestTankEntry(tank) || getLatestTankEntry(tank.toLowerCase());
                  setLowTankRecord(entry);
                  setLowValue(entry.co2.toString() + " ~ " + entry.ch4.toString());
                }
                else
                {
                  setLowId(tank)
                  //it won't display the tankID unless we give this an empty value, haven't a clue why
                  setLowValue(" ")
                }
              }
            });
          }, 10);
        } else if (selectedTank == "mid") {
          setTimeout(() => {
            navigation.navigate('SelectTank', {
              from: 'AddNotes',
              onSelect: (tank) => {
                if(networkStatus)
                {
                  setMidId(tank);
                  const entry = getLatestTankEntry(tank) || getLatestTankEntry(tank.toLowerCase());
                  setMidTankRecord(entry);
                  setMidValue(entry.co2.toString() + " ~ " + entry.ch4.toString());
                }
                else
                {
                  setMidId(tank)
                  //it won't display the tankID unless we give this an empty value, haven't a clue why
                  setMidValue(" ")
                }
              }
            });
          } , 10);
        } else if (selectedTank == "high") {
          setTimeout(() => {
            navigation.navigate('SelectTank', {
              from: 'AddNotes',
              onSelect: (tank) => {
                if(networkStatus){
                  setHighId(tank);
                  const entry = getLatestTankEntry(tank) || getLatestTankEntry(tank.toLowerCase());
                  setHighTankRecord(entry);
                  setHighValue(entry.co2.toString() + " ~ " + entry.ch4.toString());
                }
                else
                {
                  setHighId(tank)
                  //it won't display the tankID unless we give this an empty value, haven't a clue why
                  setHighValue(" ")
                }
              }
            });
          }, 10);
        }
        setSelectedTank("");
      }
    }, [selectedTank]);

    //Set tank ids, values, and instruments if available in parsed data
    useEffect(() => {
      if (latestEntry) {
          if (latestEntry.lts) {
              const ltsID = latestEntry.lts.id.split("_").pop();
              if (ltsID) {
                const ltsEntry = getLatestTankEntry(ltsID) || getLatestTankEntry(ltsID.toLowerCase());
                if (ltsEntry) {
                  setLtsTankRecord(ltsEntry);
                  setOriginalLts(ltsEntry);
                  setLTSId(ltsEntry.tankId)
                  setLTSValue(ltsEntry.co2.toString() + " ~ " + ltsEntry.ch4.toString());
                }
              }
          }
          if (latestEntry.low_cal) {
            const lowID = latestEntry.low_cal.id.split("_").pop();
            if (lowID) {
              const lowEntry = getLatestTankEntry(lowID) || getLatestTankEntry(lowID.toLowerCase());
              if (lowEntry) {
                setLowTankRecord(lowEntry);
                setOriginalLow(lowEntry);
                setLowId(lowEntry.tankId);
                setLowValue(lowEntry.co2.toString() + " ~ " + lowEntry.ch4.toString());
              }
            }
          }
          if (latestEntry.mid_cal) {
            const midID = latestEntry.mid_cal.id.split("_").pop();
            if (midID) {
              const midEntry = getLatestTankEntry(midID) || getLatestTankEntry(midID.toLowerCase());
              if (midEntry) {
                setMidTankRecord(midEntry);
                setOriginalMid(midEntry);
                setMidId(midEntry.tankId);
                setMidValue(midEntry.co2.toString() + " ~ " + midEntry.ch4.toString());
              }
            } 
          }
          if (latestEntry.high_cal) {
            const highID = latestEntry.high_cal.id.split("_").pop();
            if (highID) {
              const highEntry = getLatestTankEntry(highID) || getLatestTankEntry(highID.toLowerCase());
              if (highEntry) {
                setHighTankRecord(highEntry);
                setOriginalHigh(highEntry);
                setHighId(highEntry.tankId);
                setHighValue(highEntry.co2.toString() + " ~ " + highEntry.ch4.toString());
              }
            }
          }
          if (latestEntry.instrument) {
            setInstrumentInput(latestEntry.instrument);
            setOriginalInstrument(latestEntry.instrument);
          }
      }
  }, [latestEntry]);

    return (
      <KeyboardAvoidingView
            behavior = "padding"
            style={styles.container}>
        <ScrollView automaticallyAdjustKeyboardInsets={true} keyboardShouldPersistTaps='handled'>
          <Layout style={styles.container}>
            {/* header */}
            <Text category='h1' style={{textAlign: 'center'}}>{site}</Text>

            {/* success/failure popup */}
            <PopupProp popupText={message}
            popupColor={messageColor} 
            onPress={setVisible}
            navigateHome={navigateHome} 
            visible={visible}
            returnHome={returnHome}/>

            {/* popup if user has missing input */}
            <PopupProp2Button popupText='Missing some input field(s)'
            popupColor={customTheme['color-danger-700']}
            sendData={handleUpdate}
            removePopup={setVisible2}
            visible={visible2}/>

            {/* tank is low popup */}
            <VisitPopupProp
              lowTank={lowTankName}
              lowDays={lowDaysRemaining}
              midTank={midTankName}
              midDays={midDaysRemaining}
              highTank={highTankName}
              highDays={highDaysRemaining}
              ltsTank={ltsTankName}
              ltsDays={ltsDaysRemaining}
              n2Tank={n2TankName}
              n2Days={n2DaysRemaining}
              visible={tankPredictorVisibility}
              removePopup={setTankPredictorVisibility}
              navigateHome={navigateHome}
              navigatePlanVisit={navigatePlanVisit} />
              {/* ltsTankName
              highTankName
              midTankName
              lowTankName */}

            {/* loading screen */}
            <LoadingScreen visible={loadingValue} />

            {/* Select for instrument */}
            <Select
              label={evaProps => <Text {...evaProps} category="p2" style={{color: isDarkMode ? "white" : "black"}}>Instrument</Text>}
              onSelect={handleInstrumentUpdate}
              placeholder="Select Instrument"
              value={instrumentInput}
              style={styles.inputText}
            >
            <>
            {(instrumentNames ?? ["No Instruments Available"]).map((instrument, index) => (
              <SelectItem key={index} title={instrument} />
            ))}
            <SelectItem key="remove" title="Remove Instrument" />
            <SelectItem key="custom" title="Enter Instrument Name Manually" />
            </>
            </Select>

            {/* text inputs */}
            {/* Name input */}
            <TextInput labelText='Name' 
              labelValue={nameValue} 
              onTextChange={setNameValue} 
              placeholder='First Last' 
              style={styles.inputText}
            />

            {/* Time input */}
            <Text category="p2" style={{ marginTop: 8, marginLeft: 8 }}>Time Arrived (MT):</Text>
            {/*light mode colors came from researchflow\node_modules\@eva-design\eva\themes\light.json */}
            {/*dark mode colors came from researchflow\node_modules\@eva-design\eva\themes\dark.json*/}
            <TouchableOpacity onPress={() => setShowStartPicker(true)} style={[styles.datePicker, {borderColor: isDarkMode ? "#101426" : "#E4E9F2"}, {backgroundColor: isDarkMode ? "#1A2138" : "#F7F9FC"}]}>
              <Icon name="calendar-outline" style={{ width: 20, height: 20, marginRight: 10 }} fill="gray" />
              <Text>{startDateValue.toLocaleDateString([], {year: 'numeric', month: '2-digit', day: '2-digit'})} {startDateValue.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </TouchableOpacity>

          {(showStartPicker && Platform.OS === "ios") && (
          <View>
          <DateTimePicker
            textColor= {isDarkMode ? 'white' : 'black'}
            value={startDateValue}
            mode="datetime"
            display="spinner"
            onChange={(event, selectedDate) => {
            if (selectedDate) setStartDateValue(selectedDate);
          }}
          />
          <Button style={styles.submitButton} onPress={() => setShowStartPicker(false)}> 
          {evaProps => <Text {...evaProps} category="h6" style={{color: "black"}}>Confirm Date/Time</Text>}
          </Button>
          </View>
        )}

        {(showStartPicker && Platform.OS === "android") && (
          (
            <View style={styles.androidDateTime}>
              <Pressable onPress={() => {showStartDatepicker(); setStartDateValue(startDateValue)}}>
                <Text>
                  {startDateValue.toLocaleDateString([], {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  })}
                </Text>
              </Pressable>
              <Pressable onPress={() => {showStartTimepicker(); setStartDateValue(startDateValue)}}>
                <Text>
                  {startDateValue.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </Pressable>
            </View>
          )
        )}

        <Text category="p2" style={{ marginTop: 8, marginLeft: 8 }}>Time Departed (MT):</Text>
          <TouchableOpacity onPress={() => setShowEndPicker(true)} style={[styles.datePicker, {borderColor: isDarkMode ? "#101426" : "#E4E9F2"}, {backgroundColor: isDarkMode ? "#1A2138" : "#F7F9FC"}]}>
            <Icon name="calendar-outline" style={{ width: 20, height: 20, marginRight: 10 }} fill="gray" />
            <Text>{endDateValue.toLocaleDateString([], {year: 'numeric', month: '2-digit', day: '2-digit'})} {endDateValue.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
          </TouchableOpacity>

          {(showEndPicker && Platform.OS == "ios") && (
            <View>
            <DateTimePicker
              value={endDateValue}
              mode="datetime"
              display="spinner"
              onChange={(event, selectedDate) => {
                //setShowEndPicker(false)
                if (selectedDate)
                {
                  setEndDateValue(selectedDate);
                }
              
          }}
          />
          <Button style={styles.submitButton} onPress={() => setShowEndPicker(false)}> 
          {evaProps => <Text {...evaProps} category="h6" style={{color: "black"}}>Confirm Date/Time</Text>}
          </Button>
          </View>
        )}

          {(showEndPicker && Platform.OS === "android") && (
          (
            <View style={styles.androidDateTime}>
              <Pressable onPress={() => {showEndDatepicker(); setEndDateValue(endDateValue)}}>
                <Text>
                  {endDateValue.toLocaleDateString([], {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  })}
                </Text>
              </Pressable>
              <Pressable onPress={() => {showEndTimepicker(); setEndDateValue(endDateValue)}}>
                <Text>
                  {endDateValue.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </Pressable>
            </View>
          )
        )}

        <CheckBox
          checked={addToBadData}
          onChange={setAddToBadData}
          style={{ margin: 15 }}
        >
        {evaProps => <Text {...evaProps} category="p2">Add this time period to Bad Data?</Text>}
        </CheckBox>

        {addToBadData && (
        <TextInput
          labelText="Reason for Bad Data"
          labelValue={badDataReason}
          onTextChange={setBadDataReason}
          placeholder="Describe why this data is invalid"
          style={styles.inputText}
        />
      )}

            {/* N2 */}
            <TextInput labelText='N2 (if needed)' 
              labelValue={n2Value} 
              onTextChange={setN2Value} 
              placeholder='psi' 
              style={styles.inputText} />

            {/* LTS input */}
            <Layout style = {styles.rowContainer}>
              <Select
                  label={evaProps => <Text {...evaProps} category="p2" style={{color: isDarkMode ? "white" : "black"}}>LTS (if needed)</Text>}
                  onSelect={(indexPath) => {
                    const index = Array.isArray(indexPath) ? indexPath[0].row : indexPath.row;
                    if (index === 0) {
                    handleTankChange("lts");
                  } else if (index === 1) {
                    clearTankEntry("lts");
                  }
                }}
                  placeholder="Select LTS Tank"
                  value={ltsId && ltsValue ? `${ltsId}: ${ltsValue}` : ""}
                  style={styles.inputText}
              >
              <SelectItem key={0} title={"Change tank"} />
              <SelectItem key={1} title={"Remove tank"} />
              </Select>
              <TextInput labelText=' ' 
                labelValue={ltsPressure} 
                onTextChange={setLTSPressure} 
                placeholder='psi' 
                style={styles.tankInput} />
            </Layout>

            {/* Note for all tank inputs, the single space labels are there to make sure the other entry fields are alligned well*/}

            {/* Low input */}
            <Layout style = {styles.rowContainer}>
            <Select
                  label={evaProps => <Text {...evaProps} category="p2" style={{color: isDarkMode ? "white" : "black"}}>Low</Text>}
                  onSelect={(indexPath) => {
                    const index = Array.isArray(indexPath) ? indexPath[0].row : indexPath.row;
                    if (index === 0) {
                    handleTankChange("low");
                  } else if (index === 1) {
                    clearTankEntry("low");
                  }
                }}
                  placeholder="Select Low Tank"
                  value={lowId && lowValue ? `${lowId}: ${lowValue}` : ""}
                  style={styles.inputText}
              >
              <SelectItem key={0} title={"Change tank"} />
              <SelectItem key={1} title={"Remove tank"} />
              </Select>
              <TextInput labelText=' ' 
                labelValue={lowPressure} 
                onTextChange={setLowPressure} 
                placeholder='psi' 
                style={styles.tankInput} />
            </Layout>

            {/* mid input */}
            <Layout style = {styles.rowContainer}>
            <Select
                  label={evaProps => <Text {...evaProps} category="p2" style={{color: isDarkMode ? "white" : "black"}}>Mid</Text>}
                  onSelect={(indexPath) => {
                    const index = Array.isArray(indexPath) ? indexPath[0].row : indexPath.row;
                    if (index === 0) {
                    handleTankChange("mid");
                  } else if (index === 1) {
                    clearTankEntry("mid");
                  }
                }}
                  placeholder="Select Mid Tank"
                  value={midId && midValue ? `${midId}: ${midValue}` : ""}
                  style={styles.inputText}
              >
              <SelectItem key={0} title={"Change tank"} />
              <SelectItem key={1} title={"Remove tank"} />
              </Select>
              <TextInput labelText=' ' 
                labelValue={midPressure} 
                onTextChange={setMidPressure} 
                placeholder='psi' 
                style={styles.tankInput} />
            </Layout>

            {/* high input */} 
            <Layout style = {styles.rowContainer}>
            <Select
                  label={evaProps => <Text {...evaProps} category="p2" style={{color: isDarkMode ? "white" : "black"}}>High</Text>}
                  onSelect={(indexPath) => {
                    const index = Array.isArray(indexPath) ? indexPath[0].row : indexPath.row;
                    if (index === 0) {
                    handleTankChange("high");
                  } else if (index === 1) {
                    clearTankEntry("high");
                  }
                }}
                  placeholder="Select High Tank"
                  value={highId && highValue ? `${highId}: ${highValue}` : ""}
                  style={styles.inputText}
              >
              <SelectItem key={0} title={"Change tank"} />
              <SelectItem key={1} title={"Remove tank"} />
              </Select>
              <TextInput labelText=' ' 
                labelValue={highPressure} 
                onTextChange={setHighPressure} 
                placeholder='psi' 
                style={styles.tankInput} />
            </Layout>

            {/* notes entry */}
            <NoteInput labelText='Notes' 
              labelValue={notesValue} 
              onTextChange={setNotesValue} 
              placeholder='Notes' 
              multiplelines={true} 
              style={styles.notesInput}/>

            {/* submit button */}
            <Button
              testID='AddNotesButton'
              onPress={() => checkTextEntries()}
              appearance='filled'
              status='primary' 
              style={styles.submitButton}>
              {evaProps => <Text {...evaProps} category="h6" style={{color: "black"}}>Submit</Text>}
            </Button>

            {/* Modal for entering a custom instrument */}
            <Modal visible={modalVisible} transparent animationType="slide">
            <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TextInput
              style={styles.modalInput}
              placeholder="Enter Instrument Name"
              labelValue={customInstrument}
              onTextChange={setCustomInstrument}
              />
              <Button appearance='filled' onPress={addCustomInstrument} style={styles.modalButton}> 
                <Text category="h6" style={{ color: "black" }}>
                Add Instrument
                </Text> 
                </Button>
              <Button appearance='filled' onPress={() => setModalVisible(false)} style={styles.modalButton}>
              <Text category="h6" style={{ color: "red" }}>
                Cancel
              </Text> 
              </Button>
              </View>
              </View>
            </Modal>
          </Layout>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'stretch',        // has button fill space horizontally
      justifyContent: 'space-evenly',
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
      width: 300,
      padding: 20,
      backgroundColor: "white",
      borderRadius: 10,
      alignItems: "center",
    },
    inputText: {
      flex: 2,
      margin: 8
    },
    tankInput: {
      flex: 1,
      margin: 8
    },
    notesInput:
    {
      flex: 1,
      margin: 8,
    },
    areaInput: {
      height: 200,
      margin: 10,
      width: 380,
      borderWidth: 1,
      padding: 10,
    },
    rowContainer:
    {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'stretch',        // has button fill space horizontally
      justifyContent: 'space-evenly',
    },
    submitButton:
    {
      margin: 20, 
      backgroundColor: "#06b4e0",
    },
    modalButton:
    {
      backgroundColor: "#06b4e0",
    },
    modalInput: {
      width: "100%",
      borderBottomWidth: 1,
      marginBottom: 10,
      padding: 5,
    },
    datePicker: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 0,
      marginBottom: 8,
      marginRight: 8,
      marginLeft: 8,
      padding: 10,
      borderWidth: 1,
      borderRadius: 5,
      borderColor: '#d3d3d3',
      backgroundColor: '#f9f9f9',
    }, 
    androidDateTime: {
      flexDirection: "row",
      justifyContent: "space-around",
    },
     
});