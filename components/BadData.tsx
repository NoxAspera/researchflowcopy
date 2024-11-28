import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { NaviProp } from './types';
import TextInput from './TextInput'
import { ApplicationProvider, Button, Input, Layout, Text } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { customTheme } from './CustomTheme'


export default function BadData({ navigation }: NaviProp) {
    const route = useRoute();
    let site = route.params?.site;
    const [selectedValue, setSelectedValue] = useState("");

    // these use states to set and store values in the text inputs
    const [oldIDValue, setOldIDValue] = useState("");
    const [newIDValue, setNewIDValue] = useState("");
    const [startTimeValue, setStartTimeValue] = useState("");
    const [endTimeValue, setEndTimeValue] = useState("");
    const [nameValue, setNameValue] = useState("");
    const [entryTimeValue, setEntryTimeValue] = useState("");
    const [reasonValue, setReasonValue] = useState("");

    //alert("found: " + site);
    return (
      <ApplicationProvider {...eva} theme={customTheme}>
        <Layout style={styles.container} level='1'>
          {/* header */}
          <Text category='h1' style={{textAlign: 'center'}}>{site}</Text>
          
          {/* text inputs */}
          {/* old id input */}
          <TextInput labelText='Old ID' labelValue={oldIDValue} onTextChange={setOldIDValue} placeholder='123456' style={styles.textInput}/>
          
          {/* new id input */}
          <TextInput labelText='New ID' labelValue={newIDValue} onTextChange={setNewIDValue} placeholder='67890' style={styles.textInput}/>

          {/* start time input */}
          <TextInput labelText='Start Time' labelValue={startTimeValue} onTextChange={setStartTimeValue} placeholder='12:00 PM' style={styles.textInput}/>

          {/* end time input */}
          <TextInput labelText='End Time' labelValue={endTimeValue} onTextChange={setEndTimeValue} placeholder='12:00 AM' style={styles.textInput}/>

          {/* Name input */}
          <TextInput labelText='Name' labelValue={nameValue} onTextChange={setNameValue} placeholder='John Doe' style={styles.textInput}/>

          {/* time entry input */}
          <TextInput labelText='Time Entry' labelValue={entryTimeValue} onTextChange={setEntryTimeValue} placeholder='12 hours' style={styles.textInput}/>

          {/* reason entry */}
          <TextInput labelText='Reason for Bad Data' labelValue={reasonValue} onTextChange={setReasonValue} placeholder='Its wack.' multiplelines={true} style={styles.reasonText}/>

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
      // <ScrollView style = {styles.scrollContainer}>
      //   <View style={styles.container}>
      //     {/* header */}
      //     <View style={styles.header}>
      //       <Text style={styles.headerText}>{site}</Text>
      //     </View>

      //     <View style = {styles.rowContainer}>
      //       <Text style = {styles.label}>ID Old:</Text>
      //       <SafeAreaProvider>
      //         <SafeAreaView>
      //           <TextInput
      //             style = {styles.timeInput}>
      //           </TextInput>
      //         </SafeAreaView>
      //       </SafeAreaProvider>
      //     </View>

      //     <View style = {styles.rowContainer}>
      //       <Text style = {styles.label}>ID New:  </Text>
      //       <SafeAreaProvider>
      //         <SafeAreaView>
      //           <TextInput
      //             style = {styles.timeInput}>
      //           </TextInput>
      //         </SafeAreaView>
      //       </SafeAreaProvider>
      //     </View>

      //     <View style = {styles.rowContainer}>
      //       <Text style = {styles.label}>Time Start:</Text>
      //       <SafeAreaProvider>
      //         <SafeAreaView>
      //           <TextInput
      //             style = {styles.timeInput}>
      //           </TextInput>
      //         </SafeAreaView>
      //       </SafeAreaProvider>
      //     </View>

      //     <View style = {styles.rowContainer}>
      //       <Text style = {styles.label}>Time End:  </Text>
      //       <SafeAreaProvider>
      //         <SafeAreaView>
      //           <TextInput
      //             style = {styles.timeInput}>
      //           </TextInput>
      //         </SafeAreaView>
      //       </SafeAreaProvider>
      //     </View>

      //     <View style = {styles.rowContainer}>
      //       <Text style = {styles.label}>Name: </Text>
      //       <SafeAreaProvider>
      //         <SafeAreaView>
      //           <TextInput
      //             style = {styles.timeInput}>
      //           </TextInput>
      //         </SafeAreaView>
      //       </SafeAreaProvider>
      //     </View>

      //     <View>
      //       <Text style = {styles.label}>Time entry added: </Text>
      //     </View>

      //     <View style = {styles.rowContainer}>
      //       <SafeAreaProvider>
      //         <SafeAreaView>
      //           <TextInput
      //             style = {styles.timeInput2}>
      //           </TextInput>
      //         </SafeAreaView>
      //       </SafeAreaProvider>
      //     </View>

      //     <Text style= {styles.label}>Why is the data bad:</Text>
      //     <SafeAreaProvider>
      //       <SafeAreaView>
      //         <TextInput
      //           style = {styles.areaInput}>
      //         </TextInput>
      //       </SafeAreaView>
      //     </SafeAreaProvider>

      //     <TouchableOpacity
      //       style={[styles.homeButton, {backgroundColor: 'red'}]}
      //       onPress={() => alert("Submit Button Pressed")} >
      //       <Text style={[styles.homeButtonText, {color: 'white'}]}>Submit!</Text>
      //     </TouchableOpacity>
      //   </View>
      // </ScrollView>
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
    // scrollContainer: {
    //   backgroundColor: '#fff'
    // },

    // label: {
    //     margin: 15,
    //     marginBottom: 10,
    //     fontSize: 24,
    //     alignItems: 'flex-start'
    //   },
    // picker: {
    //   height: 65,
    //   alignItems: 'flex-start',
    //   width: '64%',
    //   marginTop: 0,
    //   marginBottom: 0
    // },
    // dropdownContainer: {
    //   marginTop: 50,
    //   alignItems: 'flex-start',
    // },
    // timeInput: {
    //   height: 40,
    //   margin: 10,
    //   width: 200,
    //   borderWidth: 1,
    //   padding: 10,
    //   marginBottom: 0,
    // },
    // timeInput2: {
    //   height: 40,
    //   margin: 15,
    //   marginTop: 0,
    //   marginBottom: 0,
    //   width: 200,
    //   borderWidth: 1,
    //   padding: 10,
    // },
    // areaInput: {
    //   height: 200,
    //   margin: 15,
    //   width: 380,
    //   borderWidth: 1,
    //   padding: 10,
    //   marginTop: 0,
    //   marginBottom: 0,
    // },

    // rowContainer:
    // {
    //   flex: 1,
    //   backgroundColor: '#fff',
    //   flexDirection: 'row',
    //   alignItems: 'flex-start',        // has button fill space horizontally
    //   justifyContent: 'space-evenly',
    // },
    // homeButton: {
    //   flex: 1,                      // has button fill space vertically
    //   borderRadius: 10,
    //   justifyContent: 'center',     // this and alignItems places text in center of button
    //   alignItems: "center",
    //   margin: 10
    // },
    // homeButtonText: {
    //   flex: 1,
    //   fontSize: 30,
    //   margin: 0
    // },
    // header: {
    //   margin: 10,
    //   width: '100%', // Ensure the header takes full width
    //   alignItems: 'flex-start', // Center the text on the left
    //   marginBottom: 0, // Add space between the header and the buttons
    // },
    // headerText: {
    //   fontSize: 48,
    //   marginTop: 0,
    // }
});