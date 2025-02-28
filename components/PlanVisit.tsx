/**
 * Tank Tracker
 * @author Blake Stambaugh and David Schiwal
 * Updated: 2/6/25 - MO
 *
 * This page is responsible for planning visits.
 */
import { StyleSheet, KeyboardAvoidingView,} from "react-native";
import React, { useState, useRef } from "react";
import { useRoute } from "@react-navigation/native";
import { Button, Layout, Datepicker, Text } from "@ui-kitten/components";
import TextInput from "./TextInput";
import { customTheme } from "./CustomTheme";
import { NavigationType, routeProp } from "./types";
import { ScrollView } from "react-native-gesture-handler";
import { ThemeContext } from "./ThemeContext";
import { visit, setVisitFile } from "../scripts/APIRequests";
import PopupProp from './Popup';
import LoadingScreen from "./LoadingScreen";

export default function PlanVisit({ navigation }: NavigationType) {
  const route = useRoute<routeProp>();
  let site = route.params?.site;
  const themeContext = React.useContext(ThemeContext);
  const isDarkMode = themeContext.theme === 'dark';

  // used for setting and remembering the input values
  const [nameValue, setNameValue] = useState("");
  const [dateValue, setDateValue] = useState<Date | null>(null);
  const [notesValue, setNotesValue] = useState("");
  const [additionalNotesValue, setAdditionalNotesValue] = useState("");

  // used for determining if PUT request was successful
  // will set the success/fail notification to visible, aswell as the color and text
  const [visible, setVisible] = useState(false);
  const [messageColor, setMessageColor] = useState("");
  const [message, setMessage] = useState("");
  const [returnHome, retHome] = useState(false);
  const visibleRef = useRef(false);

  // used for loading screen
  const [loadingValue, setLoadingValue] = useState(false);

  //method to navigate home to send to popup so it can happen after dismiss button is clicked
  function navigateHome(nav:boolean){
    if(nav){
      navigation.navigate("Home")
    }
  }
  const handleSubmit = () => {
        if (!nameValue || !dateValue) {
          setMessage("Please make sure Name and Date are filled out before submitting.");
          setMessageColor(customTheme['color-danger-700']);
          setVisible(true);
          return;
        }
        handleUpdate()
  }
  const handleUpdate = async () => {
    // show loading screen while waiting for results
    setLoadingValue(true);

    if (site.includes("mobile/")) {
      site = site.replace("mobile/", "");
    }
    let visit: visit = {
      date: dateValue.toDateString(),
      name: nameValue,
      site: site,
      equipment: notesValue,
      notes: additionalNotesValue
    }

    const result = await setVisitFile(visit, "Adding site visit");
    
    // hide loading screen when we recieve results
    setLoadingValue(false);

    // check to see if the request was ok, give a message based on that
    if (result.success) {
        setMessage("File updated successfully!");
        setMessageColor(customTheme['color-success-700']);
        retHome(true);
      } else {
        setMessage(`Error: ${result.error}`);
        setMessageColor(customTheme['color-danger-700']);
      }
      setTimeout(() => {
        setVisible(true);
        visibleRef.current = true;
      }, 100);
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
            {site}
          </Text>

          {/* success/failure popup */}
          <PopupProp popupText={message} 
            popupColor={messageColor} 
            onPress={setVisible} 
            navigateHome={navigateHome} 
            visible={visible}
            returnHome={returnHome}/>

          {/* loading screen */}
          <LoadingScreen visible={loadingValue} />

          {/* start date input */}
          <Datepicker
            label={evaProps => <Text {...evaProps} category="p2" style={{color: isDarkMode ? "white" : "black"}}>Visit Date</Text>}
            date={dateValue}
            onSelect={(date) => setDateValue(date as Date)}
            min={new Date(1900, 0, 1)}
            max={new Date(2500, 12, 31)}
            placeholder="Visit Date"
            style={styles.textInput}
          />

          {/* Name input */}
          <TextInput
            labelText="Name"
            labelValue={nameValue}
            onTextChange={setNameValue}
            placeholder="First Last"
            style={styles.textInput}
          />
          {/* list of items entry */}
          <TextInput
            labelText="Items to bring"
            labelValue={notesValue}
            onTextChange={setNotesValue}
            placeholder="Item1"
            style={styles.reasonText}
          />

          {/* notes entry */}
          <TextInput
            labelText="Additional Notes"
            labelValue={additionalNotesValue}
            onTextChange={setAdditionalNotesValue}
            placeholder="Notes"
            style={styles.reasonText}
          />

          {/* submit button */}
          <Button
            onPress={() => handleSubmit()}
            appearance="filled"
            status="primary"
            style={styles.submitButton}
          >
          {evaProps => <Text {...evaProps} category="h6" style={{color: "black"}}>Submit</Text>}
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
    justifyContent: "space-evenly",
  },
  reasonText: {
    flex: 1,
    margin: 8,
  },
  textInput: {
    flex: 1,
    margin: 8,
  },
  submitButton:{
    margin: 20, 
    backgroundColor: "#06b4e0",
  },
});
