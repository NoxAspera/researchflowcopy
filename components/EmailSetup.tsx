/**
 * Email Setup Page
 * @author David Schiwal
 * Updated: 4/6/25 - DS
 *
 * This is the page for email notification setup. It will take in the given email and name, try to send
 * notifications immeidately if applicable, and save the email and name to the device.
 */
import { StyleSheet, KeyboardAvoidingView } from "react-native";
import React, { useState} from "react";
import { Button, Layout, Text } from "@ui-kitten/components";
import TextInput from "./TextInput";
import { customTheme } from "./CustomTheme";
import { NavigationType } from "./types";
import { ScrollView } from "react-native-gesture-handler";
import PopupProp from './Popup';
import { ThemeContext } from './ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendEmailNotification } from "../scripts/EmailNotifications";

export default function EmailSetup( { navigation }: NavigationType) {
  const themeContext = React.useContext(ThemeContext);

  // used for setting and remembering the input values
  const [emailValue, setEmailValue] = useState("");
  const [nameValue, setNameValue] = useState("");

  // used for determining if PUT request was successful
  // will set the success/fail notification to visible, aswell as the color and text
  const [visible, setVisible] = useState(false);
  const [messageColor, setMessageColor] = useState("");
  const [message, setMessage] = useState("");
  const [returnHome, retHome] = useState(false);

  /**
   * @author David Schiwal
   * This method saves the given email to the device
   */
  const saveEmail = async () => {
    try {
      await AsyncStorage.setItem('email', emailValue);
    } catch (e) {
      console.error("Failed to save the current email: ", e);
    }
  }
  /**
   * @author David Schiwal
   * This method saves the given name to the device
   */
  const saveName = async () => {
    try {
      await AsyncStorage.setItem('name', nameValue);
    } catch (e) {
      console.error("Failed to save the current name: ", e);
    }
  }
  /**
   * @author David Schiwal
   * This method checks if fields have been field and saves them if they are
   * @returns If needed to put the popup up warning that fields haven't been filled.
   */
  function handleSubmit() {
    if (!emailValue) {
      setMessage("Please fill out all fields before submitting.");
      setMessageColor(customTheme["color-danger-700"]);
      setVisible(true);
      return;
    }
    //set Email in storage
    saveEmail();
    //set Name in storage
    saveName();
    //try pushing email notifications
    sendEmailNotification(emailValue, nameValue);
    //return home
    navigateHome(true);
  };
  
  //method to navigate home to send to popup so it can happen after dismiss button is clicked
  function navigateHome(nav:boolean){
    if(nav){
      navigation.navigate("Home")
    }
  }

  return (
    <KeyboardAvoidingView
      behavior = "padding"
      style={styles.container}
    >
      <ScrollView automaticallyAdjustKeyboardInsets={true} keyboardShouldPersistTaps='handled'>
        <Layout style={styles.container} level="1">
          {/* header */}
          <Text category="h1" style={{ textAlign: "center" }}>
            {"Email Setup"}
          </Text>

          {/* text inputs */}
          {/* success/failure popup */}
          <PopupProp popupText={message} 
            popupColor={messageColor} 
            onPress={() => setVisible(false)} 
            navigateHome={navigateHome} 
            visible={visible}
            returnHome={returnHome}/>

          {/* Name input */}
          <TextInput
            labelText="Name in site notes/planning visits"
            labelValue={nameValue}
            onTextChange={setNameValue}
            placeholder="first last"
            style={styles.textInput}
          />

          {/* Email input */}
          <TextInput
            labelText="Email you want notifications sent to"
            labelValue={emailValue}
            onTextChange={setEmailValue}
            placeholder="example@example.com"
            style={styles.textInput}
          />

          {/* submit button */}
          <Button
            onPress={() => handleSubmit()}
            appearance="filled"
            status="primary"
            style={styles.submitButton}
          >
          {evaProps => <Text {...evaProps} category="h6" style={{color: "black"}}>Enable Notifications</Text>}
          </Button>
        </Layout>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch", // has button fill space horizontally
    justifyContent: "flex-start",
  },
  textInput: {
    flex: 1,
    margin: 15,
  },
  submitButton:{
    margin: 20, 
    backgroundColor: "#06b4e0",
  },
});
