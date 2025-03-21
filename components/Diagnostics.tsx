/**
 * Diagnostics
 * @author Megan Ostlie
 * 3/21/25
 *
 * This page is used for plotting up tank values and connecting to air.utah.edu diagnostics
 */
import { StyleSheet, KeyboardAvoidingView, Linking} from "react-native";
import React, { useState, useEffect, useRef } from "react";
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
import { processNotes, ParsedData, Entry } from "../scripts/Parsers";

export default function Diagnostics({ navigation }: NavigationType) {
  const route = useRoute<routeProp>();
  let site = route.params?.site;
  const themeContext = React.useContext(ThemeContext);
  const isDarkMode = themeContext.theme === 'dark';
  let siteName = site;
  if (site.includes("mobile/")) {
    siteName = site.replace("mobile/", "");
  }
  let date = new Date();
  let year = date.getFullYear();
  let month = String(date.getMonth() + 1).padStart(2, '0');
  let day = String(date.getDate()).padStart(2, '0');
  let today = `${year}-${month}-${day}`;

  date.setDate(date.getDate() - 7);
  year = date.getFullYear();
  month = String(date.getMonth() + 1).padStart(2, '0');
  day = String(date.getDate()).padStart(2, '0');
  let lastWeek = `${year}-${month}-${day}`;

  const openURL = async () => {
      const url =
      `https://air.utah.edu/s/diagnostics/?_inputs_&remove_failed_qc=false&color_by=%22QAQC_Flag%22&dates=%5B%22${lastWeek}%22%2C%22${today}%22%5D&column=%22%22&lvl=%22%22&instrument=%22%22&stid=%22${siteName}%22&submit=0&sidebarCollapsed=false&sidebarItemExpanded=null`;
  
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        alert("Cannot open the URL");
      }
    };

  // State to hold parsed data
  const [data, setData] = useState<ParsedData | null>(null);
  const [lowPressures, setLowPressures] = useState<number[] | null>(null);
  const [midPressures, setMidPressures] = useState<number[] | null>(null);
  const [highPressures, setHighPressures] = useState<number[] | null>(null);
  const [ltsPressures, setLTSPressures] = useState<number[] | null>(null);
  const [n2Pressures, setN2Pressures] = useState<number[] | null>(null);
  
  // Get current notes for the site
  useEffect(() => {
    async function fetchData() {
      if (site && !data) {
        try {
            const parsedData = await processNotes(site);
            setData(parsedData); // Update state with the latest entry
          } catch (error) {
              console.error("Error processing notes:", error);
          }
      }
    }
    fetchData();
  }, [site]); // Re-run if `site` changes

  const extractNumericValue = (pressure: string | null): number | null => {
    if (!pressure) return null; // Handle null or undefined
    const match = pressure.match(/\d+(\.\d+)?/); // Match integer or decimal numbers
    return match ? parseFloat(match[0]) : null; // Return the matched number as a string
  };

  const getTankPressures = (entries: Entry[]) => {
    return {
      low_cal: entries
      .map(entry => extractNumericValue(entry.low_cal?.pressure)) // Extract low_cal.pressure values (or undefined if null)
      .filter(pressure => pressure !== undefined && pressure !== null), // Remove null/undefined values
      mid_cal: entries
      .map(entry => extractNumericValue(entry.mid_cal?.pressure)) // Extract mid_cal.pressure values (or undefined if null)
      .filter(pressure => pressure !== undefined && pressure !== null), // Remove null/undefined values
      high_cal: entries
      .map(entry => extractNumericValue(entry.high_cal?.pressure)) // Extract high_cal.pressure values (or undefined if null)
      .filter(pressure => pressure !== undefined && pressure !== null), // Remove null/undefined values
      lts: entries
      .map(entry => extractNumericValue(entry.lts?.pressure)) // Extract lts.pressure values (or undefined if null)
      .filter(pressure => pressure !== undefined && pressure !== null), // Remove null/undefined values
      n2: entries
      .map(entry => extractNumericValue(entry?.n2_pressure)) // Extract n2_pressure values (or undefined if null)
      .filter(pressure => pressure !== undefined && pressure !== null), // Remove null/undefined values
    };
  };

  useEffect(() => {
    function getPressures() {
      if (data) {
        const pressures = getTankPressures(data.entries);
        setLowPressures(pressures.low_cal);
        setMidPressures(pressures.mid_cal);
        setHighPressures(pressures.high_cal);
        setLTSPressures(pressures.lts);
        setN2Pressures(pressures.n2);
      }
    }
    getPressures();
  }, [data]);
  console.log(midPressures);
  
  return (
    <KeyboardAvoidingView
      behavior = "padding"
      style={styles.container}
    >
      <ScrollView automaticallyAdjustKeyboardInsets={true} keyboardShouldPersistTaps='handled'>
          {/* button for air.utah.edu */}
          <Button
            onPress={() => openURL()}
            appearance="filled"
            status="primary"
            style={styles.submitButton}
          >
          {evaProps => <Text {...evaProps} category="h6" style={{color: "black"}}>Diagnostics</Text>}
          </Button>
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