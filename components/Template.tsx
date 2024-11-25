import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';

export default function Template({ navigation }) {
    const route = useRoute();
    //used for default values like in selection screens so if the first option
    //is correct it passes that information along
    const [selectedValue, setSelectedValue] = useState("");
    //for values that gets passed into this view
    let nameOfValue = route.params?.nameOfValue;


    //what gets displayed on screen
    return (
      {/* ScrollView specifies that if things on screen take up more than one screen space
          the entire screen (or part) will be scrollable and will continue displaying
          everything as you scroll, by default everything is vertically stacked */}
      <ScrollView style = {styles.scrollContainer}>
        {/* View just declares that something is going to be displayed on screen*/}
        <View style={styles.container}>

          {/* header */}
          <View style={styles.header}>
            <Text style={styles.headerText}>{HeaderValue} or Text</Text>
          </View>

          {/* Displaying text */}
          <View>
            <Text style = {styles.label}>Text to display {Can display values like this}</Text>
          </View>

          {/* Example for a drop down menu, rowContainer makes it so that any items on the same level
              are on one row*/}
          <View style={styles.rowContainer}>
             {/* title for the dropdown menu */}
            <Text style={styles.label}>Title</Text>
            <Picker
                {/* setting the default value */}
                selectedValue={selectedValue}
                {/* what happens when an item gets selected */}
                onValueChange={(itemValue: React.SetStateAction<string>) => setSelectedValue(itemValue)}
                {/* the style things like font size, color, spacing, etc. */}
                style={styles.picker}
              >
                {/* Declare items here with label being the thing shown on screen, value the backend
                    value that will get passed where it needs to*/}
                <Picker.Item label="Example 1" value="ExampleVal 1" />
                <Picker.Item label="Example 2" value="ExampleVal 2" />
                <Picker.Item label="Example 3" value="ExampleVal 3" />
                <Picker.Item label="Example 4" value="ExampleVal 4" />
            </Picker>
          </View>

          {/* Text input box parallel */}
          <View style = {styles.rowContainer}>
            <Text style = {styles.label}>Title:</Text>
            <SafeAreaProvider>
              <SafeAreaView>
                <TextInput
                  {/* the style things like font size, color, spacing, etc. */}
                  style = {styles.timeInput}>
                </TextInput>
              </SafeAreaView>
            </SafeAreaProvider>
          </View>

          {/* Text input box vertical */}
          <View>
            <Text style = {styles.label}>Title: </Text>
          </View>

          <View style = {styles.rowContainer}>
            <SafeAreaProvider>
              <SafeAreaView>
                <TextInput
                {/* the style things like font size, color, spacing, etc. */}
                  style = {styles.timeInput2}>
                </TextInput>
              </SafeAreaView>
            </SafeAreaProvider>
          </View>

          {/* Large text input box with title above */}
          <Text style= {styles.label}>Title</Text>
          <SafeAreaProvider>
            <SafeAreaView>
              <TextInput
                {/* the style things like font size, color, spacing, etc. */}
                style = {styles.areaInput}>
              </TextInput>
            </SafeAreaView>
          </SafeAreaProvider>

          {/* An example button */}
          <TouchableOpacity
            {/* the style things like font size, color, spacing, etc. can also specify color
                of the button here */}
            style={[styles.homeButton, {backgroundColor: 'red'}]}
            {/* Pass a method of what you want to happen when button is clicked,
                ex moving to a new screen
                navigation.navigate('NameOfScreenToGoTo', {passAlongValues: selectedValue});*/}
            onPress={() => alert("Submit Button Pressed")} >
            {/* Text style, can pass in color modifications if desired */}
            <Text style={[styles.homeButtonText, {color: 'white'}]}>ButtonText</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    );
  }

  //list of styles that describe how things appear on screen
  //can specify colors, margins, alignment, height, width, padding, borders, etc.
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