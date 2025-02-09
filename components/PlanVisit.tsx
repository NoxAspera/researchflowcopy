/**
 * Tank Tracker
 * @author Blake Stambaugh and David Schiwal
 * Updated: 2/6/25 - MO
 *
 * This page is responsible for planning visits.
 */
import { StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import React, { useState } from "react";
import { useRoute } from "@react-navigation/native";
import { Button, IndexPath, Layout, Datepicker, Text } from "@ui-kitten/components";
import TextInput from "./TextInput";
import { customTheme } from "./CustomTheme";
import { NavigationType, routeProp } from "./types";
import { ScrollView } from "react-native-gesture-handler";
import { ThemeContext } from "./ThemeContext";
import { visit, setVisitFile } from "../scripts/APIRequests";
import PopupProp from './Popup';

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

  const [visible, setVisible] = useState(false);
  const [messageColor, setMessageColor] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
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
    
    // check to see if the request was ok, give a message based on that
    if (result.success) {
        setMessage("File updated successfully!");
        navigation.navigate("Home")
        setMessageColor(customTheme['color-success-700']);
      } else {
        setMessage(`Error: ${result.error}`);
        setMessageColor(customTheme['color-danger-700']);
      }
    setVisible(true);
  }
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView>
        <Layout style={styles.container} level="1">
          {/* header */}
          <Text category="h1" style={{ textAlign: "center" }}>
            {site}
          </Text>

          {/* success/failure popup */}
          <PopupProp popupText={message} 
            popupColor={messageColor} 
            onPress={setVisible} 
            visible={visible}/>

          {/* start date input */}
          <Datepicker
            label="Visit Date"
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
            placeholder="Jane Doe"
            style={styles.textInput}
          />
          {/* list of items entry */}
          <TextInput
            labelText="Items to bring"
            labelValue={notesValue}
            onTextChange={setNotesValue}
            placeholder="Instrument 1"
            style={styles.reasonText}
          />

          {/* notes entry */}
          <TextInput
            labelText="Additional Notes"
            labelValue={additionalNotesValue}
            onTextChange={setAdditionalNotesValue}
            placeholder="Make sure to download previous site docs"
            style={styles.reasonText}
          />

          {/* submit button */}
          <Button
            onPress={() => handleSubmit()}
            appearance="filled"
            status="primary"
            style={{ margin: 8 }}
          >
            Submit
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
});
