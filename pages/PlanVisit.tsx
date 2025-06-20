/**
 * Plan Visit
 * @author Blake Stambaugh and David Schiwal
 * Updated: 3/23/25 - DS
 *
 * This page is responsible for planning visits.
 */
import { StyleSheet, KeyboardAvoidingView,} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import { Button, Layout, Datepicker, Text, Card } from "@ui-kitten/components";
import TextInput from "../components/TextInput";
import { NavigationType, routeProp } from "../components/types";
import { ScrollView } from "react-native-gesture-handler";
import { ThemeContext } from "../components/ThemeContext";
import { visit, setVisitFile } from "../scripts/APIRequests";
import SuccessFailurePopup from '../components/SuccessFailurePopup';
import LoadingScreen from "../components/LoadingScreen";
import { sanitize } from "../scripts/Parsers";
import { fetchPrevNotes } from "../scripts/DataFetching";

export default function PlanVisit({ navigation }: NavigationType) {
  const route = useRoute<routeProp>();
  let site = route.params?.site;
  let from = route.params?.from;
  const themeContext = React.useContext(ThemeContext);
  const isDarkMode = themeContext.theme === 'dark';

  // used for setting and remembering the input values
  const [nameValue, setNameValue] = useState("");
  const [dateValue, setDateValue] = useState<Date | null>(null);
  const [notesValue, setNotesValue] = useState("");
  const [additionalNotesValue, setAdditionalNotesValue] = useState("");
  const [statusValue, setStatusValue] = useState("basic");

  // used for determining if PUT request was successful
  // will set the success/fail notification to visible, aswell as the color and text
  const [visible, setVisible] = useState(false);
  const [messageStatus, setMessageStatus] = useState("");
  const [message, setMessage] = useState("");
  const [returnHome, retHome] = useState(false);
  const visibleRef = useRef(false);

  // used for getting notes from previous site
  const [data, setData] = useState<string[] | null>(null);

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
          setMessageStatus("danger");
          setVisible(true);
          return;
        }
        handleUpdate()
  }

  // Get current notes for the site
  useEffect(() => {
    if(!from){
      fetchPrevNotes(site, data, route, setData);
    }
  }, [site]);

  const handleUpdate = async () => {
    // show loading screen while waiting for results
    setLoadingValue(true);

    if (site.includes("mobile/")) {
      site = site.replace("mobile/", "");
    }
    let visit: visit = {
      date: dateValue.toDateString(),
      name: sanitize(nameValue),
      site: site,
      equipment: sanitize(notesValue),
      notes: sanitize(additionalNotesValue)
    }

    const result = await setVisitFile(visit, "Adding site visit");
    
    // hide loading screen when we recieve results
    setLoadingValue(false);

    // check to see if the request was ok, give a message based on that
    if (result.success) {
        setMessage("Visit planned successfully!");
        setMessageStatus("success");
      } else {
        setMessage(`Error: ${result.error}`);
        setMessageStatus("danger");
      }
      retHome(true);
      setTimeout(() => {
        setVisible(true);
        visibleRef.current = true;
      }, 100);
  }
  
  return (
    <KeyboardAvoidingView
      behavior = "padding"
      style={{ flex: 1 }}
    >
      <ScrollView automaticallyAdjustKeyboardInsets={true} keyboardShouldPersistTaps='handled' contentContainerStyle={{ flexGrow: 1 }}>
        <Layout style={styles.container} level="1">
          {/* header */}
          <Text category="h1" style={{ textAlign: "center" }}>
            {site}
          </Text>

          {/* success/failure popup */}
          <SuccessFailurePopup popupText={message} 
            popupStatus={messageStatus} 
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
            //changing the status here works because the mapping.json file (researchflow\node_modules\@eva-design\eva\mapping.json)
            //has a different textColor in the primary field for Datepicker 
            onSelect={(date) => {setDateValue(date as Date); setStatusValue("primary")}}
            min={new Date(1900, 0, 1)}
            max={new Date(2500, 12, 31)}
            placeholder="Visit Date"
            style={styles.textInput}
            status={statusValue}
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

          {/* notes from previous site */}
          {data !== null ? (
              <Card>
                <Text>
                Previous Notes
                </Text>
                <Text category="p2">{data[2]}</Text>
              </Card>
            ) : (
              <Card>
                <Text>
                No Previous Notes
                </Text>
              </Card>
            )}

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
    flexDirection: "column",
    alignItems: "stretch", // has button fill space horizontally
    justifyContent: "flex-start",
  },
  reasonText: {
    margin: 8,
  },
  textInput: {
    margin: 8,
  },
  submitButton:{
    margin: 20, 
    backgroundColor: "#06b4e0",
  },
});
