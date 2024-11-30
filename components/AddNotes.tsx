import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { StackNavigationProp } from '@react-navigation/stack';
import AddNotesTextInput from './TextInput';
import { buildNotes, Entry } from '../scripts/Parsers';
import { NaviProp } from './types';
import TextInput from './TextInput'
import { ApplicationProvider, IndexPath, Input, Layout, Select, SelectItem, Button, Text } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { customTheme } from './CustomTheme'
import { setFile } from '../scripts/APIRequests';

type RouteParams = {
  site: string; 
  info: string; 
};


function checkValidNumber(entry:string)
{
  const anyNonNumber = /^(\d+)(\.\d+)?$/gm
 return anyNonNumber.test(entry)
}

export default function AddNotes({ navigation }: NaviProp) {
    type routeProp = RouteProp<{params: RouteParams}, 'params'>;
    const route = useRoute<routeProp>();
    //let site = route.params?.site;
    const { site, info } = route.params || {}

    // these use states to set and store values in the text inputs
    const [timeValue, setTimeValue] = useState("");
    const [nameValue, setNameValue] = useState("");
    const [ltsId, setLTSId] = useState("");
    const [ltsValue, setLTSValue] = useState("");
    const [ltsPressure, setLTSPressure] = useState("");
    const [lowId, setLowId] = useState("");
    const [lowValue, setLowValue] = useState("");
    const [lowPressure, setLowPressure] = useState("");
    const [midId, setmidId] = useState("");
    const [midValue, setmidValue] = useState("");
    const [midPressure, setmidPressure] = useState("");
    const [highId, setHighId] = useState("");
    const [highValue, setHighValue] = useState("");
    const [highPressure, setHighPressure] = useState("");
    const [n2Value, setN2Value] = useState("");
    const [notesValue, setNotesValue] = useState("");

    // Use IndexPath for selected index for drop down menu
    const [selectedIndex, setSelectedIndex] = useState<IndexPath>(new IndexPath(0)); // Default to first item
    const instruments = ['Instrument 1', 'Instrument 2', 'Instrument 3']

    //alert("found: " + site);
    return (
      <ApplicationProvider {...eva} theme={customTheme}>
        <ScrollView>
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
            <TextInput labelText='Name' labelValue={nameValue} onTextChange={setNameValue} placeholder='ResearchFlow' style={styles.inputText} />
            <TextInput labelText='Time' labelValue={timeValue} onTextChange={setTimeValue} placeholder='15:00' style={styles.inputText} />

            {/* N2 */}
            <TextInput labelText='N2' labelValue={n2Value} onTextChange={setN2Value} placeholder='Pressure' style={styles.inputText} />

            {/* LTS input */}
            <Layout style = {styles.rowContainer}>
              <TextInput labelText='LTS' labelValue={ltsId} onTextChange={setLTSId} placeholder='Tank ID' style={styles.tankInput} />
              <TextInput labelText=' ' labelValue={ltsValue} onTextChange={setLTSValue} placeholder='Value' style={styles.tankInput} />
              <TextInput labelText=' ' labelValue={ltsPressure} onTextChange={setLTSPressure} placeholder='Pressure' style={styles.tankInput} />
            </Layout>

            {/* Note for all tank inputs, the single space labels are there to make sure the other entry fields are alligned good*/}

            {/* Low input */}
            <Layout style = {styles.rowContainer}>
              <TextInput labelText='Low' labelValue={lowId} onTextChange={setLowId} placeholder='Tank ID' style={styles.tankInput} />
              <TextInput labelText=' ' labelValue={lowValue} onTextChange={setLowValue} placeholder='Value' style={styles.tankInput} />
              <TextInput labelText=' ' labelValue={lowPressure} onTextChange={setLowPressure} placeholder='Pressure' style={styles.tankInput} />
            </Layout>
            {/* mid input */}
            <Layout style = {styles.rowContainer}>
              <TextInput labelText='mid' labelValue={midId} onTextChange={setmidId} placeholder='Tank ID' style={styles.tankInput} />
              <TextInput labelText=' ' labelValue={midValue} onTextChange={setmidValue} placeholder='Value' style={styles.tankInput} />
              <TextInput labelText=' ' labelValue={midPressure} onTextChange={setmidPressure} placeholder='Pressure' style={styles.tankInput} />
            </Layout>
            {/* high input */} 
            <Layout style = {styles.rowContainer}>
              <TextInput labelText='High' labelValue={highId} onTextChange={setHighId} placeholder='Tank ID' style={styles.tankInput} />
              <TextInput labelText=' ' labelValue={highValue} onTextChange={setHighValue} placeholder='Value' style={styles.tankInput} />
              <TextInput labelText=' ' labelValue={highPressure} onTextChange={setHighPressure} placeholder='Pressure' style={styles.tankInput} />
            </Layout>
            {/* notes entry */}
            <TextInput labelText='Notes' labelValue={notesValue} onTextChange={setNotesValue} placeholder='All Good.' multiplelines={true} style={styles.notesInput}/>

            {/* submit button */}
            <Button
              onPress={() => 
              {
                const LTSignored: boolean = (ltsId == "" && ltsValue == "" && ltsPressure == "")
              //check if any fields that need to be filled are actually empty
                if(nameValue == "")
                {
                  alert("Please fill in the Name field")
                  return
                }
                if(timeValue == "")
                {
                  alert("Please enter a time")
                  return
                }
                if(n2Value != "" && (!checkValidNumber(n2Value)))
                {
                  alert("Please enter a valid N2 pressure")
                  return
                }
                if(!LTSignored && !checkValidNumber(ltsId))
                {
                  alert("Please enter a valid LTS ID")
                  return
                }
                if(!LTSignored && !checkValidNumber(ltsValue))
                {
                  alert("Please enter a valid LTS Value")
                  return
                }
                if(!LTSignored && !checkValidNumber(ltsPressure))
                {
                  alert("Please enter a valid LTS Pressure")
                  return
                }
                if(lowId != "" && !checkValidNumber(lowId))
                {
                  alert("Please enter a valid ID for the low tank")
                  return
                }
                if(!checkValidNumber(lowValue))
                {
                  alert("Please enter a valid value for the low tank")
                  return
                }
                if(!checkValidNumber(lowPressure))
                {
                  alert("Please enter a valid pressure for the low tank")
                  return
                }
                if(!checkValidNumber(midId))
                {
                  alert("Please enter a valid ID for the mid tank")
                  return
                }
                if(!checkValidNumber(midValue))
                {
                  alert("Please enter a valid value for the mid tank")
                  return
                }
                if(!checkValidNumber(midPressure))
                {
                  alert("Please enter a valid pressure for the mid tank")
                  return
                }
                if(!checkValidNumber(highId))
                {
                  alert("Please enter a valid ID for the high tank")
                  return
                }
                if(!checkValidNumber(highValue))
                {
                  alert("Please enter a valid value for the high tank")
                  return
                }
                if(!checkValidNumber(highPressure))
                {
                  alert("Please enter a valid pressure for the high tank")
                  return
                }

                const now = new Date();
                const year = now.getFullYear().toString()
                const month = (now.getMonth() + 1).toString() // now.getMonth() is zero-base (i.e. January is 0), likely due to something with Oracle's implementation - August
                const day = now.getDate().toString()
                const hours= now.getHours().toString()
                const minutes = now.getMinutes().toString()
                
                //not putting this in a seperate function is messy, but if we did, it would be worse - August
                const data: Entry = 
                {
                  time_in: `${year}-${month}-${day} ${timeValue}`,
                  time_out: `${year}-${month}-${day} ${hours}:${minutes}`,
                  names: nameValue,
                  instrument: instruments[selectedIndex.row] ? instruments[selectedIndex.row] : null,
                  n2_pressure: n2Value ? n2Value: null,
                  lts: LTSignored ? null:
                  {
                    id: ltsId,
                    value: ltsValue,
                    unit: "ppm",
                    pressure: ltsPressure
                  },
                  low_cal:
                  {
                    id:lowId,
                    value:lowValue,
                    unit:"ppm",
                    pressure: lowPressure
                  },
                  mid_cal:
                  {
                    id:midId,
                    value:midValue,
                    unit: "ppm",
                    pressure: midPressure
                  },
                  high_cal:
                  {
                    id:highId,
                    value:highValue,
                    unit: "ppm",
                    pressure: highPressure
                  },
                  additional_notes: notesValue 
                };
                setFile(site, buildNotes(data), "updating notes from researchFlow");
              }
            }
              appearance='filled'
              status='primary'
              style={{margin: 15}}>
              Submit
            </Button>
          </Layout>
        </ScrollView>
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
    tankInput: {
      flex: 1,
      margin: 15
    },
    notesInput:
    {
      flex: 1,
      margin: 15
    },
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
    //},
    areaInput: {
      height: 200,
      margin: 15,
      width: 380,
      borderWidth: 1,
      padding: 10,
      marginTop: 5,
      marginBottom: 5,
    },

    rowContainer:
    {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'stretch',        // has button fill space horizontally
      justifyContent: 'space-evenly',
    },
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