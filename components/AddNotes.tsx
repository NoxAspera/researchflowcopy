/**
 * Add Notes Page
 * @author Blake Stambaugh, Megan Ostlie, August O'Rourke, and David Schiwal
 *  12/4/24
 * This page will take in input from the user, format it, and upload it to the
 * github repo.
 */
import { StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { buildNotes, copyTankRecord, Entry } from '../scripts/Parsers';
import { NaviProp } from './types';
import TextInput from './TextInput'
import NoteInput from './NoteInput'
import { IndexPath, Layout, Select, SelectItem, Button, Text } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { customTheme } from './CustomTheme'
import { setSiteFile, getFileContents, getLatestTankEntry, getTankList, TankRecord, setTankTracker, addEntrytoTankDictionary } from '../scripts/APIRequests';
import { parseNotes, ParsedData } from '../scripts/Parsers'
import PopupProp from './Popup';
import PopupProp2Button from './Popup2Button';
import { NavigationType, routeProp } from './types'
import { ThemeContext } from './ThemeContext';


function checkValidTime(entry:string)
{
  const timeMatch = /^[0-2][0-9]:[0-5][0-9]$/gm
  return timeMatch.test(entry)
}

function checkValidNumber(entry:string)
{
  const anyNonNumber = /^(\d+)(\.\d+)?$/gm
 return anyNonNumber.test(entry)
}

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

    // Use IndexPath for selected index for drop down menu
    const [selectedIndex, setSelectedIndex] = useState<IndexPath>(new IndexPath(0)); // Default to first item
    const [instruments, setInstruments] = useState<string[]>(['Instrument 1']);

    // used for determining if PUT request was successful
    // will set the success/fail notification to visible, aswell as the color and text
    const [visible, setVisible] = useState(false);
    const [messageColor, setMessageColor] = useState("");
    const [message, setMessage] = useState("");
    //used for popup if info is missing
    const [visible2, setVisible2] = useState(false);

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

    // will call setFile to send the PUT request. 
    // If it is successful it will display a success message
    // if it fails then it will display a failure message
    const handleUpdate = async () => {
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
          instrument: instrumentInput.trim() ? instrumentInput : (instruments[selectedIndex.row] ? instruments[selectedIndex.row] : null),
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

        const utcTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
        if (ltsTankRecord) {
          if (originalLts && (originalLts.tankId != ltsTankRecord.tankId)) {
            removeTankFromSite(originalLts, utcTime);
          }
          let ltsTank = copyTankRecord(ltsTankRecord);
          ltsTank.location = site;
          ltsTank.updatedAt = utcTime;
          ltsTank.pressure = parseInt(ltsPressure);
          ltsTank.userId = nameValue;
          addEntrytoTankDictionary(ltsTank);
        }
        
        if (lowTankRecord) {
          if (originalLow && (originalLow.tankId != lowTankRecord.tankId)) {
            removeTankFromSite(originalLow, utcTime);
          }
          let lowTank = copyTankRecord(lowTankRecord);
          lowTank.location = site;
          lowTank.updatedAt = utcTime;
          lowTank.pressure = parseInt(lowPressure);
          lowTank.userId = nameValue;
          addEntrytoTankDictionary(lowTank);
        }

        if (midTankRecord) {
          if (originalMid && (originalMid.tankId != midTankRecord.tankId)) {
            removeTankFromSite(originalMid, utcTime);
          }
          let midTank = copyTankRecord(midTankRecord);
          midTank.location = site;
          midTank.updatedAt = utcTime;
          midTank.pressure = parseInt(midPressure);
          midTank.userId = nameValue;
          addEntrytoTankDictionary(midTank);
        }

        if (highTankRecord) {
          if (originalHigh && (originalHigh.tankId != highTankRecord.tankId)) {
            removeTankFromSite(originalHigh, utcTime);
          }
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

        // if the warning popup is visible, remove it
        //if(visible2) { setVisible2(false); }

        // check to see if the request was ok, give a message based on that
        if (result.success && tankResult.success) {
            setMessage("File updated successfully!");
            setMessageColor(customTheme['color-success-700']);
          } else {
            if (result.error) {
              
            } else if (tankResult.error) {
              setMessage(`Error: ${tankResult.error}`);
            }
            setMessageColor(customTheme['color-danger-700']);
          }
        setVisible(true);
    };

    //method to navigate home to send to popup so it can happen after dismiss button is clicked
    function navigateHome(){
      navigation.navigate("Home")
    }

    const removeTankFromSite = (tank: TankRecord, time: string) => {
      let newTankEntry = copyTankRecord(tank);
      newTankEntry.location = "ASB279";
      newTankEntry.pressure = 500;
      newTankEntry.userId = nameValue;
      newTankEntry.updatedAt = time;
      addEntrytoTankDictionary(newTankEntry);
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
                setmidId(midEntry.tankId);
                setmidValue(midEntry.co2.toString() + " ~ " + midEntry.ch4.toString());
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
          }
      }
  }, [latestEntry]);

    return (
      <KeyboardAvoidingView
            behavior = "padding"
            style={styles.container}>
        <ScrollView automaticallyAdjustKeyboardInsets={true}>
          <Layout style={styles.container}>
            {/* header */}
            <Text category='h1' style={{textAlign: 'center'}}>{site}</Text>

            {/* success/failure popup */}
            <PopupProp popupText={message}
            popupColor={messageColor} 
            onPress={setVisible}
            navigateHome={navigateHome} 
            visible={visible}/>

            {/* popup if user has missing input */}
            <PopupProp2Button popupText='Missing some input field(s)'
            popupColor={customTheme['color-danger-700']}
            sendData={handleUpdate}
            removePopup={setVisible2}
            visible={visible2}/>

            {/* text box for instrument */}
              <TextInput
                labelText="Instrument"
                labelValue={instrumentInput}
                onTextChange={setInstrumentInput}
                placeholder="Please enter instrument name"
                style={styles.inputText}
              />

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
                  label={"LTS (if applicable)"}
                  onSelect={() => handleTankChange("lts")}
                  placeholder="Select LTS Tank"
                  value={ltsId}
                  style={styles.inputText}
              >
              <SelectItem key={0} title={"Change tank"} />
              </Select>
              <TextInput labelText=' ' 
                labelValue={ltsValue} 
                onTextChange={setLTSValue} 
                placeholder='Value' 
                style={styles.tankInput} />
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
                  label={"Low"}
                  onSelect={() => handleTankChange("low")}
                  placeholder="Select Low Tank"
                  value={lowId}
                  style={styles.inputText}
              >
              <SelectItem key={0} title={"Change tank"} />
              </Select>
              <TextInput labelText=' ' 
                labelValue={lowValue} 
                onTextChange={setLowValue} 
                placeholder='Value' 
                style={styles.tankInput} />
              <TextInput labelText=' ' 
                labelValue={lowPressure} 
                onTextChange={setLowPressure} 
                placeholder='Pressure' 
                style={styles.tankInput} />
            </Layout>

            {/* mid input */}
            <Layout style = {styles.rowContainer}>
            <Select
                  label={"Mid"}
                  onSelect={() => handleTankChange("mid")}
                  placeholder="Select Mid Tank"
                  value={midId}
                  style={styles.inputText}
              >
              <SelectItem key={0} title={"Change tank"} />
              </Select>
              <TextInput labelText=' ' 
                labelValue={midValue} 
                onTextChange={setmidValue} 
                placeholder='Value' 
                style={styles.tankInput} />
              <TextInput labelText=' ' 
                labelValue={midPressure} 
                onTextChange={setmidPressure} 
                placeholder='Pressure' 
                style={styles.tankInput} />
            </Layout>

            {/* high input */} 
            <Layout style = {styles.rowContainer}>
            <Select
                  label={"High"}
                  onSelect={() => handleTankChange("high")}
                  placeholder="Select High Tank"
                  value={highId}
                  style={styles.inputText}
              >
              <SelectItem key={0} title={"Change tank"} />
              </Select>
              <TextInput labelText=' ' 
                labelValue={highValue} 
                onTextChange={setHighValue} 
                placeholder='Value' 
                style={styles.tankInput} />
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
    inputText: {
      flex: 1,
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
});