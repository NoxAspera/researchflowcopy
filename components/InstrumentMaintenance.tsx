/**
 * Instrument Maintenance Page
 * @author David Schiwal and Blake Stambaugh
 * 12/5/24
 * 
 * This is the page for instrument maintenance. It will take in the user input, format
 * it, and send it to the github repo.
 */
import { StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { ApplicationProvider, Button, IndexPath, Layout, Select, SelectItem, Text } from '@ui-kitten/components';
import TextInput from './TextInput'
import NoteInput from './NoteInput'
import * as eva from '@eva-design/eva';
import { customTheme } from './CustomTheme'
import { NavigationType, routeProp } from './types'
import { ScrollView } from 'react-native-gesture-handler';

export default function InstrumentMaintenance({ navigation }: NavigationType) {
    const route = useRoute<routeProp>();
    let site = route.params?.site;

    // used for setting and remembering the input values
    const [nameValue, setNameValue] = useState("");
    const [dateValue, setDateValue] = useState("");
    const [notesValue, setNotesValue] = useState("");

    // Use IndexPath for selected index for drop down menu
    const [selectedIndex, setSelectedIndex] = useState<IndexPath>(new IndexPath(0)); // Default to first item
    const instruments = ['Instrument 1', 'Instrument 2', 'Instrument 3']

    return (
      <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.container}>
        <ApplicationProvider {...eva} theme={customTheme}>
          <ScrollView>
            <Layout style={styles.container} level="1">

              {/* header */}
              <Text category="h1" style={{ textAlign: "center" }}>
                {site}
              </Text>

              {/* drop down menu for instruments */}
              <Select 
                label={evaProps => <Text {...evaProps} category="c1" style={{color: "white"}}>Instrument</Text>}
                selectedIndex={selectedIndex}
                onSelect={(index) => setSelectedIndex(index as IndexPath)}
                value={instruments[selectedIndex.row]}
                style={{ margin: 15, flex: 1 }}
              >
                <SelectItem title="Instrument 1" />
                <SelectItem title="Instrument 2" />
                <SelectItem title="Instrument 3" />
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
                onPress={() => alert("submitted request!")}
                appearance="filled"
                status="primary"
                style={{ margin: 15 }}
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
      justifyContent: 'flex-start',
    },
    requestText: {
      flex: 1,
      margin: 15
    },
    textInput: {
      flex: 1,
      margin: 15
    }
});