/**
 * Instrument Maintenance Page
 * @author David Schiwal and Blake Stambaugh
 * 12/5/24
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
import { getDirectory } from '../scripts/APIRequests';

export default function InstrumentMaintenance({ navigation }: NavigationType) {
    const route = useRoute<routeProp>();
    let site = route.params?.site;

    // used for setting and remembering the input values
    const [nameValue, setNameValue] = useState("");
    const [dateValue, setDateValue] = useState("");
    const [notesValue, setNotesValue] = useState("");
    const [instruments, setInstruments] = useState<string[]>([]);
    const [instrument, setInstrument] = useState("");

    // Use IndexPath for selected index for drop down menu
    const [selectedIndex, setSelectedIndex] = useState<IndexPath>(new IndexPath(0)); // Default to first item

    useEffect(() => {
          const fetchBadDataFiles = async () => {
            try {
              const response = await getDirectory(`instrument_maint/${site}`);
              if (response.success) {
                setInstruments(response.data || []); // Set the file names as options
              } else {
                alert(`Error fetching files: ${response.error}`);
              }
            } catch (error) {
              console.error("Error fetching bad data files:", error);
            }
          };
      
          fetchBadDataFiles();
        }, [site]);
    //const instruments = ['Instrument 1', 'Instrument 2', 'Instrument 3']

    return (
      <ApplicationProvider {...eva} theme={customTheme}>
        <Layout style={styles.container} level="1">

          {/* header */}
          <Text category="h1" style={{ textAlign: "center" }}>
            {site}
          </Text>

          {/* drop down menu for instruments */}
          <Select
            label="Instrument"
            selectedIndex={selectedIndex}
            onSelect={(index) => setSelectedIndex(index as IndexPath)}
            value={instruments[selectedIndex.row]}
            style={{ margin: 15, flex: 1 }}
          >
            {instruments.map((file, index) => (
                <SelectItem key={index} title={file} />
            ))}
          </Select>

          {/* text inputs */}
          {/* Time input */}
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
            onPress={() => alert("submitted request!")}
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