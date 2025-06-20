/**
 * Instrument Maintenance Page
 * @author David Schiwal, Blake Stambaugh, Megan Ostlie
 * Updated: 3/29/25 - DS
 *
 * This is the page for instrument maintenance. It will take in the user input, format
 * it, and send it to the github repo.
 */
import { StyleSheet, KeyboardAvoidingView, TouchableOpacity, View, Platform, Pressable } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useRoute } from "@react-navigation/native";
import { Button, Layout, Text, CheckBox, Icon } from "@ui-kitten/components";
import TextInput from "../components/TextInput";
import NoteInput from "../components/NoteInput";
import { NavigationType, routeProp } from "../components/types";
import {setInstrumentFile, setBadData} from "../scripts/APIRequests";
import { ScrollView } from "react-native-gesture-handler";
import { ThemeContext } from '../components/ThemeContext';
import SuccessFailurePopup from '../components/SuccessFailurePopup';
import LoadingScreen from "../components/LoadingScreen";
import DateTimePicker from '@react-native-community/datetimepicker';
import { TimerPickerModal } from "react-native-timer-picker";
import { buildBadDataString, buildInstrumentNotes, sanitize } from "../scripts/Parsers";
import { fetchSite } from "../scripts/DataFetching";
import { setEndDateHourMinutes, setStartDateHourMinutes, showEndMode, showStartMode } from "../scripts/Dates";

