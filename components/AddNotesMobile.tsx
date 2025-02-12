/**
 * Add Notes Page for mobile sites
 * @author Blake Stambaugh, Megan Ostlie, August O'Rourke, and David Schiwal
 *  12/4/24
 * This page will take in input from the user, format it, and upload it to the
 * github repo. This page is slightly different than the main AddNotes page because
 * the mobile sites do not have as many tanks as the stationary sites
 */
import { StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { buildMobileNotes, MobileEntry } from '../scripts/Parsers';
import { NaviProp } from './types';
import TextInput from './TextInput'
import NoteInput from './NoteInput'
import { IndexPath, Layout, Select, SelectItem, Button, Text } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { customTheme } from './CustomTheme'
import { setSiteFile, getFileContents } from '../scripts/APIRequests';
import { parseNotes, ParsedData } from '../scripts/Parsers'
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

    // will call setFile to send the PUT request. 
    // If it is successful it will display a success message
    // if it fails then it will display a failure message
    const handleUpdate = async () => {
        // get time submitted
        const now = new Date();
        const year = now.getUTCFullYear();
        const month = String(now.getUTCMonth() + 1).padStart(2, "0");
        const day = String(now.getUTCDate()).padStart(2, "0");
        const hours = String(now.getUTCHours()).padStart(2, "0");
        const minutes = String(now.getUTCMinutes()).padStart(2, "0");
        
        // create an entry object data that will be sent off to the repo
        let data: MobileEntry = 
        {
          time_in: `${year}-${month}-${day} ${timeValue}`,
          time_out: `${year}-${month}-${day} ${hours}:${minutes}`,
          names: nameValue,
          instrument: instrumentInput.trim() ? instrumentInput : null,
          tank:
          {
            id: tankId,
            value: tankValue,
            unit: "ppm",
            pressure: tankPressure
          },
          additional_notes: notesValue 
        };

        // send the request
        const result = await setSiteFile(site, buildMobileNotes(data), "updating notes from researchFlow");

        // if the warning popup is visible, remove it
        if(visible2) { setVisible2(false); }

        // check to see if the request was ok, give a message based on that
        if (result.success) {
            setMessage("File updated successfully!");
            setMessageColor(customTheme['color-success-700']);
          } else {
            setMessage(`Error: ${result.error}`);
            setMessageColor(customTheme['color-danger-700']);
          }
        setVisible(true);
    };

    //method to navigate home to send to popup so it can happen after dismiss button is clicked
    function navigateHome(){
      navigation.navigate("Home")
    }

    //Set tank ids, values, and instruments if available in parsed data
    useEffect(() => {
      if (latestEntry) {
          if (latestEntry.tank) {
              setTankId(latestEntry.tank.id || "");
              setTankValue(latestEntry.tank.value || "");
          }
          if (latestEntry.instrument) {
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

            {/* Tank input */}
            <Layout style = {styles.rowContainer}>
              <TextInput labelText='Tank (if needed)' 
                labelValue={tankId} 
                onTextChange={setTankId} 
                placeholder='Tank ID' 
                style={styles.tankInput} />
              <TextInput labelText=' ' 
                labelValue={tankValue} 
                onTextChange={setTankValue} 
                placeholder='Value' 
                style={styles.tankInput} />
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
});