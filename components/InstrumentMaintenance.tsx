/**
 * Instrument Maintenance Page
 * @author David Schiwal, Blake Stambaugh, Megan Ostlie
 * Updated: 1/14/25
 * 
 * This is the page for instrument maintenance. It will take in the user input, format
 * it, and send it to the github repo.
 */
import { StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import { ApplicationProvider, Button, IndexPath, Layout, Select, SelectItem, Text } from '@ui-kitten/components';
import TextInput from './TextInput'
import * as eva from '@eva-design/eva';
import { customTheme } from './CustomTheme'
import { NavigationType, routeProp } from './types'
import PopupProp from './Popup';
import { getDirectory, setInstrumentFile, getInstrumentSite } from '../scripts/APIRequests';

export default function InstrumentMaintenance({ navigation }: NavigationType) {
    const route = useRoute<routeProp>();
    let site = route.params?.site;
    let instrumentName = site.slice(site.lastIndexOf("/") + 1);

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

    useEffect(() => {
      const fetchSite = async () => {
        if (site.includes("LGR")) {
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
      let result:string = "---\n"

      result += `- Time in: ${dateValue}Z\n`;
      result += `- Name: ${nameValue}Z\n`;
      result += `- Notes: ${notesValue}Z\n`;
      
      return result;
    };
    
    const handleSubmit = () => {
      if (!nameValue || !dateValue || !notesValue) {
        setMessage("Please fill out all fields before submitting.");
        setMessageColor(customTheme['color-danger-700']);
        setVisible(true);
        return;
      }
      handleUpdate();
    }

    const handleUpdate = async () => {
      const instrumentNotes = buildInstrumentNotes();
      const result = await setInstrumentFile(site, instrumentNotes, `Update ${instrumentName}.md`, site.includes("LGR"), siteValue);
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
      <ApplicationProvider {...eva} theme={customTheme}>
        <Layout style={styles.container} level="1">

          {/* success/failure popup */}
          <PopupProp popupText={message} 
            popupColor={messageColor} 
            onPress={setVisible} 
            visible={visible}/>

          {/* header */}
          <Text category="h1" style={{ textAlign: "center" }}>
            {instrumentName}
          </Text>

          {/* text inputs */}
          {/* Time input */}
          {siteValue && (
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
            placeholder="12:00 PM"
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
          <TextInput
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
            style={{ margin: 15 }}
          >
            Submit
          </Button>
        </Layout>
      </ApplicationProvider>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'stretch',        // has button fill space horizontally
      justifyContent: 'flex-start',
    },
    requestText: {
      flex: 6,
      margin: 15
    },
    textInput: {
      flex: 1,
      margin: 15
    }
});