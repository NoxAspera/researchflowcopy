/**
 * Diagnostics
 * @author Megan Ostlie
 * 3/21/25
 *
 * This page is used for plotting up tank values and connecting to air.utah.edu diagnostics
 */
import { StyleSheet, KeyboardAvoidingView, Linking} from "react-native";
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