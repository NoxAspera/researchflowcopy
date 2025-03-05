/**
 * Instrument Maintenance Page
 * @author David Schiwal, Blake Stambaugh, Megan Ostlie
 * Updated: 1/14/25
 *
 * This is the page for instrument maintenance. It will take in the user input, format
 * it, and send it to the github repo.
 */
import { StyleSheet, KeyboardAvoidingView } from "react-native";
import React, { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import { Button, Layout, Text } from "@ui-kitten/components";
import TextInput from "./TextInput";
import NoteInput from "./NoteInput";
import { customTheme } from "./CustomTheme";
import { NavigationType, routeProp } from "./types";
import {setInstrumentFile, getInstrumentSite} from "../scripts/APIRequests";
import { ScrollView } from "react-native-gesture-handler";
import PopupProp from './Popup';
import Network from 'expo-network'

export default function InstrumentMaintenance({ navigation }: NavigationType) {
  const route = useRoute<routeProp>();
  let site = route.params?.site ?? "";
  let instrumentName = site.slice(site.lastIndexOf("/") + 1);
  let needsLocation = site.includes("LGR");

  // used for setting and remembering the input values
  const [nameValue, setNameValue] = useState("");
  const [dateValue, setDateValue] = useState("");
  const [notesValue, setNotesValue] = useState("");
  const [siteValue, setSiteValue] = useState("");

  // used for determining if PUT request was successful
  // will set the success/fail notification to visible, aswell as the color and text
  const [visible, setVisible] = useState(false);
  const [messageColor, setMessageColor] = useState("");
  const [message, setMessage] = useState("");
  const [returnHome, retHome] = useState(false);

  useEffect(() => {
    const fetchSite = async () => {
      let check = await Network.useNetworkState()
      if (site.includes("LGR") && check.isConnected) {
        try {
          const response = await getInstrumentSite(site);
          if (response.success) {
            setSiteValue(response.data || ""); // Set the file names as options
          } else {
            alert(`Error fetching site: ${response.error}`);
          }
        } catch (error) {
          console.error("Error fetching instrument site:", error);
        }
      }
    };
    fetchSite();
  }, [site]);

  const buildInstrumentNotes = (): string => {
    const now = new Date();
    const year = now.getFullYear().toString()
    const month = (now.getMonth() + 1).toString() // now.getMonth() is zero-base (i.e. January is 0), likely due to something with Oracle's implementation - August
    const day = now.getDate().toString()
    const hours= now.getHours().toString()
    const minutes = now.getMinutes().toString()

    let result: string = `- Time in: ${year}-${month}-${day} ${dateValue}\n`;

    result += `- Name: ${nameValue}\n`;
    result += `- Notes: ${notesValue}\n`;
    result += "---\n";

    return result;
  };

  const handleSubmit = () => {
    if (
      !nameValue ||
      !dateValue ||
      !notesValue ||
      (needsLocation && !siteValue.trim())
    ) {
      setMessage("Please fill out all fields before submitting.");
      setMessageColor(customTheme["color-danger-700"]);
      setVisible(true);
      return;
    }
    handleUpdate();
  };

  const handleUpdate = async () => {
    const instrumentNotes = buildInstrumentNotes();
    const result = await setInstrumentFile(
      site,
      instrumentNotes,
      `Update ${instrumentName}.md`,
      needsLocation,
      siteValue
    );
    if (result.success) {
      setMessage("File updated successfully!");
      setMessageColor(customTheme["color-success-700"]);
      retHome(true);
    } else {
      setMessage(`Error: ${result.error}`);
      setMessageColor(customTheme["color-danger-700"]);
    }
    setVisible(true);
  };

  //method to navigate home to send to popup so it can happen after dismiss button is clicked
  function navigateHome(nav:boolean){
    if(nav){
      navigation.navigate("Home")
    }
  }

  return (
    <KeyboardAvoidingView
      behavior = "padding"
      style={styles.container}
    >
      <ScrollView automaticallyAdjustKeyboardInsets={true} keyboardShouldPersistTaps='handled'>
        <Layout style={styles.container} level="1">
          {/* header */}
          <Text category="h1" style={{ textAlign: "center" }}>
            {instrumentName}
          </Text>

          {/* text inputs */}
          {/* success/failure popup */}
          <PopupProp popupText={message} 
            popupColor={messageColor} 
            onPress={setVisible} 
            navigateHome={navigateHome} 
            visible={visible}
            returnHome={returnHome}/>
            
          {/* Time input */}
          {needsLocation && (
            <TextInput
              labelText="Location"
              labelValue={siteValue}
              onTextChange={setSiteValue}
              placeholder="Enter site"
              style={styles.textInput}
            />
          )}
          <TextInput
            labelText="Time"
            labelValue={dateValue}
            onTextChange={setDateValue}
            placeholder="17:00"
            style={styles.textInput}
          />

          {/* Name input */}
          <TextInput
            labelText="Name"
            labelValue={nameValue}
            onTextChange={setNameValue}
            placeholder="Jane Doe"
            style={styles.textInput}
          />

          {/* notes entry */}
          <NoteInput
            labelText="Request"
            labelValue={notesValue}
            onTextChange={setNotesValue}
            placeholder="Giving bad reading."
            multiplelines={true}
            style={styles.requestText}
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
    alignItems: "stretch", // has button fill space horizontally
    justifyContent: "flex-start",
  },
  requestText: {
    flex: 1,
    margin: 15,
  },
  textInput: {
    flex: 1,
    margin: 15,
  },
  submitButton:{
    margin: 20, 
    backgroundColor: "#06b4e0",
  },
});
