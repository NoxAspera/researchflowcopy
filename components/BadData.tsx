/**
 * Bad Data Page
 * @author David Schiwal, Blake Stambaugh
 * 12/5/24
 * 
 * This page allows the user to mark data as bad. They will enter in
 * a date range, the data, and why it is bad. The code will format and
 * submit that request to the github repo.
 */
import { StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { NaviProp } from './types';
import TextInput from './TextInput'
import { ApplicationProvider, Button, Layout, Text } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { customTheme } from './CustomTheme'
import { NavigationType, routeProp } from './types'

export default function BadData({ navigation }: NavigationType) {
    const route = useRoute<routeProp>();
    let site = route.params?.site;

    // these use states to set and store values in the text inputs
    const [oldIDValue, setOldIDValue] = useState("");
    const [newIDValue, setNewIDValue] = useState("");
    const [startTimeValue, setStartTimeValue] = useState("");
    const [endTimeValue, setEndTimeValue] = useState("");
    const [nameValue, setNameValue] = useState("");
    const [entryTimeValue, setEntryTimeValue] = useState("");
    const [reasonValue, setReasonValue] = useState("");

    return (
      <ApplicationProvider {...eva} theme={customTheme}>
        <Layout style={styles.container} level='1'>

          {/* header */}
          <Text category='h1' style={{textAlign: 'center'}}>{site}</Text>
          
          {/* text inputs */}
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

          {/* start time input */}
          <TextInput labelText='Start Time' 
            labelValue={startTimeValue}
            onTextChange={setStartTimeValue} 
            placeholder='12:00 PM' 
            style={styles.textInput}/>

          {/* end time input */}
          <TextInput labelText='End Time' 
            labelValue={endTimeValue} 
            onTextChange={setEndTimeValue} 
            placeholder='12:00 AM' 
            style={styles.textInput}/>

          {/* Name input */}
          <TextInput labelText='Name' 
            labelValue={nameValue} 
            onTextChange={setNameValue} 
            placeholder='John Doe' 
            style={styles.textInput}/>

          {/* time entry input */}
          <TextInput labelText='Time Entry' 
            labelValue={entryTimeValue} 
            onTextChange={setEntryTimeValue} 
            placeholder='12 hours' 
            style={styles.textInput}/>

          {/* reason entry */}
          <TextInput labelText='Reason for Bad Data' 
            labelValue={reasonValue} 
            onTextChange={setReasonValue} 
            placeholder='Its wack.' 
            multiplelines={true} 
            style={styles.reasonText}/>

          {/* submit button */}
          <Button
            onPress={() => alert('submitted bad data!')}
            appearance='filled'
            status='primary'
            style={{margin: 15}}>
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
    reasonText: {
      flex: 4,
      margin: 15,
    },
    textInput: {
      margin: 15,
      flex: 1
    }
});