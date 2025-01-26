/**
 * Tank Tracker
 * @author Blake Stambaugh and David Schiwal
 * 12/5/24
 * 
 * This page is responsible for tracking tank statuses. Will look at previous
 * data and determine when it will most likely run out and need replacement.
 */
import { StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { ApplicationProvider, Button, IndexPath, Layout, Select, SelectItem, Text } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import TextInput from './TextInput'
import { customTheme } from './CustomTheme'
import { NavigationType, routeProp } from './types'
import { ScrollView } from 'react-native-gesture-handler';
import PopupProp from './Popup';
import { getLatestTankEntry, TankRecord } from '../scripts/APIRequests';

export default function TankTracker({ navigation }: NavigationType) {
    const route = useRoute<routeProp>();
    let tank = route.params?.site;

    // used for setting and remembering the input values
    const [nameValue, setNameValue] = useState("");
    const [dateValue, setDateValue] = useState("");
    const [PSIValue, setPSIValue] = useState("");
    const [CO2Value, setCO2Value] = useState("");
    const [CH4Value, setCH4Value] = useState("");
    const [notesValue, setNotesValue] = useState("");
    const [fillIDValue, setFillIDValue] = useState("");
    const [locationValue, setLocationValue] = useState("");

    const [visible, setVisible] = useState(false);
    const [messageColor, setMessageColor] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
      if (tank) {
        const latestEntry = getLatestTankEntry(tank);
        console.log(latestEntry);
        if (latestEntry) {
          console.log(latestEntry.fillId);
          setLocationValue(latestEntry.location);
          setCO2Value(latestEntry.co2.toString());
          setCH4Value(latestEntry.ch4.toString());
          setFillIDValue(latestEntry.fillId);
          setPSIValue(latestEntry.pressure.toString());
        }
      }
    }, [tank]);

    // Use IndexPath for selected index for drop down menu
    const [selectedIndex, setSelectedIndex] = useState<IndexPath>(new IndexPath(0)); // Default to first item
    const tanks = ['Tank 1', 'Tank 2', 'Tank 3']

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

    const buildTankEntry = (): string => {
      const currentTime = getCurrentUtcDateTime()
      return `${fillIDValue},serial,${currentTime},${PSIValue},${locationValue},owner,${CO2Value},co2Stdev,co2Sterr,co2N,${CH4Value},ch4Stdev,ch4Sterr,ch4N,co,coStdev,coSterr,coN,d13c,d13cStdev,d13cSterr,d13cN,d18o,d18oStdev,d18oSterr,d18oN,co2RelativeTo,${notesValue},${nameValue},co2InstrumentId,ch4InstrumentId,coInstrumentId,ottoCalibrationFile,co2CalibrationFile,ch4RelativeTo,ch4CalibrataionFile,coRelativeTo,coCalibrationFile,tankID`;
    };

    const handleSubmit = () => {
      if (!nameValue || !locationValue || !PSIValue) {
        setMessage("Please make sure Name, Location, and PSI are filled out before submitting.");
        setMessageColor(customTheme['color-danger-700']);
        setVisible(true);
        return;
      }
      const entry = buildTankEntry();
      alert(entry);
    }

    return (
      <KeyboardAvoidingView
                  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                  style={styles.container}>
        <ApplicationProvider {...eva} theme={customTheme}>
          <ScrollView>
            <Layout style={styles.container} level="1">
              
              {/* header */}
              <Text category="h1" style={{ textAlign: "center" }}>
                {tank}
              </Text>

              {/* text inputs */}
              {/* success/failure popup */}
              <PopupProp popupText={message} 
                popupColor={messageColor} 
                onPress={setVisible} 
                visible={visible}/>

              {/* Name input */}
              <TextInput
                labelText="Name"
                labelValue={nameValue}
                onTextChange={setNameValue}
                placeholder="Jane Doe"
                style={styles.textInput}
              />

              {/* FillID input */}
              <TextInput
                labelText="Fill ID"
                labelValue={fillIDValue}
                onTextChange={setFillIDValue}
                placeholder="240124_M1"
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
                labelValue={PSIValue}
                onTextChange={setPSIValue}
                placeholder="100"
                style={styles.textInput}
              />

              {/* C02 entry */}
              <TextInput
                labelText="CO2"
                labelValue={CO2Value}
                onTextChange={setCO2Value}
                placeholder="100"
                style={styles.textInput}
              />

              {/* CH4 entry */}
              <TextInput
                labelText="CH4"
                labelValue={CH4Value}
                onTextChange={setCH4Value}
                placeholder="100"
                style={styles.textInput}
              />

              {/* notes entry */}
              <TextInput
                labelText="Notes"
                labelValue={notesValue}
                onTextChange={setNotesValue}
                placeholder="Tank draining at normal rate."
                style={styles.reasonText}
              />

              {/* submit button */}
              <Button
                onPress={() => handleSubmit()}
                appearance="filled"
                status="primary"
                style={{ margin: 8 }}
              >
                Submit
              </Button>
            </Layout>
          </ScrollView>
        </ApplicationProvider>
      </KeyboardAvoidingView>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'stretch',        // has button fill space horizontally
      justifyContent: 'space-evenly',
    },
    reasonText: {
      flex: 1,
      margin: 8
    },
    textInput: {
      flex: 1,
      margin: 8
    }
});