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
import { buildNotes, Entry } from '../scripts/Parsers';
import { NaviProp } from './types';
import TextInput from './TextInput'
import NoteInput from './NoteInput'
import { IndexPath, Layout, Select, SelectItem, Button, Text } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { customTheme } from './CustomTheme'
import { setFile, getFileContents } from '../scripts/APIRequests';
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
        const year = now.getFullYear().toString()
        const month = (now.getMonth() + 1).toString() // now.getMonth() is zero-base (i.e. January is 0), likely due to something with Oracle's implementation - August
        const day = now.getDate().toString()
        const hours= now.getHours().toString()
        const minutes = now.getMinutes().toString()
        
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

        // send the request
        const result = await setFile(site, buildNotes(data), "updating notes from researchFlow");

        // if the warning popup is visible, remove it
        //if(visible2) { setVisible2(false); }

        // check to see if the request was ok, give a message based on that
        if (result.success) {
            setMessage("File updated successfully!");
            navigation.navigate("Home")
            setMessageColor(customTheme['color-success-700']);
          } else {
            setMessage(`Error: ${result.error}`);
            setMessageColor(customTheme['color-danger-700']);
          }
        setVisible(true);
    };

    //Set tank ids, values, and instruments if available in parsed data
    useEffect(() => {
      if (latestEntry) {
          if (latestEntry.lts) {
              setLTSId(latestEntry.lts.id || "");
              setLTSValue(latestEntry.lts.value || "");
          }
          if (latestEntry.low_cal) {
            setLowId(latestEntry.low_cal.id || "");
            setLowValue(latestEntry.low_cal.value || "");
          }
          if (latestEntry.mid_cal) {
            setmidId(latestEntry.mid_cal.id || "");
            setmidValue(latestEntry.mid_cal.value || "");
          }
          if (latestEntry.high_cal) {
            setHighId(latestEntry.high_cal.id || "");
            setHighValue(latestEntry.high_cal.value || "");
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
              <TextInput labelText='LTS (if needed)' 
                labelValue={ltsId} 
                onTextChange={setLTSId} 
                placeholder='Tank ID' 
                style={styles.tankInput} />
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
              <TextInput labelText='Low' 
                labelValue={lowId} 
                onTextChange={setLowId} 
                placeholder='Tank ID' 
                style={styles.tankInput} />
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
              <TextInput labelText='Mid' 
                labelValue={midId} 
                onTextChange={setmidId} 
                placeholder='Tank ID' 
                style={styles.tankInput} />
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
              <TextInput labelText='High' 
                labelValue={highId} 
                onTextChange={setHighId} 
                placeholder='Tank ID' 
                style={styles.tankInput} />
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