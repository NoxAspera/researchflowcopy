/**
 * Tank Tracker
 * @author Blake Stambaugh, David Schiwal, Megan Ostlie
 * Updated 1/27/25
 * 
 * This page is responsible for tracking tank statuses. Will look at previous
 * data and determine when it will most likely run out and need replacement.
 */
import { StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useDebugValue, useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { Button, IndexPath, Layout, Select, SelectItem, Text } from '@ui-kitten/components';
import TextInput from './TextInput'
import { NavigationType, routeProp } from './types'
import { ScrollView } from 'react-native-gesture-handler';
import PopupProp from './Popup';
import { getLatestTankEntry, setTankTracker, TankRecord } from '../scripts/APIRequests';
import { Float } from 'react-native/Libraries/Types/CodegenTypes';
import { customTheme } from './CustomTheme'

export default function TankTracker({ navigation }: NavigationType) {
    const route = useRoute<routeProp>();
    let tank = route.params?.site;

    // used for setting and remembering the input values
    const [nameValue, setNameValue] = useState("");
    const [dateValue, setDateValue] = useState("");
    const [PSIValue, setPSIValue] = useState<Float>(undefined);
    const [CO2Value, setCO2Value] = useState<Float>(undefined);
    const [CH4Value, setCH4Value] = useState<Float>(undefined);
    const [notesValue, setNotesValue] = useState("");
    const [fillIDValue, setFillIDValue] = useState("");
    const [locationValue, setLocationValue] = useState("");
    const [latestEntry, setLatestEntry] = useState<TankRecord>(undefined);

    const [visible, setVisible] = useState(false);
    const [messageColor, setMessageColor] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
      if (tank) {
        const entry = getLatestTankEntry(tank);
        console.log("Latest Entry:");
        console.log(entry);
        if (entry) {
          setLocationValue(entry.location);
          setCO2Value(entry.co2);
          setCH4Value(entry.ch4);
          setFillIDValue(entry.fillId);
          setPSIValue(entry.pressure);
          setLatestEntry(entry);
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

    const buildTankEntry = (): TankRecord => {
      const currentTime = getCurrentUtcDateTime();
      let newEntry: TankRecord = {
        serial: latestEntry ? latestEntry.serial : "",
        ch4: CH4Value,
        ch4CalibrationFile: latestEntry ? latestEntry.ch4CalibrationFile : "",
        ch4InstrumentId: latestEntry ? latestEntry.ch4InstrumentId : "",
        ch4N: latestEntry ? latestEntry.ch4N : undefined,
        ch4RelativeTo: latestEntry ? latestEntry.ch4RelativeTo : "",
        ch4Stdev: latestEntry ? latestEntry.ch4Stdev : undefined,
        ch4Sterr: latestEntry ? latestEntry.ch4Sterr : undefined,
        co: latestEntry ? latestEntry.co : undefined,
        co2: CO2Value,
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
        comment: notesValue,
        d13c: latestEntry ? latestEntry.d13c : undefined,
        d13cN: latestEntry ? latestEntry.d13cN : undefined,
        d13cStdev: latestEntry ? latestEntry.d13cStdev : undefined,
        d13cSterr: latestEntry ? latestEntry.d13cSterr : undefined,
        d18o: latestEntry ? latestEntry.d18o : undefined,
        d18oN: latestEntry ? latestEntry.d18oN : undefined,
        d18oStdev: latestEntry ? latestEntry.d18oStdev : undefined,
        d18oSterr: latestEntry ? latestEntry.d18oSterr : undefined,
        location: locationValue,
        ottoCalibrationFile: latestEntry ? latestEntry.ottoCalibrationFile : "",
        owner: latestEntry ? latestEntry.owner : "",
        pressure: PSIValue,
        tankId: tank,
        updatedAt: currentTime,
        userId: nameValue,
        fillId: fillIDValue
    };
      return newEntry;
    };

    const handleSubmit = () => {
      if (!nameValue || !locationValue || !PSIValue) {
        setMessage("Please make sure Name, Location, and PSI are filled out before submitting.");
        setMessageColor(customTheme['color-danger-700']);
        setVisible(true);
        return;
      }
      handleUpdate()
    }

    const handleUpdate = async () => {
      const entry = buildTankEntry();
      const result = await setTankTracker(entry);
      if (result.success) {
          setMessage("File updated successfully!");
          setMessageColor(customTheme['color-success-700']);
        } else {
          setMessage(`Error: ${result.error}`);
          setMessageColor(customTheme['color-danger-700']);
        }
        setVisible(true);
      }

    return (
      <KeyboardAvoidingView
                  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                  style={styles.container}>
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
                labelValue={PSIValue !== undefined ? PSIValue.toString() : ""}
                onTextChange={(text) => setPSIValue(parseFloat(text) || undefined)}
                placeholder="100"
                style={styles.textInput}
              />

              {/* C02 entry */}
              <TextInput
                labelText="CO2"
                labelValue={CO2Value !== undefined ? CO2Value.toString() : ""}
                onTextChange={(text) => setCO2Value(parseFloat(text) || undefined)}
                placeholder="100"
                style={styles.textInput}
              />

              {/* CH4 entry */}
              <TextInput
                labelText="CH4"
                labelValue={CH4Value !== undefined ? CH4Value.toString() : ""}
                onTextChange={(text) => setCH4Value(parseFloat(text) || undefined)}
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