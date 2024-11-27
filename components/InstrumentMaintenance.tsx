import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { ApplicationProvider, Button, IndexPath, Input, Layout, Select, SelectItem, Text } from '@ui-kitten/components';
import TextInput from './TextInput'
import * as eva from '@eva-design/eva';
import { default as theme } from '../custom-theme.json'

export default function InstrumentMaintenance({ navigation }) {
    const route = useRoute();
    let site = route.params?.site;

    // used for setting and remembering the input values
    const [nameValue, setNameValue] = useState("");
    const [dateValue, setDateValue] = useState("");
    const [notesValue, setNotesValue] = useState("");

    // Use IndexPath for selected index for drop down menu
    const [selectedIndex, setSelectedIndex] = useState<IndexPath>(new IndexPath(0)); // Default to first item
    const instruments = ['Instrument 1', 'Instrument 2', 'Instrument 3']

    //alert("found: " + instrument);
    return (
      <ApplicationProvider {...eva} theme={theme}>
        <Layout style={styles.container} level='1'>
          {/* header */}
          <Text category='h1' style={{textAlign: 'center'}}>{site}</Text>
          
          {/* drop down menu for instruments */}
          <Select label='Instrument'
            selectedIndex={selectedIndex}
            onSelect={(index) => setSelectedIndex(index as IndexPath)}
            value={instruments[selectedIndex.row]}>
            <SelectItem 
              title='Instrument 1'
            />
            <SelectItem 
              title='Instrument 2'
            />
            <SelectItem 
              title='Instrument 3'
            />
          </Select>

          {/* text inputs */}
          {/* Time input */}
          <TextInput labelText='Time' labelValue={dateValue} onTextChange={setDateValue} placeholder='12:00 PM' />

          {/* Name input */}
          <TextInput labelText='Name' labelValue={nameValue} onTextChange={setNameValue} placeholder='Jane Doe' />

          {/* notes entry */}
          <TextInput labelText='Request' labelValue={notesValue} onTextChange={setNotesValue} placeholder='Giving bad reading.' multiplelines={true}/>
          
          {/* submit button */}
          <Button
            onPress={() => alert('submitted request!')}
            appearance='filled'
            status='primary'>
            Submit
          </Button>
        </Layout>
      </ApplicationProvider>
      // <ScrollView style = {styles.scrollContainer}>
      //   <View style={styles.container}>
      //     {/* header */}
      //     <View style={styles.header}>
      //       <Text style={styles.headerText}>{instrument}</Text>
      //     </View>
      //     {/* drop down menu for instruments */}
      //     <View style={styles.rowContainer}>
      //       <Text style={styles.label}>Location:</Text>
      //       <Picker
      //           selectedValue={selectedValue}
      //           onValueChange={(itemValue: React.SetStateAction<string>) => setSelectedValue(itemValue)}
      //           style={styles.picker}
      //         >
      //           <Picker.Item label="CSP" value="CSP" />
      //           <Picker.Item label="DBK" value="DBK" />
      //           <Picker.Item label="FRU" value="FRU" />
      //           <Picker.Item label="HDP" value="HDP" />
      //           <Picker.Item label="HPL" value="HPL" />
      //           <Picker.Item label="RPK" value="RPK" />
      //           <Picker.Item label="SUG" value="SUG" />
      //           <Picker.Item label="WBB" value="WBB" />
      //       </Picker>
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
      //       <Text style = {styles.label}>Enter date: </Text>
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

      //     <Text style= {styles.label}>Notes:</Text>
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
      backgroundColor: '#fff',
      alignItems: 'stretch',        // has button fill space horizontally
      justifyContent: 'space-evenly',
    },
    scrollContainer: {
      backgroundColor: '#fff'
    },

    label: {
        margin: 15,
        marginBottom: 10,
        fontSize: 24,
        alignItems: 'flex-start'
      },
    picker: {
      height: 65,
      alignItems: 'flex-start',
      width: '64%',
      marginTop: 0,
      marginBottom: 0,
    },
    dropdownContainer: {
      marginTop: 50,
      alignItems: 'flex-start',
    },
    timeInput: {
      height: 40,
      margin: 10,
      width: 200,
      borderWidth: 1,
      padding: 10,
      marginBottom: 0,
    },
    timeInput2: {
      height: 40,
      margin: 15,
      marginTop: 0,
      marginBottom: 0,
      width: 200,
      borderWidth: 1,
      padding: 10,
    },
    areaInput: {
      height: 200,
      margin: 15,
      width: 380,
      borderWidth: 1,
      padding: 10,
      marginTop: 0,
      marginBottom: 0,
    },

    rowContainer:
    {
      flex: 1,
      backgroundColor: '#fff',
      flexDirection: 'row',
      alignItems: 'flex-start',        // has button fill space horizontally
      justifyContent: 'space-evenly',
    },
    homeButton: {
      flex: 1,                      // has button fill space vertically
      borderRadius: 10,
      justifyContent: 'center',     // this and alignItems places text in center of button
      alignItems: "center",
      margin: 10
    },
    homeButtonText: {
      flex: 1,
      fontSize: 30,
      margin: 0
    },
    header: {
      margin: 10,
      width: '100%', // Ensure the header takes full width
      alignItems: 'flex-start', // Center the text on the left
      marginBottom: 0, // Add space between the header and the buttons
    },
    headerText: {
      fontSize: 48,
      marginTop: 0,
    }
});