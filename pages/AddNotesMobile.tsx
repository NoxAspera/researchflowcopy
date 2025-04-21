/**
 * Add Notes Page for mobile sites
 * @author Blake Stambaugh, Megan Ostlie, August O'Rourke, and David Schiwal
 * Updated: 3/29/25 - DS
 * This page will take in input from the user, format it, and upload it to the
 * github repo. This page is slightly different than the main AddNotes page because
 * the mobile sites do not have as many tanks as the stationary sites
 */
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Modal,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useRoute } from "@react-navigation/native";
import { ScrollView, Pressable } from "react-native-gesture-handler";
import {
  buildBadDataString,
  buildMobileNotes,
  installedInstrumentNotes,
  MobileEntry,
  removedInstrumentNotes,
} from "../scripts/Parsers";
import TextInput from "../components/TextInput";
import NoteInput from "../components/NoteInput";
import {
  Layout,
  Button,
  Text,
  Select,
  SelectItem,
  IndexPath,
  CheckBox,
  Icon,
} from "@ui-kitten/components";
import {
  setSiteFile,
  getFileContents,
  TankRecord,
  getLatestTankEntry,
  addEntrytoTankDictionary,
  setTankTracker,
  getDirectory,
  setInstrumentFile,
  setBadData,
  offlineTankEntry,
  buildTankRecordString,
} from "../scripts/APIRequests";
import { parseNotes, ParsedData, copyTankRecord } from "../scripts/Parsers";
import SuccessFailurePopup from "../components/SuccessFailurePopup";
import MissingInputPopup from "../components/MissingInputPopup";
import { NavigationType, routeProp } from "../components/types";
import { ThemeContext } from "../components/ThemeContext";
import * as Network from "expo-network";
import LoadingScreen from "../components/LoadingScreen";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { TimerPickerModal } from "react-native-timer-picker";
import { fetchData, fetchInstrumentNames } from "../scripts/DataFetching";
import { setEndDateHourMinutes, setStartDateHourMinutes, showEndMode, showStartMode } from "../scripts/Dates";

/**
 * @author August O'Rourke, Blake Stambaugh, David Schiwal, Megan Ostlie
 *  Creates the input elements for the user to input site note information.
 *  Pulls the current notes for the selected site from GitHub and autofills certain fields.
 *  Takes the inputted information from the user to build a new string that is added to that site's note document.
 *
 */
