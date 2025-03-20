/**
 * Add Notes Page
 * @author Blake Stambaugh, Megan Ostlie, August O'Rourke, and David Schiwal
 * Updated: 2/11/25 - MO
 * This page will take in input from the user, format it, and upload it to the
 * github repo.
 */
import { StyleSheet, KeyboardAvoidingView, Platform, Modal, View  } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { buildNotes, copyTankRecord, Entry } from '../scripts/Parsers';
import TextInput from './TextInput'
import NoteInput from './NoteInput'
import { IndexPath, Layout, Select, SelectItem, Button, Text } from '@ui-kitten/components';
import { customTheme } from './CustomTheme'
import { setSiteFile, getFileContents, getLatestTankEntry, getTankList, TankRecord, setTankTracker, addEntrytoTankDictionary, getDirectory, setInstrumentFile } from '../scripts/APIRequests';
import { parseNotes, ParsedData } from '../scripts/Parsers'
import PopupProp from './Popup';
import PopupProp2Button from './Popup2Button';
import { NavigationType, routeProp } from './types'
import { ThemeContext } from './ThemeContext';
import LoadingScreen from './LoadingScreen';
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

    // State to hold parsed data
    const [data, setData] = useState<ParsedData | null>(null);

    // Get current notes for the site
    useEffect(() => {
        async function fetchData() {
            if (site && !data) {
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
    const [timeValue, setTimeValue] = useState("");
    const [nameValue, setNameValue] = useState("");
    const [ltsId, setLTSId] = useState("");
    const [ltsValue, setLTSValue] = useState("");
    const [ltsPressure, setLTSPressure] = useState("");
    const [lowId, setLowId] = useState("");
    const [lowValue, setLowValue] = useState("");
    const [lowPressure, setLowPressure] = useState("");
    const [midId, setmidId] = useState("");
    const [midValue, setmidValue] = useState("");
    const [midPressure, setmidPressure] = useState("");
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
    const [instrumentIndex, setInstrumentIndex] = useState<IndexPath | IndexPath[]>(new IndexPath(0));
    const [originalInstrument, setOriginalInstrument] = useState("");
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [customInstrument, setCustomInstrument] = useState<string>("");

    // Use IndexPath for selected index for drop down menu
    const [selectedIndex, setSelectedIndex] = useState<IndexPath>(new IndexPath(0)); // Default to first item
    const [instruments, setInstruments] = useState<string[]>(['Instrument 1']);

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
    // pressures from previous date
    const low = useRef<any>(null);
    const mid = useRef<any>(null);
    const high = useRef<any>(null);
    const [tankPredictorVisibility, setTankPredictorVisibility] = useState(false);
    const [lowDaysRemaining, setLowDaysRemaining] = useState(-1);
    const [midDaysRemaining, setMidDaysRemaining] = useState(-1);
    const [highDaysRemaining, setHighDaysRemaining] = useState(-1);

    function daysUntilEmpty(prevPress, prevDate, currPress) {
      // get change of pressure over time, assume it is linear
      let changeOfPress = currPress - prevPress;

      // if change of pressure is positive, then it got replaced, no need to check date
      if (changeOfPress > 0) {
        return 365;
      }

      // get date difference
      // let currTime = new Date().getTime();
      let currTime = new Date("2027-04-04").getTime(); // use far away date for testing purposes
      // let prevTime = new Date(prevDate).getTime();
      let prevTime = new Date("2027-01-01").getTime(); // use far away date for testing purposes
      let changeOfDate = (currTime - prevTime) / (86400000); // get the difference of time in days

      // if changeOfDate is 0, then the previous entry was also made today
      if (changeOfDate == 0) {
        return 365;
      }
      
      let rateOfDecay = changeOfPress / changeOfDate; // measured in psi lost per day

      // solve for when the tank should be under 500 psi
      let days = Math.trunc((-prevPress / rateOfDecay) - changeOfDate);
      return days;
    }

    function checkIfRefillIsNeeded() {
      // get tank values from previous entries
      let prevlow = low.current
      let prevmid = mid.current
      let prevhigh = high.current

      // compare pressure from prev entry to current entry to see if tank will be empty soon
      let lowDays = daysUntilEmpty(parseInt(prevlow.pressure), prevlow.updatedAt, parseInt(lowPressure));
      let midDays = daysUntilEmpty(parseInt(prevmid.pressure), prevmid.updatedAt, parseInt(midPressure));
      let highDays = daysUntilEmpty(parseInt(prevhigh.pressure), prevhigh.updatedAt, parseInt(highPressure));

      // console.log(`
      //   Low Days: ${lowDays}
      //   Mid Days: ${midDays}
      //   highDays: ${highDays}`);

      // if any of the tanks are predicted to be empty in 90 days or less, send a warning
      if (lowDays <= 90) {
        setLowDaysRemaining(lowDays);
        setTankPredictorVisibility(true);
      }
      if (midDays <= 90) {
        setMidDaysRemaining(midDays);
        setTankPredictorVisibility(true);
      }
      if (highDays <= 90) {
        setHighDaysRemaining(highDays);
        setTankPredictorVisibility(true);
      }
    }

    //method will warn user if fields haven't been input
    function checkTextEntries(){
        if(timeValue == "" ||
           nameValue == "" ||
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

    // will call setFile to send the PUT request. 
    // If it is successful it will display a success message
    // if it fails then it will display a failure message
    const handleUpdate = async () => {
      // show spinner while submitting
      setLoadingValue(true);

      const LTSignored: boolean = (ltsId == "" && ltsValue == "" && ltsPressure == "")

      // get time submitted
      const now = new Date();
      const year = now.getUTCFullYear();
      const month = String(now.getUTCMonth() + 1).padStart(2, "0");
      const day = String(now.getUTCDate()).padStart(2, "0");
      const hours = String(now.getUTCHours()).padStart(2, "0");
      const minutes = String(now.getUTCMinutes()).padStart(2, "0");
      const seconds = String(now.getUTCSeconds()).padStart(2, "0");
      
      // create an entry object data that will be sent off to the repo
      let data: Entry = 
      {
        time_in: `${year}-${month}-${day} ${timeValue}`,
        time_out: `${year}-${month}-${day} ${hours}:${minutes}`,
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

      const utcTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}Z`;
      if (originalLts && (!ltsTankRecord || (originalLts.tankId != ltsTankRecord.tankId))) {
        removeTankFromSite(originalLts, utcTime);
      }
      if (ltsTankRecord) {
        let ltsTank = copyTankRecord(ltsTankRecord);
        ltsTank.location = site;
        ltsTank.updatedAt = utcTime;
        ltsTank.pressure = parseInt(ltsPressure);
        ltsTank.userId = nameValue;
        addEntrytoTankDictionary(ltsTank);
      }
      
      if (originalLow && (!lowTankRecord || (originalLow.tankId != lowTankRecord.tankId))) {
        removeTankFromSite(originalLow, utcTime);
      }
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

      // send the request
      const result = await setSiteFile(site, buildNotes(data), "updating notes from researchFlow");
      const tankResult = await setTankTracker();

      let instMaintResult;
      let instMaintResult2;

      // If a new instrument was added
      if (instrumentInput && (!originalInstrument || (originalInstrument != instrumentInput))) {
        if (instrumentNames.includes(instrumentInput)) {
          const notes = installedInstrumentNotes(utcTime);
          instMaintResult = await setInstrumentFile(`instrument_maint/LGR_UGGA/${instrumentInput}`, notes, `Updated ${instrumentInput}.md`, true, site);
        }
      }

      // If instrument was removed
      if (originalInstrument && (!instrumentInput || (originalInstrument != instrumentInput))) {
        if (instrumentNames.includes(originalInstrument)) {
          const notes = removedInstrumentNotes(utcTime);
          instMaintResult2 = await setInstrumentFile(`instrument_maint/LGR_UGGA/${originalInstrument}`, notes, `Updated ${originalInstrument}.md`, true, 'WBB - Spare');
        }
      }

      // if the warning popup is visible, remove it
      //if(visible2) { setVisible2(false); }

      // remove spinner once we have results back
      setLoadingValue(false);

      // check to see if the request was ok, give a message based on that
      if (result.success && tankResult.success && (!instMaintResult || instMaintResult.success) && (!instMaintResult2 || instMaintResult2.success)) {
        setMessage("File updated successfully!");
        setMessageColor(customTheme['color-success-700']);
        retHome(true);
      } else {
        if (result.error) {
          setMessage(`Error: ${result.error}`);
        } else if (tankResult.error) {
          setMessage(`Error: ${tankResult.error}`);
        } else if (instMaintResult && instMaintResult.error) {
          setMessage(`Error: ${instMaintResult.error}`);
        } else if (instMaintResult2 && instMaintResult2.error) {
          setMessage(`Error: ${instMaintResult2.error}`);
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
      setTimeout(checkIfRefillIsNeeded, 100);
    }

    function navigatePlanVisit(nav:boolean){
      if(nav){
        navigation.navigate("PlanVisit")
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
        setmidId("");
        setmidValue("");
        setMidTankRecord(undefined);
      } else if (tank == "high") {
        setHighId("");
        setHighValue("");
        setHighTankRecord(undefined);
      }
    }

    const handleTankChange = (tank: string) => {
      if (tank == "lts") {
        navigation.navigate('SelectTank', {
          from: 'AddNotes',
          onSelect: (selectedTank) => {
            setLTSId(selectedTank);
            const entry = getLatestTankEntry(selectedTank) || getLatestTankEntry(selectedTank.toLowerCase());
            setLtsTankRecord(entry);
            setLTSValue(entry.co2.toString() + " ~ " + entry.ch4.toString());
          }
        });
      } else if (tank == "low") {
        navigation.navigate('SelectTank', {
          from: 'AddNotes',
          onSelect: (selectedTank) => {
            setLowId(selectedTank);
            const entry = getLatestTankEntry(selectedTank) || getLatestTankEntry(selectedTank.toLowerCase());
            setLowTankRecord(entry);
            setLowValue(entry.co2.toString() + " ~ " + entry.ch4.toString());
          }
        });
      } else if (tank == "mid") {
        navigation.navigate('SelectTank', {
          from: 'AddNotes',
          onSelect: (selectedTank) => {
            setmidId(selectedTank);
            const entry = getLatestTankEntry(selectedTank) || getLatestTankEntry(selectedTank.toLowerCase());
            setMidTankRecord(entry);
            setmidValue(entry.co2.toString() + " ~ " + entry.ch4.toString());
          }
        });
      } else if (tank == "high") {
        navigation.navigate('SelectTank', {
          from: 'AddNotes',
          onSelect: (selectedTank) => {
            setHighId(selectedTank);
            const entry = getLatestTankEntry(selectedTank) || getLatestTankEntry(selectedTank.toLowerCase());
            setHighTankRecord(entry);
            setHighValue(entry.co2.toString() + " ~ " + entry.ch4.toString());
          }
        });
      }
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
                low.current = lowEntry;
                // console.log(`lowEntry: ${low.current.pressure}`);
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
                setmidId(midEntry.tankId);
                setmidValue(midEntry.co2.toString() + " ~ " + midEntry.ch4.toString());
                mid.current = midEntry;
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
                high.current = highEntry;
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
              lowTank={lowId}
              lowDays={lowDaysRemaining}
              midTank={midId}
              midDays={midDaysRemaining}
              highTank={highId}
              highDays={highDaysRemaining}
              visible={tankPredictorVisibility}
              removePopup={setTankPredictorVisibility}
              navigateHome={navigateHome}
              navigatePlanVisit={navigatePlanVisit} />

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
              placeholder='ResearchFlow' 
              style={styles.inputText}
            />

              {/* Time input */}
            <TextInput labelText='Time Started' 
              labelValue={timeValue} 
              onTextChange={setTimeValue} 
              placeholder='15:00' 
              style={styles.inputText} />

            {/* N2 */}
            <TextInput labelText='N2 (if needed)' 
              labelValue={n2Value} 
              onTextChange={setN2Value} 
              placeholder='Pressure' 
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
                placeholder='Pressure' 
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
                placeholder='Pressure' 
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
                onTextChange={setmidPressure} 
                placeholder='Pressure' 
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
                placeholder='Pressure' 
                style={styles.tankInput} />
            </Layout>

            {/* notes entry */}
            <NoteInput labelText='Notes' 
              labelValue={notesValue} 
              onTextChange={setNotesValue} 
              placeholder='All Good.' 
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
});