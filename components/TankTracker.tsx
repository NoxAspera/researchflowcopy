/**
 * Tank Tracker
 * @author Blake Stambaugh and David Schiwal
 * 12/5/24
 * 
 * This page is responsible for tracking tank statuses. Will look at previous
 * data and determine when it will most likely run out and need replacement.
 */
import { StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { ApplicationProvider, Button, IndexPath, Layout, Select, SelectItem, Text } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import TextInput from './TextInput'
import { customTheme } from './CustomTheme'
import { NavigationType, routeProp } from './types'
import { ScrollView } from 'react-native-gesture-handler';

export default function TankTracker({ navigation }: NavigationType) {
    const route = useRoute<routeProp>();
    let site = route.params?.site;

    // used for setting and remembering the input values
    const [nameValue, setNameValue] = useState("");
    const [dateValue, setDateValue] = useState("");
    const [PSIValue, setPSIValue] = useState("");
    const [CO2Value, setCO2Value] = useState("");
    const [CH4Value, setCH4Value] = useState("");
    const [notesValue, setNotesValue] = useState("");

    // Use IndexPath for selected index for drop down menu
    const [selectedIndex, setSelectedIndex] = useState<IndexPath>(new IndexPath(0)); // Default to first item
    const tanks = ['Tank 1', 'Tank 2', 'Tank 3']

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

              {/* drop down menu for tanks */}
              <Select
                label={evaProps => <Text {...evaProps} category="c1" style={{color: "white"}}>Tanks</Text>}
                selectedIndex={selectedIndex}
                onSelect={(index) => setSelectedIndex(index as IndexPath)}
                value={tanks[selectedIndex.row]}
                style={{ margin: 8, flex: 1 }}
              >
                <SelectItem title="Tank 1" />
                <SelectItem title="Tank 2" />
                <SelectItem title="Tank 3" />
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

              {/* tank measurements */}
              <Text category="h3" style={{ textAlign: "center", paddingTop: 25 }}>
                Tank Measurements
              </Text>

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
                onPress={() => alert("submitted request!")}
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