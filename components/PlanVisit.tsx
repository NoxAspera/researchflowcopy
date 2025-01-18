/**
 * Tank Tracker
 * @author Blake Stambaugh and David Schiwal
 * 12/5/24
 * 
 * This page is responsible for planning visits.
 */
import { StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { ApplicationProvider, Button, IndexPath, Layout, Datepicker, Select, SelectItem, Text } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import TextInput from './TextInput'
import { customTheme } from './CustomTheme'
import { NavigationType, routeProp } from './types'
import { ScrollView } from 'react-native-gesture-handler';

export default function PlanVisit({ navigation }: NavigationType) {
    const route = useRoute<routeProp>();
    let site = route.params?.site;

    // used for setting and remembering the input values
    const [nameValue, setNameValue] = useState("");
    const [dateValue, setDateValue] = useState<Date | null>(null);
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

              {/* start date input */}
              <Datepicker
                label='Visit Date'
                date={dateValue}
                onSelect={(date) => setDateValue(date as Date)}
                min={new Date(1900, 0, 1)}
                max={new Date(2500, 12, 31)}
                placeholder="Visit Date"
                style={styles.textInput}/>


              {/* Name input */}
              <TextInput
                labelText="Name"
                labelValue={nameValue}
                onTextChange={setNameValue}
                placeholder="Jane Doe"
                style={styles.textInput}
              />
              {/* list of items entry */}
              <TextInput
                labelText="Items to bring"
                labelValue={notesValue}
                onTextChange={setNotesValue}
                placeholder="Instrument 1"
                style={styles.reasonText}
              />

              {/* notes entry */}
              <TextInput
                labelText="Additional Notes"
                labelValue={notesValue}
                onTextChange={setNotesValue}
                placeholder="Make sure to download previous site docs"
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