export default function AddNotes({ navigation }: NavigationType) {
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
  const { site } = route.params || {};
  const themeContext = React.useContext(ThemeContext);
  const isDarkMode = themeContext.theme === "dark";

  // State to hold parsed data
  const [data, setData] = useState<ParsedData | null>(null);
  const visibleRef = useRef(false);

  // used for loading screen
  const [loadingValue, setLoadingValue] = useState(false);

  useEffect(() => {
    fetchData(setNetworkStatus, setData, site, data, networkStatus);
  }, [site]); // Re-run if `site` changes

  // Get list of possible instruments
  useEffect(() => {
    fetchInstrumentNames(setInstrumentNames, null);
  }, [site]);

  //Get latest notes entry from site
  let latestEntry = null;
  if (data) {
    latestEntry = data.entries[0];
  }

  // these use states to set and store values in the text inputs
  const [networkStatus, setNetworkStatus] = useState(false);
  const [startDateValue, setStartDateValue] = useState(new Date());
  const [endDateValue, setEndDateValue] = useState(new Date());
  const [nameValue, setNameValue] = useState("");
  const [tankId, setTankId] = useState("");
  const [tankValue, setTankValue] = useState("");
  const [tankPressure, setTankPressure] = useState("");
  const [notesValue, setNotesValue] = useState("");
  const [instrumentInput, setInstrumentInput] = useState("");
  const [tankRecord, setTankRecord] = useState<TankRecord>(undefined);
  const [originalTank, setOriginalTank] = useState<TankRecord>(undefined);
  const [instrumentNames, setInstrumentNames] = useState<string[]>();
  const [originalInstrument, setOriginalInstrument] = useState("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [customInstrument, setCustomInstrument] = useState<string>("");
  const [addToBadData, setAddToBadData] = useState(false);
  const [badDataReason, setBadDataReason] = useState("");
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [selectedTank, setSelectedTank] = useState("");

  // used for determining if PUT request was successful
  // will set the success/fail notification to visible, aswell as the color and text
  const [visible, setVisible] = useState(false);
  const [messageStatus, setMessageStatus] = useState("");
  const [message, setMessage] = useState("");
  const [returnHome, retHome] = useState(false);
  //used for popup if info is missing
  const [visible2, setVisible2] = useState(false);
  //used for date/time pickers
  const [showPicker, setShowPicker] = useState(false);
  const [showPicker2, setShowPicker2] = useState(false);

  //method will warn user if fields haven't been input
  function checkTextEntries() {
    if (
      nameValue == "" ||
      tankId == "" ||
      tankValue == "" ||
      tankPressure == "" ||
      notesValue == ""
    ) {
      setVisible2(true);
    } else {
      handleUpdate();
    }
  }

  const handleTankChange = () => {
    setSelectedTank("tank");
  };

  useEffect(() => {
    if (selectedTank) {
      setTimeout(() => {
        navigation.navigate("SelectTank", {
          from: "AddNotes",
          onSelect: (tank) => {
            if (networkStatus) {
              setTankId(tank);
              const entry =
                getLatestTankEntry(tank) ||
                getLatestTankEntry(tank.toLowerCase());
              setTankRecord(entry);
              setTankValue(entry.co2.toString() + " ~ " + entry.ch4.toString());
            } else {
              setTankId(tank);
              //it won't display the tankID unless we give this an empty value, haven't a clue why
              setTankValue(" ");
            }
          },
        });
      }, 10);
    }
    setSelectedTank("");
  }, [selectedTank]);

  const clearTankEntry = () => {
    setTankId("");
    setTankValue("");
    setTankRecord(undefined);
  };

  const handleInstrumentUpdate = (index: IndexPath | IndexPath[]) => {
    const selectedRow = (index as IndexPath).row;
    if (selectedRow === instrumentNames?.length) {
      setInstrumentInput("");
    } else if (selectedRow === instrumentNames?.length + 1) {
      setModalVisible(true);
    } else {
      const selectedInstrument = instrumentNames?.[selectedRow] ?? "";
      setInstrumentInput(selectedInstrument);
    }
  };

  const addCustomInstrument = () => {
    if (customInstrument.trim() !== "") {
      setInstrumentInput(customInstrument);
      setCustomInstrument("");
    }
    setModalVisible(false);
  };

  // will call setFile to send the PUT request.
  // If it is successful it will display a success message
  // if it fails then it will display a failure message
  const handleUpdate = async () => {
    const Tankignored: boolean =
      tankId == "" && tankValue == "" && tankPressure == "";

    // show loading screen
    setLoadingValue(true);

    const start = new Date(startDateValue);
    const startYear = start.getUTCFullYear();
    const startMonth = String(start.getUTCMonth() + 1).padStart(2, "0");
    const startDay = String(start.getUTCDate()).padStart(2, "0");
    const startHours = String(start.getUTCHours()).padStart(2, "0");
    const startMinutes = String(start.getUTCMinutes()).padStart(2, "0");

    const end = new Date(endDateValue);
    const endYear = end.getUTCFullYear();
    const endMonth = String(end.getUTCMonth() + 1).padStart(2, "0");
    const endDay = String(end.getUTCDate()).padStart(2, "0");
    const endHours = String(end.getUTCHours()).padStart(2, "0");
    const endMinutes = String(end.getUTCMinutes()).padStart(2, "0");
    const endSeconds = String(end.getUTCSeconds()).padStart(2, "0");

    let tankRecordString = "";
    // create an entry object data that will be sent off to the repo
    let data: MobileEntry = {
      time_in: `${startYear}-${startMonth}-${startDay} ${startHours}:${startMinutes}`,
      time_out: `${endYear}-${endMonth}-${endDay} ${endHours}:${endMinutes}`,
      names: nameValue,
      instrument: instrumentInput.trim() ? instrumentInput : null,
      tank: Tankignored
        ? null
        : {
            id: tankId,
            value: tankValue,
            unit: "ppm",
            pressure: tankPressure,
          },
      additional_notes: notesValue,
    };

    const utcTime = `${endYear}-${endMonth}-${endDay}T${endHours}:${endMinutes}:${endSeconds}Z`;
    const siteName = site.replace("mobile/", "");
    if (networkStatus) {
      if (
        originalTank &&
        (!tankRecord || originalTank.tankId != tankRecord.tankId)
      ) {
        let newTankEntry = copyTankRecord(originalTank);
        newTankEntry.location = "ASB279";
        newTankEntry.pressure = 500;
        newTankEntry.userId = nameValue;
        newTankEntry.updatedAt = utcTime;
        addEntrytoTankDictionary(newTankEntry);
        tankRecordString += buildTankRecordString(newTankEntry);
      }
      if (tankRecord) {
        let tank = copyTankRecord(tankRecord);
        tank.location = siteName;
        tank.updatedAt = utcTime;
        tank.pressure = parseInt(tankPressure);
        tank.userId = nameValue;
        addEntrytoTankDictionary(tank);
        tankRecordString += buildTankRecordString(tank);
      }
    } else {
      if (tankId && tankPressure) {
        await offlineTankEntry(
          tankId,
          parseInt(tankPressure),
          site,
          utcTime,
          nameValue
        );
      }
    }

    // send the request
    const result = await setSiteFile(
      site,
      buildMobileNotes(data),
      "updating notes from researchFlow"
    );
    const tankResult = await setTankTracker(tankRecordString);

    let instMaintResult;
    let instMaintResult2;
    let badDataResult;

    // If a new instrument was added
    if (
      instrumentInput &&
      (!originalInstrument || originalInstrument != instrumentInput)
    ) {
      if (instrumentNames.includes(instrumentInput)) {
        const notes = installedInstrumentNotes(utcTime, nameValue, site);
        instMaintResult = await setInstrumentFile(
          `instrument_maint/LGR_UGGA/${instrumentInput}`,
          notes,
          `Updated ${instrumentInput}.md`,
          true,
          siteName
        );
      }
    }

    // If instrument was removed
    if (
      originalInstrument &&
      (!instrumentInput || originalInstrument != instrumentInput)
    ) {
      if (instrumentNames.includes(originalInstrument)) {
        const notes = removedInstrumentNotes(utcTime, nameValue, site);
        instMaintResult2 = await setInstrumentFile(
          `instrument_maint/LGR_UGGA/${originalInstrument}`,
          notes,
          `Updated ${originalInstrument}.md`,
          true,
          "WBB - Spare"
        );
      }
    }

    if (addToBadData) {
      let instrument = "";
      const badDataString = buildBadDataString(
        startDateValue,
        endDateValue,
        "all",
        "NA",
        nameValue,
        badDataReason,
        true
      );
      if (instrumentInput.includes("LGR")) {
        instrument = "lgr_ugga";
      }
      badDataResult = await setBadData(
        siteName,
        instrument,
        badDataString,
        `Update ${instrument}.csv`
      );
    }

    // if the warning popup is visible, remove it
    if (visible2) {
      setVisible2(false);
    }

    // hide loading screen when we have results
    setLoadingValue(false);

    // check to see if the request was ok, give a message based on that
    if (
      result.success &&
      tankResult.success &&
      (!instMaintResult || instMaintResult.success) &&
      (!instMaintResult2 || instMaintResult2.success) &&
      (!badDataResult || badDataResult.success)
    ) {
      setMessage("File updated successfully!");
      setMessageStatus("success");
      retHome(true);
    } else {
      if (result.error) {
        setMessage(`Error: ${result.error}`);
      } else if (tankResult.error) {
        setMessage(`Error: ${tankResult.error}`);
      } else if (instMaintResult && instMaintResult.error) {
        setMessage(`Error: ${instMaintResult.error}`);
      } else if (instMaintResult2 && instMaintResult2.error) {
        setMessage(`Error: ${instMaintResult2.error}`);
      } else if (badDataResult && badDataResult.error) {
        setMessage(`Error: ${badDataResult.error}`);
      }
      setMessageStatus("danger");
    }
    setTimeout(() => {
      setVisible(true);
      visibleRef.current = true;
    }, 100);
  };

  //method to navigate home to send to popup so it can happen after dismiss button is clicked
  function navigateHome(nav: boolean) {
    if (nav) {
      navigation.navigate("Home");
    }
  }

  //Set tank ids, values, and instruments if available in parsed data
  useEffect(() => {
    if (latestEntry) {
      if (latestEntry.tank) {
        const tankID = latestEntry.tank.id.split("_").pop();
        if (tankID) {
          const tankEntry =
            getLatestTankEntry(tankID) ||
            getLatestTankEntry(tankID.toLowerCase());
          if (tankEntry) {
            setTankRecord(tankEntry);
            setOriginalTank(tankEntry);
            setTankId(tankEntry.tankId);
            setTankValue(
              tankEntry.co2.toString() + " ~ " + tankEntry.ch4.toString()
            );
          }
        }
      }
      if (latestEntry.instrument) {
        setOriginalInstrument(latestEntry.instrument);
        setInstrumentInput(latestEntry.instrument);
      }
    }
  }, [latestEntry]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        automaticallyAdjustKeyboardInsets={true}
        keyboardShouldPersistTaps="handled"
      >
        <Layout style={styles.container}>
          {/* header */}
          <Text category="h1" style={{ textAlign: "center" }}>
            {site}
          </Text>

          {/* loading screen */}
          <LoadingScreen visible={loadingValue} />

          {/* success/failure popup */}
          <SuccessFailurePopup
            popupText={message}
            popupStatus={messageStatus}
            onPress={setVisible}
            navigateHome={navigateHome}
            visible={visible}
            returnHome={returnHome}
          />

          {/* popup if user has missing input */}
          <MissingInputPopup
            sendData={handleUpdate}
            removePopup={setVisible2}
            visible={visible2}
          />

          {/* text box for instrument */}
          <Select
            label={(evaProps) => (
              <Text
                {...evaProps}
                category="p2"
                style={{ color: isDarkMode ? "white" : "black" }}
              >
                Instrument
              </Text>
            )}
            onSelect={handleInstrumentUpdate}
            placeholder="Select Instrument"
            value={instrumentInput}
            style={styles.inputText}
          >
            <>
              {(instrumentNames ?? ["No Instruments Available"]).map(
                (instrument, index) => (
                  <SelectItem key={index} title={instrument} />
                )
              )}
              <SelectItem key="remove" title="Remove Instrument" />
              <SelectItem key="custom" title="Enter Instrument Name Manually" />
            </>
          </Select>

          {/* text inputs */}
          {/* Name input */}
          <TextInput
            labelText="Name"
            labelValue={nameValue}
            onTextChange={setNameValue}
            placeholder="First Last"
            style={styles.inputText}
          />

          {/* Time input */}
          <Text category="p2" style={{ marginTop: 8, marginLeft: 8 }}>
            Time Arrived (MT):
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
                textColor={isDarkMode ? "white" : "black"}
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

          <Text category="p2" style={{ marginTop: 8, marginLeft: 8 }}>
            Time Departed (MT):
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

          {showEndPicker && Platform.OS === "ios" && (
            <View>
              <DateTimePicker
                textColor={isDarkMode ? "white" : "black"}
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

          {showEndPicker && Platform.OS === "android" && (
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

          <CheckBox
            checked={addToBadData}
            onChange={setAddToBadData}
            style={{ margin: 15 }}
          >
            {(evaProps) => (
              <Text {...evaProps} category="p2">
                Add this time period to Bad Data?
              </Text>
            )}
          </CheckBox>

          {addToBadData && (
            <TextInput
              labelText="Reason for Bad Data"
              labelValue={badDataReason}
              onTextChange={setBadDataReason}
              placeholder="Describe why this data is invalid"
              style={styles.inputText}
            />
          )}

          {/* Tank input */}
          <Layout style={styles.rowContainer}>
            <Select
              label={"Tank (if needed)"}
              onSelect={(indexPath) => {
                const index = Array.isArray(indexPath)
                  ? indexPath[0].row
                  : indexPath.row;
                if (index === 0) {
                  handleTankChange();
                } else if (index === 1) {
                  clearTankEntry();
                }
              }}
              placeholder="Select Tank"
              value={tankId && tankValue ? `${tankId}: ${tankValue}` : ""}
              style={styles.inputText}
            >
              <SelectItem key={0} title={"Change tank"} />
              <SelectItem key={1} title={"Remove tank"} />
            </Select>
            <TextInput
              labelText=" "
              labelValue={tankPressure}
              onTextChange={setTankPressure}
              placeholder="psi"
              style={styles.tankInput}
            />
          </Layout>

          {/* notes entry */}
          <NoteInput
            labelText="Notes"
            labelValue={notesValue}
            onTextChange={setNotesValue}
            placeholder="Notes"
            multiplelines={true}
            style={styles.notesInput}
          />

          {/* submit button */}
          <Button
            onPress={() => checkTextEntries()}
            appearance="filled"
            status="primary"
            style={{ margin: 20, backgroundColor: "#06b4e0" }}
          >
            {(evaProps) => (
              <Text {...evaProps} category="h6" style={{ color: "black" }}>
                Submit
              </Text>
            )}
          </Button>
          <Modal visible={modalVisible} transparent animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Enter Instrument Name"
                  labelValue={customInstrument}
                  onTextChange={setCustomInstrument}
                />
                <Button
                  appearance="filled"
                  onPress={addCustomInstrument}
                  style={styles.modalButton}
                >
                  <Text category="h6" style={{ color: "black" }}>
                    Add Instrument
                  </Text>
                </Button>
                <Button
                  appearance="filled"
                  onPress={() => setModalVisible(false)}
                  style={styles.modalButton}
                >
                  <Text category="h6" style={{ color: "red" }}>
                    Cancel
                  </Text>
                </Button>
              </View>
            </View>
          </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  inputText: {
    flex: 2,
    margin: 8,
  },
  tankInput: {
    flex: 1,
    margin: 8,
  },
  notesInput: {
    flex: 1,
    margin: 8,
  },
  areaInput: {
    height: 200,
    margin: 10,
    width: 380,
    borderWidth: 1,
    padding: 10,
  },
  rowContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "stretch", // has button fill space horizontally
    justifyContent: "space-evenly",
  },
  modalButton: {
    backgroundColor: "#06b4e0",
  },
  modalInput: {
    width: "100%",
    borderBottomWidth: 1,
    marginBottom: 10,
    padding: 5,
  },
  submitButton: {
    margin: 20,
    backgroundColor: "#06b4e0",
  },
  datePicker: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 0,
    marginBottom: 8,
    marginRight: 8,
    marginLeft: 8,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#d3d3d3",
    backgroundColor: "#f9f9f9",
  },
  androidDateTime: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
