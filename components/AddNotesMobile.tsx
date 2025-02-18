/**
 * Add Notes Page for mobile sites
 * @author Blake Stambaugh, Megan Ostlie, August O'Rourke, and David Schiwal
 * Updated: 2/11/25 - MO
 * This page will take in input from the user, format it, and upload it to the
 * github repo. This page is slightly different than the main AddNotes page because
 * the mobile sites do not have as many tanks as the stationary sites
 */
import { StyleSheet, KeyboardAvoidingView, Platform, Modal, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { buildMobileNotes, MobileEntry } from '../scripts/Parsers';
import TextInput from './TextInput'
import NoteInput from './NoteInput'
import { Layout, Button, Text, Select, SelectItem } from '@ui-kitten/components';
import { customTheme } from './CustomTheme'
import { setSiteFile, getFileContents, TankRecord, getLatestTankEntry, addEntrytoTankDictionary, setTankTracker, getDirectory, setInstrumentFile } from '../scripts/APIRequests';
import { parseNotes, ParsedData, copyTankRecord } from '../scripts/Parsers'
import PopupProp from './Popup';
import PopupProp2Button from './Popup2Button';
import { NavigationType, routeProp } from './types'
import { ThemeContext } from './ThemeContext';

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
    const [tankId, setTankId] = useState("");
    const [tankValue, setTankValue] = useState("");
    const [tankPressure, setTankPressure] = useState("");
    const [notesValue, setNotesValue] = useState("");
    const [instrumentInput, setInstrumentInput] = useState("");
    const [tankRecord, setTankRecord] = useState<TankRecord>(undefined);
    const [originalTank, setOriginalTank] = useState<TankRecord>(undefined);
    const [instrumentNames, setInstrumentNames] = useState<string[]>();
    const [instrumentIndex, setInstrumentIndex] = useState<IndexPath | IndexPath[]>(new IndexPath(0));
    const [originalInstrument, setOriginalInstrument] = useState("");
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [customInstrument, setCustomInstrument] = useState<string>("");

    // used for determining if PUT request was successful
    // will set the success/fail notification to visible, aswell as the color and text
    const [visible, setVisible] = useState(false);
    const [messageColor, setMessageColor] = useState("");
    const [message, setMessage] = useState("");
    const [returnHome, retHome] = useState(false);
    //used for popup if info is missing
    const [visible2, setVisible2] = useState(false);

    //method will warn user if fields haven't been input
    function checkTextEntries(){
        if(timeValue == "" ||
           nameValue == "" ||
           tankId == "" ||
           tankValue == "" ||
           tankPressure == "" ||
           notesValue == ""){
               setVisible2(true);
        }
        else{
            handleUpdate();
           }
    }

    const handleTankChange = () => {
      navigation.navigate('SelectTank', {
        from: 'AddNotesMobile',
          onSelect: (selectedTank) => {
            setTankId(selectedTank);
            const entry = getLatestTankEntry(selectedTank) || getLatestTankEntry(selectedTank.toLowerCase());
            setTankRecord(entry);
            setTankValue(entry.co2.toString() + " ~ " + entry.ch4.toString());
          }
      });
    }

    const clearTankEntry = () => {
      setTankId("");
      setTankValue("");
      setTankRecord(undefined);
    }

    const handleInstrumentUpdate = (index: IndexPath | IndexPath[]) => {
      const selectedRow = (index as IndexPath).row;
      if (selectedRow === instrumentNames?.length) {
        setInstrumentInput("");
      } else if (selectedRow === instrumentNames?.length + 1) {
        setModalVisible(true);
      } else {
        const selectedInstrument = instrumentNames?.[selectedRow] ?? "";
        setInstrumentInput(selectedInstrument);
      }
    };

    const installedInstrumentNotes = (time: string): string => {
      let siteName = site.replace("mobile/","");
      let result: string = `- Time in: ${time}\n`;
  
      result += `- Name: ${nameValue}\n`;
      result += `- Notes: Installed at ${siteName}\n`;
      result += "---\n";
  
      return result;
    };

    const removedInstrumentNotes = (time: string): string => {
      let siteName = site.replace("mobile/","");
      let result: string = `- Time in: ${time}\n`;
  
      result += `- Name: ${nameValue}\n`;
      result += `- Notes: Removed from ${siteName}\n`;
      result += "---\n";
  
      return result;
    };

    const addCustomInstrument = () => {
      if (customInstrument.trim() !== "") {
        setInstrumentInput(customInstrument);
        setCustomInstrument("");
      }
      setModalVisible(false);
    }

    // will call setFile to send the PUT request. 
    // If it is successful it will display a success message
    // if it fails then it will display a failure message
    const handleUpdate = async () => {
      const Tankignored: boolean = (tankId == "" && tankValue == "" && tankPressure == "")

        // get time submitted
        const now = new Date();
        const year = now.getUTCFullYear();
        const month = String(now.getUTCMonth() + 1).padStart(2, "0");
        const day = String(now.getUTCDate()).padStart(2, "0");
        const hours = String(now.getUTCHours()).padStart(2, "0");
        const minutes = String(now.getUTCMinutes()).padStart(2, "0");
        const seconds = String(now.getUTCSeconds()).padStart(2, "0");
        
        // create an entry object data that will be sent off to the repo
        let data: MobileEntry = 
        {
          time_in: `${year}-${month}-${day} ${timeValue}`,
          time_out: `${year}-${month}-${day} ${hours}:${minutes}`,
          names: nameValue,
          instrument: instrumentInput.trim() ? instrumentInput : null,
          tank: Tankignored ? null:
          {
            id: tankId,
            value: tankValue,
            unit: "ppm",
            pressure: tankPressure
          },
          additional_notes: notesValue 
        };

        const utcTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}Z`;
        const siteName = site.replace("mobile/","");
        if (originalTank && (!tankRecord || (originalTank.tankId != tankRecord.tankId))) {
          let newTankEntry = copyTankRecord(originalTank);
          newTankEntry.location = "ASB279";
          newTankEntry.pressure = 500;
          newTankEntry.userId = nameValue;
          newTankEntry.updatedAt = utcTime;
          addEntrytoTankDictionary(newTankEntry);
        }
        if (tankRecord) {
          let tank = copyTankRecord(tankRecord);
          tank.location = siteName;
          tank.updatedAt = utcTime;
          tank.pressure = parseInt(tankPressure);
          tank.userId = nameValue;
          addEntrytoTankDictionary(tank);
        }

        // send the request
        const result = await setSiteFile(site, buildMobileNotes(data), "updating notes from researchFlow");
        const tankResult = await setTankTracker();

        let instMaintResult;
        let instMaintResult2;
        
        // If a new instrument was added
        if (instrumentInput && (!originalInstrument || (originalInstrument != instrumentInput))) {
          if (instrumentNames.includes(instrumentInput)) {
            const notes = installedInstrumentNotes(utcTime);
            instMaintResult = await setInstrumentFile(`instrument_maint/LGR_UGGA/${instrumentInput}`, notes, `Updated ${instrumentInput}.md`, true, siteName);
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
        if(visible2) { setVisible2(false); }

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
        setVisible(true);
    };

    //method to navigate home to send to popup so it can happen after dismiss button is clicked
    function navigateHome(nav:boolean){
      if(nav){
        navigation.navigate("Home")
      }
    }

    //Set tank ids, values, and instruments if available in parsed data
    useEffect(() => {
      if (latestEntry) {
        if (latestEntry.tank) {
          const tankID = latestEntry.tank.id.split("_").pop();
          if (tankID) {
            const tankEntry = getLatestTankEntry(tankID) || getLatestTankEntry(tankID.toLowerCase());
            if (tankEntry) {
              setTankRecord(tankEntry);
              setOriginalTank(tankEntry);
              setTankId(tankEntry.tankId)
              setTankValue(tankEntry.co2.toString() + " ~ " + tankEntry.ch4.toString());
            }
          }
        }
        if (latestEntry.instrument) {
          setOriginalInstrument(latestEntry.instrument);
          setInstrumentInput(latestEntry.instrument);
        }
      }
  }, [latestEntry]);

    return (
      <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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

            {/* text box for instrument */}
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

            {/* Tank input */}
            <Layout style = {styles.rowContainer}>
              <Select
                label={"Tank (if needed)"}
                onSelect={(indexPath) => {
                  const index = Array.isArray(indexPath) ? indexPath[0].row : indexPath.row;
                  if (index === 0) {
                    handleTankChange();
                  } else if (index === 1) {
                    clearTankEntry();
                  }
                  }}
                  placeholder="Select Tank"
                  value={tankId && tankValue ? `${tankId}: ${tankValue}` : ""}
                  style={styles.inputText}
                >
                <SelectItem key={0} title={"Change tank"} />
                <SelectItem key={1} title={"Remove tank"} />
                </Select>
              <TextInput labelText=' ' 
                labelValue={tankPressure} 
                onTextChange={setTankPressure} 
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
              onPress={() => checkTextEntries()}
              appearance='filled'
              status='primary' 
              style={{margin: 20, backgroundColor: "#06b4e0"}}>
              {evaProps => <Text {...evaProps} category="h6" style={{color: "black"}}>Submit</Text>}
            </Button>
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