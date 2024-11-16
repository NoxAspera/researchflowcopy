import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';

export default function BadData({ navigation }) {
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

          <View style = {styles.rowContainer}>
            <Text style = {styles.label}>ID Old:</Text>
            <SafeAreaProvider>
              <SafeAreaView>
                <TextInput
                  style = {styles.timeInput}>
                </TextInput>
              </SafeAreaView>
            </SafeAreaProvider>
          </View>

          <View style = {styles.rowContainer}>
            <Text style = {styles.label}>ID New:  </Text>
            <SafeAreaProvider>
              <SafeAreaView>
                <TextInput
                  style = {styles.timeInput}>
                </TextInput>
              </SafeAreaView>
            </SafeAreaProvider>
          </View>

          <View style = {styles.rowContainer}>
            <Text style = {styles.label}>Time Start:</Text>
            <SafeAreaProvider>
              <SafeAreaView>
                <TextInput
                  style = {styles.timeInput}>
                </TextInput>
              </SafeAreaView>
            </SafeAreaProvider>
          </View>

          <View style = {styles.rowContainer}>
            <Text style = {styles.label}>Time End:  </Text>
            <SafeAreaProvider>
              <SafeAreaView>
                <TextInput
                  style = {styles.timeInput}>
                </TextInput>
              </SafeAreaView>
            </SafeAreaProvider>
          </View>

          <View style = {styles.rowContainer}>
            <Text style = {styles.label}>Name: </Text>
            <SafeAreaProvider>
              <SafeAreaView>
                <TextInput
                  style = {styles.timeInput}>
                </TextInput>
              </SafeAreaView>
            </SafeAreaProvider>
          </View>

          <View>
            <Text style = {styles.label}>Time entry added: </Text>
          </View>

          <View style = {styles.rowContainer}>
            <SafeAreaProvider>
              <SafeAreaView>
                <TextInput
                  style = {styles.timeInput2}>
                </TextInput>
              </SafeAreaView>
            </SafeAreaProvider>
          </View>

          <Text style= {styles.label}>Why is the data bad:</Text>
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
        marginBottom: 10,
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