export default function InstrumentMaintenance({ navigation }: NavigationType) {
  //changes start date
  const onStartChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setStartDateValue(currentDate);
  };

  //changes end date
  const onEndChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setEndDateValue(currentDate);
  };

  const route = useRoute<routeProp>();
  let site = route.params?.site ?? "";
  let instrumentName = site.slice(site.lastIndexOf("/") + 1);
  let needsLocation = site.includes("LGR");
  const themeContext = React.useContext(ThemeContext);
  const isDarkMode = themeContext.theme === "dark";

  // used for setting and remembering the input values
  const [nameValue, setNameValue] = useState("");
  const [startDateValue, setStartDateValue] = useState(new Date());
  const [endDateValue, setEndDateValue] = useState(new Date());
  const [notesValue, setNotesValue] = useState("");
  const [siteValue, setSiteValue] = useState("");
  const [addToBadData, setAddToBadData] = useState(false);
  const [badDataReason, setBadDataReason] = useState("");
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // used for determining if PUT request was successful
  // will set the success/fail notification to visible, aswell as the color and text
  const [visible, setVisible] = useState(false);
  const [messageStatus, setMessageStatus] = useState("");
  const [message, setMessage] = useState("");
  const [returnHome, retHome] = useState(false);
  const visibleRef = useRef(false);

  // used for loading screen
  const [loadingValue, setLoadingValue] = useState(false);
  //used for date/time pickers
  const [showPicker, setShowPicker] = useState(false);
  const [showPicker2, setShowPicker2] = useState(false);

  useEffect(() => {
    fetchSite(site, setSiteValue);
  }, [site]);

  const handleSubmit = () => {
    if (
      !nameValue ||
      !startDateValue ||
      (addToBadData && !endDateValue) ||
      !notesValue ||
      (needsLocation && !siteValue.trim()) ||
      (addToBadData && !badDataReason.trim())
    ) {
      setMessage("Please fill out all fields before submitting.");
      setMessageStatus("danger");
      setVisible(true);
      return;
    }
    handleUpdate();
  };

  const handleUpdate = async () => {
    // display loading screen while while awaiting for results
    setLoadingValue(true);

    const instrumentNotes = buildInstrumentNotes(
      startDateValue,
      nameValue,
      notesValue
    );

    let badResult;
    if (addToBadData) {
      const badDataString = buildBadDataString(
        startDateValue,
        endDateValue,
        "all",
        "NA",
        nameValue,
        badDataReason,
        true
      );
      let location;
      let instrument;
      if (needsLocation) {
        location = siteValue.toLowerCase();
        instrument = "lgr_ugga";
      } else {
        location = "wbb";
        instrument = "teledyne_" + instrumentName.toLowerCase();
      }
      badResult = await setBadData(
        sanitize(location),
        sanitize(instrument),
        badDataString,
        `Update ${instrument}.csv`
      );
    }

    const result = await setInstrumentFile(
      sanitize(site),
      sanitize(instrumentNotes),
      `Update ${instrumentName}.md`,
      needsLocation,
      sanitize(siteValue)
    );

    // hide loading screen when we have results
    setLoadingValue(false);

    if (result.success && (!badResult || badResult.success)) {
      setMessage("File updated successfully!");
      setMessageStatus("success");
      retHome(true);
    } else {
      if (result.error) {
        setMessage(`Error: ${result.error}`);
        setMessageStatus("danger");
      } else if (badResult.error) {
        setMessage(
          `Instrument maintenance notes updated successfully.\nUnable to update Bad Data. Please update Bad Data manually.`
        );
        setMessageStatus("danger");
        retHome(true);
      }
    }
    setTimeout(() => {
      setVisible(true);
      visibleRef.current = true;
    }, 100);
  };

  const handleChecked = (checked: boolean) => {
    setAddToBadData(checked);
    if (showEndPicker) {
      setShowEndPicker(false);
    }
  };

  //method to navigate home to send to popup so it can happen after dismiss button is clicked
  function navigateHome(nav: boolean) {
    if (nav) {
      navigation.navigate("Home");
    }
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <ScrollView
        automaticallyAdjustKeyboardInsets={true}
        keyboardShouldPersistTaps="handled"
      >
        <Layout style={styles.container} level="1">
          {/* header */}
          <Text category="h1" style={{ textAlign: "center" }}>
            {instrumentName}
          </Text>

          {/* text inputs */}
          {/* success/failure popup */}
          <SuccessFailurePopup
            popupText={message}
            popupStatus={messageStatus}
            onPress={() => setVisible(false)}
            navigateHome={navigateHome}
            visible={visible}
            returnHome={returnHome}
          />

          {/* loading screen */}
          <LoadingScreen visible={loadingValue} />

          {/* Time input */}
          {needsLocation && (
            <TextInput
              labelText="Location"
              labelValue={siteValue}
              onTextChange={setSiteValue}
              placeholder="Enter site"
              style={styles.textInput}
            />
          )}

          <Text category="p2" style={{ marginTop: 15, marginLeft: 15 }}>
            Start Time (MT):
          </Text>
          <TouchableOpacity
            onPress={() => setShowStartPicker(true)}
            style={[
              styles.datePicker,
              { borderColor: isDarkMode ? "#101426" : "#E4E9F2" },
              { backgroundColor: isDarkMode ? "#1A2138" : "#F7F9FC" },
            ]}
          >
            <Icon
              name="calendar-outline"
              style={{ width: 20, height: 20, marginRight: 10 }}
              fill="gray"
            />
            <Text>
              {startDateValue.toLocaleDateString([], {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}{" "}
              {startDateValue.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </TouchableOpacity>

          {showStartPicker && Platform.OS === "ios" && (
            <View>
              <DateTimePicker
                value={startDateValue}
                mode="datetime"
                display="spinner"
                onChange={(event, selectedDate) => {
                  if (selectedDate) setStartDateValue(selectedDate);
                }}
              />
              <Button
                style={styles.submitButton}
                onPress={() => setShowStartPicker(false)}
              >
                {(evaProps) => (
                  <Text {...evaProps} category="h6" style={{ color: "black" }}>
                    Confirm Date/Time
                  </Text>
                )}
              </Button>
            </View>
          )}

          {showStartPicker && Platform.OS === "android" && (
            <View style={styles.androidDateTime}>
              <Pressable
                onPress={() => {
                  showStartMode("date", startDateValue, onStartChange);
                  setStartDateValue(startDateValue);
                }}
              >
                <Text>
                  {startDateValue.toLocaleDateString([], {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  })}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setShowPicker(true);
                  setStartDateValue(startDateValue);
                }}
              >
                <Text>
                  {startDateValue.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </Pressable>
              <TimerPickerModal
                visible={showPicker}
                setIsVisible={setShowPicker}
                //makes it am/pm
                use12HourPicker={true}
                //since we don't need seconds it is hidden
                hideSeconds={true}
                minuteLabel={"<"}
                onConfirm={(pickedDuration) => {
                  //set time
                  setStartDateHourMinutes(pickedDuration, startDateValue, setStartDateValue);
                  //set time picker to false to close it
                  setShowPicker(false);
                }}
                modalTitle="Set Time"
                onCancel={() => setShowPicker(false)}
                closeOnOverlayPress
                styles={{
                  theme: isDarkMode ? "dark" : "light",
                }}
                modalProps={{
                  overlayOpacity: 0.2,
                }}
              />
            </View>
          )}

          <CheckBox
            checked={addToBadData}
            onChange={(checked) => {
              handleChecked(checked);
            }}
            style={{ margin: 15 }}
          >
            {(evaProps) => (
              <Text {...evaProps} category="p2">
                Add this time period to Bad Data?
              </Text>
            )}
          </CheckBox>

          {addToBadData && (
            <View>
              <Text category="p2" style={{ marginTop: 15, marginLeft: 15 }}>
                End Time (MT):
              </Text>
              <TouchableOpacity
                onPress={() => setShowEndPicker(true)}
                style={[
                  styles.datePicker,
                  { borderColor: isDarkMode ? "#101426" : "#E4E9F2" },
                  { backgroundColor: isDarkMode ? "#1A2138" : "#F7F9FC" },
                ]}
              >
                <Icon
                  name="calendar-outline"
                  style={{ width: 20, height: 20, marginRight: 10 }}
                  fill="gray"
                />
                <Text>
                  {endDateValue.toLocaleDateString([], {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}{" "}
                  {endDateValue.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {showEndPicker && addToBadData && Platform.OS === "ios" && (
            <View>
              <DateTimePicker
                value={endDateValue}
                mode="datetime"
                display="spinner"
                onChange={(event, selectedDate) => {
                  if (selectedDate) setEndDateValue(selectedDate);
                }}
              />
              <Button
                style={styles.submitButton}
                onPress={() => setShowEndPicker(false)}
              >
                {(evaProps) => (
                  <Text {...evaProps} category="h6" style={{ color: "black" }}>
                    Confirm Date/Time
                  </Text>
                )}
              </Button>
            </View>
          )}

          {showEndPicker && Platform.OS === "android" && addToBadData && (
            <View style={styles.androidDateTime}>
              <Pressable
                onPress={() => {
                  showEndMode("date", endDateValue, onEndChange);
                  setEndDateValue(endDateValue);
                }}
              >
                <Text>
                  {endDateValue.toLocaleDateString([], {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  })}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setShowPicker2(true);
                  setEndDateValue(endDateValue);
                }}
              >
                <Text>
                  {endDateValue.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </Pressable>
              <TimerPickerModal
                visible={showPicker2}
                setIsVisible={setShowPicker2}
                use12HourPicker={true}
                hideSeconds={true}
                minuteLabel={"<"}
                onConfirm={(pickedDuration) => {
                  //set time
                  setEndDateHourMinutes(pickedDuration, endDateValue, setEndDateValue);
                  //set time picker to false to close it
                  setShowPicker2(false);
                }}
                modalTitle="Set Time"
                onCancel={() => setShowPicker2(false)}
                closeOnOverlayPress
                styles={{
                  theme: isDarkMode ? "dark" : "light",
                }}
                modalProps={{
                  overlayOpacity: 0.2,
                }}
              />
            </View>
          )}

          {/* Conditionally render reason input if checkbox is checked */}
          {addToBadData && (
            <TextInput
              labelText="Reason for Bad Data"
              labelValue={badDataReason}
              onTextChange={setBadDataReason}
              placeholder="Describe why this data is invalid"
              style={styles.textInput}
            />
          )}

          {/* Name input */}
          <TextInput
            labelText="Name"
            labelValue={nameValue}
            onTextChange={setNameValue}
            placeholder="First Last"
            style={styles.textInput}
          />

          {/* notes entry */}
          <NoteInput
            labelText="Maintenance Performed"
            labelValue={notesValue}
            onTextChange={setNotesValue}
            placeholder="Maintenance"
            multiplelines={true}
            style={styles.requestText}
          />

          {/* submit button */}
          <Button
            onPress={() => handleSubmit()}
            appearance="filled"
            status="primary"
            style={styles.submitButton}
          >
            {(evaProps) => (
              <Text {...evaProps} category="h6" style={{ color: "black" }}>
                Submit
              </Text>
            )}
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
  requestText: {
    flex: 1,
    margin: 15,
  },
  textInput: {
    flex: 1,
    margin: 15,
  },
  submitButton:{
    margin: 20, 
    backgroundColor: "#06b4e0",
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 15,
    marginRight: 15,
    marginLeft: 15,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#d3d3d3',
    backgroundColor: '#f9f9f9',
  },
  androidDateTime: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
