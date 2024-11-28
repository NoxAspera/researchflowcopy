import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { StackNavigationProp } from '@react-navigation/stack';
import AddNotesTextInput from './TextInput';
import { NaviProp } from './types';
import TextInput from './TextInput'
import { ApplicationProvider, IndexPath, Input, Layout, Select, SelectItem, Button, Text } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { customTheme } from './CustomTheme'

type RouteParams = {
  site: string; 
  info: string; 
};

export default function AddNotes({ navigation }: NaviProp) {
    type routeProp = RouteProp<{params: RouteParams}, 'params'>;
    const route = useRoute<routeProp>();
    //let site = route.params?.site;
    const { site, info } = route.params || {}

    //console.log("Info parameter:", info);

    const entry = info?.entries[0] || {};
    const instrument = entry.instrument || 'No instrument associated with this site. Please provide instrument type and serial number.';
    const n2 = entry.n2_pressure || '';
    let low_tank = '';
    let mid_tank = '';
    let high_tank = '';
    let lts = '';
    if (entry.low_cal) {
      low_tank = entry.low_cal.id || '';
    }
    if (entry.mid_cal) {
      mid_tank = entry.mid_cal.id || '';
    }
    if (entry.high_cal) {
      high_tank = entry.high_cal.id || '';
    }
    if (entry.lts) {
      lts = entry.lts.id || '';
    }

    // these use states to set and store values in the text inputs
    const [timeValue, setTimeValue] = useState("");
    const [lowValue, setLowValue] = useState("");
    const [medValue, setMedValue] = useState("");
    const [highValue, setHighValue] = useState("");
    const [n2Value, setN2Value] = useState("");
    const [notesValue, setNotesValue] = useState("");

    // Use IndexPath for selected index for drop down menu
    const [selectedIndex, setSelectedIndex] = useState<IndexPath>(new IndexPath(0)); // Default to first item
    const instruments = ['Instrument 1', 'Instrument 2', 'Instrument 3']

    //alert("found: " + site);
    return (
      <ApplicationProvider {...eva} theme={customTheme}>
        <Layout style={styles.container}>
          {/* header */}
          <Text category='h1' style={{textAlign: 'center'}}>{site}</Text>
          
          {/* drop down menu for instruments */}
          <Select label='Instrument'
            selectedIndex={selectedIndex}
            onSelect={(index) => setSelectedIndex(index as IndexPath)}
            value={instruments[selectedIndex.row]}
            style={{margin: 15, flex: 1}}>
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
          <TextInput labelText='Time' labelValue={timeValue} onTextChange={setTimeValue} placeholder='12:00 PM' style={styles.inputText} />

          {/* N2 */}
          <TextInput labelText='N2' labelValue={n2Value} onTextChange={setN2Value} placeholder='Level' style={styles.inputText} />

          {/* Low input */}
          <TextInput labelText='Low' labelValue={lowValue} onTextChange={setLowValue} placeholder='Level' style={styles.inputText} />

          {/* mid input */}
          <TextInput labelText='Mid' labelValue={medValue} onTextChange={setMedValue} placeholder='Level' style={styles.inputText} />

          {/* high input */}
          <TextInput labelText='High' labelValue={highValue} onTextChange={setHighValue} placeholder='Level' style={styles.inputText} />

          {/* notes entry */}
          <TextInput labelText='Notes' labelValue={notesValue} onTextChange={setNotesValue} placeholder='All Good.' multiplelines={true} style={styles.notesInput}/>

          {/* submit button */}
          <Button
            onPress={() => alert('submitted notes!')}
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
    
      //     {/* drop down menu for instruments */}
      //     <View style={styles.rowContainer}>
      //       <Text style={styles.label}>instrument</Text>
      //       <Picker
      //           selectedValue={selectedValue}
      //           onValueChange={(itemValue: React.SetStateAction<string>) => setSelectedValue(itemValue)}
      //           style={styles.picker}
      //         >
      //           <Picker.Item label={instrument} value={instrument} />
      //       </Picker>
      //     </View>
          
      //     {/* <View style = {styles.rowContainer}>
      //       <Text style = {styles.label}>Time Started:</Text>
      //       <SafeAreaProvider>
      //         <SafeAreaView>
      //           <TextInput
      //             style = {styles.timeInput}>
      //           </TextInput>
      //         </SafeAreaView>
      //       </SafeAreaProvider>
      //     </View> */}
      //     <AddNotesTextInput inputText='Time Started:' inputTextStyle={styles.timeInput} ViewStyle={styles.rowContainer} />

      //     {n2 !== '' && (
      //       // <View style={styles.rowContainer}>
      //       //   <Text style={styles.label}>N2:</Text>
      //       //   <SafeAreaProvider>
      //       //     <SafeAreaView>
      //       //       <TextInput
      //       //         style={styles.timeInput}>
      //       //       </TextInput>
      //       //     </SafeAreaView>
      //       //   </SafeAreaProvider>
      //       // </View>
      //       <AddNotesTextInput inputText='N2:' inputTextStyle={styles.timeInput} ViewStyle={styles.rowContainer} />
      //     )}

      //     {low_tank !== '' && (
      //       // <View style={styles.rowContainer}>
      //       //   <Text style={styles.label}>Low: {low_tank}</Text>
      //       //   <SafeAreaProvider>
      //       //     <SafeAreaView>
      //       //       <TextInput
      //       //         style={styles.timeInput}>
      //       //       </TextInput>
      //       //     </SafeAreaView>
      //       //   </SafeAreaProvider>
      //       // </View>
      //       <AddNotesTextInput inputText='Low: ' inputTextStyle={styles.timeInput} ViewStyle={styles.rowContainer} inputTextVar={low_tank} />
      //     )}

      //     {mid_tank !== '' && (
      //       // <View style={styles.rowContainer}>
      //       //   <Text style={styles.label}>Mid: {mid_tank}</Text>
      //       //   <SafeAreaProvider>
      //       //     <SafeAreaView>
      //       //       <TextInput
      //       //         style={styles.timeInput}>
      //       //       </TextInput>
      //       //     </SafeAreaView>
      //       //   </SafeAreaProvider>
      //       // </View>
      //       <AddNotesTextInput inputText='Mid: ' inputTextStyle={styles.timeInput} ViewStyle={styles.rowContainer} inputTextVar={mid_tank} />
      //     )}

      //     {high_tank !== '' && (
      //       // <View style={styles.rowContainer}>
      //       //   <Text style={styles.label}>High: {high_tank}</Text>
      //       //   <SafeAreaProvider>
      //       //     <SafeAreaView>
      //       //       <TextInput
      //       //         style={styles.timeInput}>
      //       //       </TextInput>
      //       //     </SafeAreaView>
      //       //   </SafeAreaProvider>
      //       // </View>
      //       <AddNotesTextInput inputText='High: ' inputTextStyle={styles.timeInput} ViewStyle={styles.rowContainer} inputTextVar={high_tank} />
      //     )}

      //     {lts !== '' && (
      //       // <View style={styles.rowContainer}>
      //       //   <Text style={styles.label}>LTS: {lts}</Text>
      //       //   <SafeAreaProvider>
      //       //     <SafeAreaView>
      //       //       <TextInput
      //       //         style={styles.timeInput}>
      //       //       </TextInput>
      //       //     </SafeAreaView>
      //       //   </SafeAreaProvider>
      //       // </View>
      //       <AddNotesTextInput inputText='LTS: ' inputTextStyle={styles.timeInput} ViewStyle={styles.rowContainer} inputTextVar={lts} />
      //     )}



      //     {/* <Text style= {styles.label}>Site Notes</Text>
      //     <SafeAreaProvider>
      //       <SafeAreaView>
      //         <TextInput
      //           style = {styles.areaInput}>
      //         </TextInput>
      //       </SafeAreaView>
      //     </SafeAreaProvider> */}
      //     <AddNotesTextInput inputText='Site Notes' inputTextStyle={styles.areaInput} ViewStyle={styles.rowContainer} />

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
      justifyContent: 'space-evenly',
    },
    inputText: {
      flex: 1,
      margin: 15
    },
    notesInput: {
      flex: 4,
      margin: 15
    }
    // scrollContainer: {
    //   backgroundColor: '#fff'
    // },
    // label: {
    //     margin: 15,
    //     fontSize: 24,
    //     alignItems: 'flex-start'
    // },
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
    // },
    // areaInput: {
    //   height: 200,
    //   margin: 15,
    //   width: 380,
    //   borderWidth: 1,
    //   padding: 10,
    //   marginTop: 5,
    //   marginBottom: 5,
    // },

    // rowContainer:
    // {
    //   flex: 1,
    //   backgroundColor: '#fff',
    //   flexDirection: 'row',
    //   alignItems: 'flex-start',        // has button fill space horizontally
    //   justifyContent: 'space-evenly',
    // },
    // submitButton: {
    //   paddingLeft: 10,
    //   justifyContent: 'center',     // this and alignItems places text in center of button
    //   alignItems: "center"
    // },
    // homeButtonText: {
    //   flex: 1,
    //   fontSize: 30
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