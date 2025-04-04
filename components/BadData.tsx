/**
 * Bad Data Page
 * @author David Schiwal, Blake Stambaugh, Megan Ostlie
 * Updated: 3/23/25 - DS
 *
 * This page allows the user to mark data as bad. They will enter in
 * a date range, the data, and why it is bad. The code will format and
 * submit that request to the github repo.
 */
import { StyleSheet, KeyboardAvoidingView} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useRoute } from "@react-navigation/native";
import TextInput from "./TextInput";
import NoteInput from "./NoteInput";
import { Button, Layout, Text, Datepicker, Select, SelectItem, IndexPath,} from "@ui-kitten/components";
import { customTheme } from "./CustomTheme";
import { NavigationType, routeProp } from "./types";
import { ScrollView } from "react-native-gesture-handler";
import { setBadData, getBadDataFiles } from "../scripts/APIRequests";
import PopupProp from "./Popup"
import { ThemeContext } from './ThemeContext';
import LoadingScreen from "./LoadingScreen";
import * as Network from 'expo-network'

export default function BadData({ navigation }: NavigationType) {
  const route = useRoute<routeProp>();
  let site = route.params?.site;
  const themeContext = React.useContext(ThemeContext);
  const isDarkMode = themeContext.theme === 'dark';

  // these use states to set and store values in the text inputs
  const [oldIDValue, setOldIDValue] = useState("all");
  const [newIDValue, setNewIDValue] = useState("NA");
  const [startTimeValue, setStartTimeValue] = useState("");
  const [startDateValue, setStartDateValue] = useState<Date | null>(null);
  const [startStatusValue, setStartStatusValue] = useState("basic");
  const [endTimeValue, setEndTimeValue] = useState("");
  const [endDateValue, setEndDateValue] = useState<Date | null>(null);
  const [endStatusValue, setEndStatusValue] = useState("basic");
  const [nameValue, setNameValue] = useState("");
  const [reasonValue, setReasonValue] = useState("");
  const [selectedFileIndex, setSelectedFileIndex] = useState<IndexPath | undefined>(undefined);
  const [fileOptions, setFileOptions] = useState<string[]>([]);
  const [instrument, setInstrument] = useState("");

  // used for loading screen
  const [loadingValue, setLoadingValue] = useState(false);

  //method to navigate home to send to popup so it can happen after dismiss button is clicked
  function navigateHome(nav:boolean){
    if(nav){
      navigation.navigate("Home")
    }
  }

  useEffect(() => {
    const fetchBadDataFiles = async () => {
      let check = await  Network.getNetworkStateAsync()
      if(check.isConnected)
      {
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
    const currentTime = getCurrentUtcDateTime();
    return `${formatDate(startDateValue)}T${startTimeValue}Z,${formatDate(
      endDateValue
    )}T${endTimeValue}Z,${oldIDValue},${newIDValue},${currentTime},${nameValue},${reasonValue}`;
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
  const [returnHome, retHome] = useState(false);
  const visibleRef = useRef(false);

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
      setMessageColor(customTheme["color-danger-700"]);
      setVisible(true);
      return;
    }
    if (!validateTime(startTimeValue) || !validateTime(endTimeValue)) {
      //alert("Please make sure time entries follow the HH:MM:SS format");
      setMessage("Please make sure time entries follow the HH:MM:SS format.");
      setMessageColor(customTheme["color-danger-700"]);
      setVisible(true);
      return;
    }
    handleUpdate();
  };

  const handleUpdate = async () => {
    // show loading screen
    setLoadingValue(true);

    const badDataString = buildBadDataString();
    const result = await setBadData(
      site,
      instrument,
      badDataString,
      `Update ${instrument}.csv`
    );

    // hide loading screen when we recieve results
    setLoadingValue(false);
    
    if (result.success) {
      setMessage("File updated successfully!");
      setMessageColor(customTheme["color-success-700"]);
      retHome(true);
    } else {
      setMessage(`Error: ${result.error}`);
      setMessageColor(customTheme["color-danger-700"]);
    }
    setTimeout(() => {
      setVisible(true);
      visibleRef.current = true;
    }, 100);
  };

  return (
    <KeyboardAvoidingView
      behavior = "padding"
      style={styles.container}
    >
      <ScrollView automaticallyAdjustKeyboardInsets={true} keyboardShouldPersistTaps='handled'>
        <Layout style={styles.container} level="1">
          {/* header */}
          <Text category="h1" style={{ textAlign: "center" }}>
            {site}
          </Text>

          {/* success/failure popup */}
          <PopupProp
            popupText={message}
            popupColor={messageColor}
            onPress={setVisible}
            navigateHome={navigateHome} 
            visible={visible}
            returnHome={returnHome}
          />

          {/* loading screen */}
          <LoadingScreen visible={loadingValue} />

          {/* text inputs */}
          {/* select instrument */}
          <Select
            label={evaProps => <Text {...evaProps} category="p2" style={{color: isDarkMode ? "white" : "black"}}>Instrument</Text>}
            selectedIndex={selectedFileIndex}
            onSelect={(index) => handleFileSelection(index as IndexPath)}
            placeholder="Choose an instrument"
            style={styles.textInput}
            value={
              selectedFileIndex !== undefined
                ? fileOptions[selectedFileIndex.row] // Display the selected file
                : undefined
            }
          >
            {fileOptions.map((file, index) => (
              <SelectItem key={index} title={file} />
            ))}
          </Select>

          {/* old id input */}
          <TextInput
            labelText="Old ID"
            labelValue={oldIDValue}
            onTextChange={setOldIDValue}
            placeholder="123456"
            style={styles.textInput}
          />

          {/* new id input */}
          <TextInput
            labelText="New ID"
            labelValue={newIDValue}
            onTextChange={setNewIDValue}
            placeholder="67890"
            style={styles.textInput}
          />

          {/* start date input */}
          <Datepicker
            label={evaProps => <Text {...evaProps} category="p2" style={{color: isDarkMode ? "white" : "black"}}>Start Date</Text>}
            date={startDateValue}
            //changing the status here works because the mapping.json file (researchflow\node_modules\@eva-design\eva\mapping.json)
            //has a different textColor in the primary field for Datepicker
            onSelect={(date) => {setStartDateValue(date as Date); setStartStatusValue("primary")}}
            min={new Date(1900, 0, 1)}
            max={new Date(2500, 12, 31)}
            placeholder="Start Date"
            style={styles.textInput}
            status={startStatusValue}
          />

          {/* start time input */}
          <TextInput
            labelText="Start Time"
            labelValue={startTimeValue}
            onTextChange={setStartTimeValue}
            placeholder="12:00:00"
            style={styles.textInput}
          />

          {/* end date input */}
          <Datepicker
            label={evaProps => <Text {...evaProps} category="p2" style={{color: isDarkMode ? "white" : "black"}}>End Date</Text>}
            date={endDateValue}
            //changing the status here works because the mapping.json file (researchflow\node_modules\@eva-design\eva\mapping.json)
            //has a different textColor in the primary field for Datepicker
            onSelect={(date) => {setEndDateValue(date as Date); setEndStatusValue("primary")}}
            min={new Date(1900, 0, 1)}
            max={new Date(2500, 12, 31)}
            placeholder="End Date"
            style={styles.textInput}
            status={endStatusValue}
          />

          {/* end time input */}
          <TextInput
            labelText="End Time"
            labelValue={endTimeValue}
            onTextChange={setEndTimeValue}
            placeholder="12:00:00"
            style={styles.textInput}
          />

          {/* Name input */}
          <TextInput
            labelText="Name"
            labelValue={nameValue}
            onTextChange={setNameValue}
            placeholder="First Last"
            style={styles.textInput}
          />

          {/* reason entry */}
          <NoteInput
            labelText="Reason for Bad Data"
            labelValue={reasonValue}
            onTextChange={setReasonValue}
            placeholder="Reason"
            multiplelines={true}
            style={styles.reasonText}
          />

          {/* submit button */}
          <Button
            onPress={handleSubmit}
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
    alignItems: "stretch", // has button fill space horizontally
    justifyContent: "flex-start",
  },
  reasonText: {
    flex: 4,
    margin: 6,
  },
  textInput: {
    margin: 6,
    flex: 1,
  },
  submitButton:{
    margin: 20, 
    backgroundColor: "#06b4e0",
  },
});
