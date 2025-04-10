/**
 * Tank Tracker
 * @author Blake Stambaugh, David Schiwal, Megan Ostlie, August O'Rourke
 * Updated 1/27/25
 * 
 * This page is responsible for tracking tank statuses. Will look at previous
 * data and determine when it will most likely run out and need replacement.
 */
import { StyleSheet, KeyboardAvoidingView } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { useRoute } from '@react-navigation/native';
import { Button, IndexPath, Layout, Text } from '@ui-kitten/components';
import TextInput from './TextInput'
import { NavigationType, routeProp } from './types'
import { ScrollView } from 'react-native-gesture-handler';
import PopupProp from './Popup';
import { getLatestTankEntry, setTankTracker, TankRecord, addEntrytoTankDictionary, buildTankRecordString, offlineTankEntry } from '../scripts/APIRequests';
import { isConnected } from '../scripts/Helpers';
import { sanitize } from '../scripts/Parsers';
import LoadingScreen from "./LoadingScreen";

export default function TankTracker({ navigation }: NavigationType) {
    const route = useRoute<routeProp>();
    let tank = route.params?.site;

    // used for setting and remembering the input values
    const [networkStatus, setNetworkStatus] = useState(true)
    const [nameValue, setNameValue] = useState("");
    const [PSIValue, setPSIValue] = useState("");
    const [CO2Value, setCO2Value] = useState("");
    const [CH4Value, setCH4Value] = useState("");
    const [notesValue, setNotesValue] = useState("");
    const [fillIDValue, setFillIDValue] = useState("");
    const [locationValue, setLocationValue] = useState("");
    const [latestEntry, setLatestEntry] = useState<TankRecord>(undefined);

    
    // used for determining if PUT request was successful
    // will set the success/fail notification to visible, aswell as the color and text
    const [visible, setVisible] = useState(false);
    const [messageStatus, setMessageStatus] = useState("");
    const [message, setMessage] = useState("");
    const [returnHome, retHome] = useState(false);
    const visibleRef = useRef(false);

    // tank predictor
    let prevDate = "";
    let prevPressure = 0;

    // used for loading screen
    const [loadingValue, setLoadingValue] = useState(false);

    // Autofills fields based on tank entry
    useEffect(() => {
      const fetchTank = async () => {
        setNetworkStatus(await isConnected())
        if (tank) {
         
          const entry = getLatestTankEntry(tank);
          if (entry) {
            setLocationValue(entry.location);
            setCO2Value(entry.co2.toString());
            setCH4Value(entry.ch4.toString());
            setFillIDValue(entry.fillId);
            setPSIValue(entry.pressure.toString());
            setLatestEntry(entry);
  
            // save previous date and pressure for tank predictor
            prevDate = entry.updatedAt;
            prevPressure = entry.pressure;
  
          }
        }
      }
      fetchTank()
    }, [tank]);

    const getCurrentUtcDateTime = () => {
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
    };

    // Builds new tank entry with updated values
    const buildTankEntry = (): TankRecord => {
      const currentTime = getCurrentUtcDateTime();
      let newEntry: TankRecord = {
        serial: latestEntry ? latestEntry.serial : "",
        ch4: parseFloat(CH4Value),
        ch4CalibrationFile: latestEntry ? latestEntry.ch4CalibrationFile : "",
        ch4InstrumentId: latestEntry ? latestEntry.ch4InstrumentId : "",
        ch4N: latestEntry ? latestEntry.ch4N : undefined,
        ch4RelativeTo: latestEntry ? latestEntry.ch4RelativeTo : "",
        ch4Stdev: latestEntry ? latestEntry.ch4Stdev : undefined,
        ch4Sterr: latestEntry ? latestEntry.ch4Sterr : undefined,
        co: latestEntry ? latestEntry.co : undefined,
        co2: parseFloat(CO2Value),
        co2CalibrationFile: latestEntry ? latestEntry.co2CalibrationFile : "",
        co2InstrumentId: latestEntry ? latestEntry.co2InstrumentId : "",
        co2N: latestEntry ? latestEntry.co2N : undefined,
        co2RelativeTo: latestEntry ? latestEntry.co2RelativeTo : "",
        co2Stdev: latestEntry ? latestEntry.co2Stdev : undefined,
        co2Sterr: latestEntry ? latestEntry.co2Sterr : undefined,
        coCalibrationFile: latestEntry ? latestEntry.coCalibrationFile : "",
        coInstrumentId: latestEntry ? latestEntry.coInstrumentId : "",
        coN: latestEntry ? latestEntry.coN : undefined,
        coRelativeTo: latestEntry ? latestEntry.coRelativeTo : "",
        coStdev: latestEntry ? latestEntry.coStdev : undefined,
        coSterr: latestEntry ? latestEntry.coSterr : undefined,
        comment: sanitize(notesValue),
        d13c: latestEntry ? latestEntry.d13c : undefined,
        d13cN: latestEntry ? latestEntry.d13cN : undefined,
        d13cStdev: latestEntry ? latestEntry.d13cStdev : undefined,
        d13cSterr: latestEntry ? latestEntry.d13cSterr : undefined,
        d18o: latestEntry ? latestEntry.d18o : undefined,
        d18oN: latestEntry ? latestEntry.d18oN : undefined,
        d18oStdev: latestEntry ? latestEntry.d18oStdev : undefined,
        d18oSterr: latestEntry ? latestEntry.d18oSterr : undefined,
        location: sanitize(locationValue),
        ottoCalibrationFile: latestEntry ? latestEntry.ottoCalibrationFile : "",
        owner: latestEntry ? latestEntry.owner : "",
        pressure: parseFloat(PSIValue),
        tankId: tank,
        updatedAt: currentTime,
        userId: sanitize(nameValue),
        fillId: sanitize(fillIDValue)
    };
      return newEntry;
    };

    // Checks if certain fields are missing
    const handleSubmit = () => {
      if (!nameValue || !locationValue || !PSIValue) {
        setMessage("Please make sure Name, Location, and PSI are filled out before submitting.");
        setMessageStatus("danger");
        setVisible(true);
        return;
      }
      handleUpdate();
    }

    // Sends PUT request to GitHub
    const handleUpdate = async () => {
           // show spinner while submitting
           setLoadingValue(true);
           const entry = buildTankEntry();
           addEntrytoTankDictionary(entry);
           let result = undefined
           if(networkStatus)
           {
             const entry = buildTankEntry();
             addEntrytoTankDictionary(entry);
             const tankRecordString = buildTankRecordString(entry);
             result = await setTankTracker(tankRecordString);
           }
           else
           {
             result = await  offlineTankEntry(tank, parseFloat(PSIValue), locationValue, getCurrentUtcDateTime(), nameValue, parseFloat(CO2Value), parseFloat(CH4Value), notesValue, fillIDValue)
           }
     
           // remove spinner once we have results back
           setLoadingValue(false);
           if (result.success) {
             setMessage("File updated successfully!");
             setMessageStatus("success");
             retHome(true);
           } else {
             setMessage(`Error: ${result.error}`);
             setMessageStatus("danger");
           }
           setTimeout(() => {
             setVisible(true);
             visibleRef.current = true;
           }, 100);
    }

    //method to navigate home to send to popup so it can happen after dismiss button is clicked
    function navigateHome(nav:boolean){
      if(nav){
        navigation.navigate("Home")
      }
    }

    return (
      <KeyboardAvoidingView
                  behavior = "padding"
                  style={{flex: 1}}>
          <ScrollView automaticallyAdjustKeyboardInsets={true} keyboardShouldPersistTaps='handled' contentContainerStyle={{ flexGrow: 1 }}>
            <Layout style={styles.container} level="1">
              
              {/* header */}
              <Text category="h1" style={{ textAlign: "center" }}>
                {tank}
              </Text>

              {/* loading screen */}
              <LoadingScreen visible={loadingValue} />

              {/* success/failure popup */}
              <PopupProp popupText={message} 
                popupStatus={messageStatus} 
                onPress={setVisible} 
                navigateHome={navigateHome} 
                visible={visible}
                returnHome={returnHome}
              />

            {/* Name input */}
            <TextInput
              labelText="Name"
              labelValue={nameValue}
              onTextChange={setNameValue}
              placeholder="First Last"
              style={styles.textInput}
            />

              {/* FillID input */}
              <TextInput
                labelText="Fill ID"
                labelValue={fillIDValue}
                onTextChange={setFillIDValue}
                placeholder="ID"
                style={styles.textInput}
              />

              {/* Location input */}
              <TextInput
                labelText="Location"
                labelValue={locationValue}
                onTextChange={setLocationValue}
                placeholder="Enter location"
                style={styles.textInput}
              />

              {/* PSI input */}
              <TextInput
                labelText="PSI"
                labelValue={PSIValue !== undefined ? PSIValue : ""}
                onTextChange={setPSIValue}
                placeholder="PSI"
                style={styles.textInput}
              />

              {/* C02 entry */}
              <TextInput
                labelText="CO2"
                labelValue={CO2Value !== undefined ? CO2Value: ""}
                onTextChange={setCO2Value}
                placeholder="CO2"
                style={styles.textInput}
              />

              {/* CH4 entry */}
              <TextInput
                labelText="CH4"
                labelValue={CH4Value !== undefined ? CH4Value : ""}
                onTextChange={setCH4Value}
                placeholder="CH4"
                style={styles.textInput}
              />

            {/* notes entry */}
            <TextInput
              labelText="Notes"
              labelValue={notesValue}
              onTextChange={setNotesValue}
              placeholder="Notes"
              style={styles.reasonText}
            />

              {/* submit button */}
              <Button
                onPress={() => handleSubmit()}
                appearance="filled"
                status="primary"
                style={styles.submitButton}
              >
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
      flexDirection: "column",
      alignItems: 'stretch',        // has button fill space horizontally
      justifyContent: 'flex-start',
    },
    reasonText: {
      flex: 1,
      margin: 8
    },
    textInput: {
      flex: 1,
      margin: 8
    },
    submitButton:{
      margin: 20, 
      backgroundColor: "#06b4e0",
    },
});
