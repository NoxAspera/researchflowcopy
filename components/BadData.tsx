/**
 * Bad Data Page
 * @author David Schiwal, Blake Stambaugh, Megan Ostlie
 * Updated: 1/10/25
 * 
 * This page allows the user to mark data as bad. They will enter in
 * a date range, the data, and why it is bad. The code will format and
 * submit that request to the github repo.
 */
import { StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import { NaviProp } from './types';
import TextInput from './TextInput'
import NoteInput from './NoteInput'
import { ApplicationProvider, Button, Layout, Text, Datepicker, Select, SelectItem, IndexPath } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { customTheme } from './CustomTheme'
import { NavigationType, routeProp } from './types'
import { ScrollView } from 'react-native-gesture-handler';
import { setBadData, getBadDataFiles } from '../scripts/APIRequests';
import PopupProp from './Popup';
import PopupProp2Button from './Popup2Button';

export default function BadData({ navigation }: NavigationType) {
    const route = useRoute<routeProp>();
    let site = route.params?.site;

    // these use states to set and store values in the text inputs
    const [oldIDValue, setOldIDValue] = useState("all");
    const [newIDValue, setNewIDValue] = useState("NA");
    const [startTimeValue, setStartTimeValue] = useState("");
    const [startDateValue, setStartDateValue] = useState<Date | null>(null);
    const [endTimeValue, setEndTimeValue] = useState("");
    const [endDateValue, setEndDateValue] = useState<Date | null>(null);
    const [nameValue, setNameValue] = useState("");
    const [reasonValue, setReasonValue] = useState("");
    const [selectedFileIndex, setSelectedFileIndex] = useState<IndexPath | undefined>(undefined);
    const [fileOptions, setFileOptions] = useState<string[]>([]);
    const [instrument, setInstrument] = useState("");

    useEffect(() => {
      const fetchBadDataFiles = async () => {
        try {
          const response = await getBadDataFiles(site);
          if (response.success) {
            setFileOptions(response.data || []); // Set the file names as options
          } else {
            alert(`Error fetching files: ${response.error}`);
          }
        } catch (error) {
          console.error("Error fetching bad data files:", error);
        }
      };
  
      fetchBadDataFiles();
    }, [site]);
  

    // Function to format the date
    const formatDate = (date: Date | null): string => {
      return date ? date.toISOString().split("T")[0] : "";
    };

    const validateTime = (time: string) => {
      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
      return timeRegex.test(time); // Returns true if the time matches HH:MM:SS format
    };

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

    const buildBadDataString = (): string => {
      const currentTime = getCurrentUtcDateTime()
      return `${formatDate(startDateValue)}T${startTimeValue}Z,${formatDate(endDateValue)}T${endTimeValue}Z,${oldIDValue},${newIDValue},${currentTime},${nameValue},${reasonValue}`;
    };

    const handleFileSelection = (index: IndexPath) => {
      setSelectedFileIndex(index);
      setInstrument(fileOptions[index.row]);
    };

    // used for determining if PUT request was successful
    // will set the success/fail notification to visible, aswell as the color and text
    const [visible, setVisible] = useState(false);
    const [messageColor, setMessageColor] = useState("");
    const [message, setMessage] = useState("");
    const [visible2, setVisible2] = useState(false);

    const handleSubmit = () => {
      if (
        !oldIDValue ||
        !newIDValue ||
        !startDateValue ||
        !startTimeValue ||
        !endTimeValue ||
        !nameValue ||
        !reasonValue ||
        !instrument
      ) {
        //alert("Please fill out all fields before submitting.");
        setMessage("Please fill out all fields before submitting.");
        setMessageColor(customTheme['color-danger-700']);
        setVisible(true);
        return;
      }
      if (
        !validateTime(startTimeValue) || 
        !validateTime(endTimeValue)) {
          //alert("Please make sure time entries follow the HH:MM:SS format");
          setMessage("Please make sure time entries follow the HH:MM:SS format.");
          setMessageColor(customTheme['color-danger-700']);
          setVisible(true);
          return;
        }
      handleUpdate();
    };

    const handleUpdate = async () => {
      const badDataString = buildBadDataString();
      const result = await setBadData(site, instrument, badDataString, `Update ${instrument}.csv`);
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
        <ApplicationProvider {...eva} theme={customTheme}>
          <ScrollView>
            <Layout style={styles.container} level='1'>

              {/* header */}
              <Text category='h1' style={{textAlign: 'center'}}>{site}</Text>

              {/* success/failure popup */}
              <PopupProp popupText={message} 
                popupColor={messageColor} 
                onPress={setVisible} 
                visible={visible}/>
              
              {/* text inputs */}
              {/* select instrument */}
              <Select
                label = "Instrument"
                selectedIndex={selectedFileIndex}
                onSelect={(index) => handleFileSelection(index as IndexPath)}
                placeholder="Choose an instrument"
                style={styles.textInput}
                value={
                  selectedFileIndex !== undefined
                  ? fileOptions[selectedFileIndex.row] // Display the selected file
                  : undefined
                }>
              {fileOptions.map((file, index) => (
                <SelectItem key={index} title={file} />
              ))}
              </Select>

              {/* old id input */}
              <TextInput labelText='Old ID' 
                labelValue={oldIDValue} 
                onTextChange={setOldIDValue} 
                placeholder='123456' 
                style={styles.textInput}/>
              
              {/* new id input */}
              <TextInput labelText='New ID' 
                labelValue={newIDValue} 
                onTextChange={setNewIDValue} 
                placeholder='67890' 
                style={styles.textInput}/>

              {/* start date input */}
              <Datepicker
                label='Start Date'
                date={startDateValue}
                onSelect={(date) => setStartDateValue(date as Date)}
                min={new Date(1900, 0, 1)}
                max={new Date(2500, 12, 31)}
                placeholder="Start Date"
                style={styles.textInput}/>

              {/* start time input */}
              <TextInput labelText='Start Time' 
                labelValue={startTimeValue}
                onTextChange={setStartTimeValue} 
                placeholder='12:00:00' 
                style={styles.textInput}/>

              {/* end date input */}
              <Datepicker
                label='End Date'
                date={endDateValue}
                onSelect={(date) => setEndDateValue(date as Date)}
                min={new Date(1900, 0, 1)}
                max={new Date(2500, 12, 31)}
                placeholder="End Date"
                style={styles.textInput}/>

              {/* end time input */}
              <TextInput labelText='End Time' 
                labelValue={endTimeValue} 
                onTextChange={setEndTimeValue} 
                placeholder='12:00:00' 
                style={styles.textInput}/>

                  {/* Name input */}
                  <TextInput labelText='Name' 
                    labelValue={nameValue} 
                    onTextChange={setNameValue} 
                    placeholder='John Doe' 
                    style={styles.textInput}/>

                  {/* reason entry */}
                  <NoteInput labelText='Reason for Bad Data' 
                    labelValue={reasonValue} 
                    onTextChange={setReasonValue} 
                    placeholder='Its wack.' 
                    multiplelines={true} 
                    style={styles.reasonText}/>

              {/* submit button */}
              <Button
                onPress={handleSubmit}
                appearance='filled'
                status='primary'
                style={{margin: 15}}>
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
      justifyContent: 'flex-start',
    },
    reasonText: {
      flex: 4,
      margin: 6,
    },
    textInput: {
      margin: 6,
      flex: 1
    }
});