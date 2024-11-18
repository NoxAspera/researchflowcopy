import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';

export default function AddNotes({ navigation }) {
    const route = useRoute();
    //let site = route.params?.site;
    const { site, info } = route.params || {}

    console.log("Info parameter:", info);

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

    const [selectedValue, setSelectedValue] = useState("");

    //alert("found: " + site);
    return (
      <ScrollView style = {styles.scrollContainer}>
        <View style={styles.container}>
          {/* header */}
          <View style={styles.header}>
            <Text style={styles.headerText}>{site}</Text>
          </View>
    
          {/* drop down menu for instruments */}
          <View style={styles.rowContainer}>
            <Text style={styles.label}>instrument</Text>
            <Picker
                selectedValue={selectedValue}
                onValueChange={(itemValue: React.SetStateAction<string>) => setSelectedValue(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label={instrument} value={instrument} />
            </Picker>
          </View>
          
          <View style = {styles.rowContainer}>
            <Text style = {styles.label}>Time Started:</Text>
            <SafeAreaProvider>
              <SafeAreaView>
                <TextInput
                  style = {styles.timeInput}>
                </TextInput>
              </SafeAreaView>
            </SafeAreaProvider>
          </View>

          {n2 !== '' && (
            <View style={styles.rowContainer}>
              <Text style={styles.label}>N2:</Text>
              <SafeAreaProvider>
                <SafeAreaView>
                  <TextInput
                    style={styles.timeInput}>
                  </TextInput>
                </SafeAreaView>
              </SafeAreaProvider>
            </View>
          )}

          {low_tank !== '' && (
            <View style={styles.rowContainer}>
              <Text style={styles.label}>Low: {low_tank}</Text>
              <SafeAreaProvider>
                <SafeAreaView>
                  <TextInput
                    style={styles.timeInput}>
                  </TextInput>
                </SafeAreaView>
              </SafeAreaProvider>
            </View>
          )}

          {mid_tank !== '' && (
            <View style={styles.rowContainer}>
              <Text style={styles.label}>Mid: {mid_tank}</Text>
              <SafeAreaProvider>
                <SafeAreaView>
                  <TextInput
                    style={styles.timeInput}>
                  </TextInput>
                </SafeAreaView>
              </SafeAreaProvider>
            </View>
          )}

          {high_tank !== '' && (
            <View style={styles.rowContainer}>
              <Text style={styles.label}>High: {high_tank}</Text>
              <SafeAreaProvider>
                <SafeAreaView>
                  <TextInput
                    style={styles.timeInput}>
                  </TextInput>
                </SafeAreaView>
              </SafeAreaProvider>
            </View>
          )}

          {lts !== '' && (
            <View style={styles.rowContainer}>
              <Text style={styles.label}>LTS: {lts}</Text>
              <SafeAreaProvider>
                <SafeAreaView>
                  <TextInput
                    style={styles.timeInput}>
                  </TextInput>
                </SafeAreaView>
              </SafeAreaProvider>
            </View>
          )}



          <Text style= {styles.label}>Site Notes</Text>
          <SafeAreaProvider>
            <SafeAreaView>
              <TextInput
                style = {styles.areaInput}>
              </TextInput>
            </SafeAreaView>
          </SafeAreaProvider>

          <TouchableOpacity
            style={[styles.homeButton, {backgroundColor: 'red'}]}
            onPress={() => alert("Submit Button Pressed")} >
            <Text style={[styles.homeButtonText, {color: 'white'}]}>Submit!</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
        fontSize: 24,
        alignItems: 'flex-start'
      },
    picker: {
      height: 65,
      alignItems: 'flex-start',
      width: '64%',
      marginTop: 0,
      marginBottom: 0
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
    },
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
      fontSize: 30
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