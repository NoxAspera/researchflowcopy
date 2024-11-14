import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';

export default function ViewNotes({ navigation }) {
    const route = useRoute();
    let site = route.params?.site;
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
            <Text style={styles.label}>Instrument</Text>
            <Text style={styles.label}>Instrument name</Text>
          </View>

          <View style = {styles.rowContainer}>
            <Text style = {styles.label}>Time Started</Text>
            <SafeAreaProvider>
              <SafeAreaView>
                <Text style={styles.label}>8:30 am</Text>
              </SafeAreaView>
            </SafeAreaProvider>
          </View>

          <View style ={styles.rowContainer}>
            <Text style = {styles.label}>Tank 1</Text>
            <SafeAreaProvider>
              <SafeAreaView>
                <Text style={styles.label}>1800 psi</Text>
              </SafeAreaView>
          </SafeAreaProvider>
          </View>

          <Text style= {styles.label}>Site Notes</Text>
          <SafeAreaProvider>
            <SafeAreaView>
              <Text style={styles.normal}>Today on site I tested these things, next time will need to bring these tools</Text>
            </SafeAreaView>
          </SafeAreaProvider>
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
  normal: {
          margin: 15,
          fontSize: 16,
          alignItems: 'flex-start'
        },
    /*picker: {
      height: 65,
      alignItems: 'flex-start',
      width: '50%',
      marginBottom: 25
    },*/
    dropdownContainer: {
      marginTop: 50,
      alignItems: 'flex-start',
    },
    timeInput: {
      height: 40,
      margin: 15,
      width: 200,
      borderWidth: 1,
      padding: 10,
    },
    areaInput: {
      height: 200,
      margin: 15,
      width: 350,
      borderWidth: 1,
      padding: 10,
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
      marginBottom: 20, // Add space between the header and the buttons
    },
    headerText: {
      fontSize: 48,
      marginTop: 30,
    }
});