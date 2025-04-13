import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SelectSite from "./components/SelectSite";
import HomeScreen from "./components/HomeScreen";
import AddNotes from "./components/AddNotes";
import ViewNotes from "./components/ViewNotes";
import BadData from "./components/BadData";
import InstrumentMaintenance from "./components/InstrumentMaintenance";
import TankTracker from "./components/TankTracker";
import Auth from "./components/Auth";
import SelectInstrument from "./components/SelectInstrument";
import PlanVisit from "./components/PlanVisit";
import AddNotesMobile from "./components/AddNotesMobile";
import SelectNotes from "./components/SelectNotes";
import EmailSetup from "./components/EmailSetup";
import { ThemeContext } from "./components/ThemeContext";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import SelectTank from "./components/SelectTank";
import customColors from "./custom-theme.json";
import Calendar from "./components/Calendar";
import { useEffect, useState } from "react";
import SettingsButton from "./components/SettingsButton";
import ViewNotifications from "./components/ViewNotifications";
import ContactInfo from "./components/ContactInfo";
import EmailButton from "./components/EmailButton"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, LogBox } from "react-native";
import Diagnostics from "./components/Diagnostics";
import InfoButton from "./components/InfoButton";
import NotificationsButton from "./components/NotificationsButton";

const Stack = createStackNavigator();
type ThemeType = "light" | "dark";
/**
 * @author Blake Stambaugh, August O'Rourke, David Schiwal, Megan Ostlie 
 * This is the function Expo uses to glue all the individual Screens together, any app wide changes are also made here
 * @returns void
 */
export default function App() {
  // used for swapping between light and dark mode
  // Initialize state with a type
  // load the current theme
  LogBox.ignoreAllLogs(true)
  const [theme, setTheme] = useState<ThemeType>('light');
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("theme");
        if (savedTheme === "light" || savedTheme === "dark") {
          setTheme(savedTheme);
        }
      } catch (e) {
        console.error("Failed to retrieve the previous theme: ", e);
      }
    };
    loadTheme();
  }, []);

  // save the current theme
  useEffect(() => {
    const saveTheme = async () => {
      try {
        await AsyncStorage.setItem("theme", theme);
      } catch (e) {
        console.error("Failed to save the current theme: ", e);
      }
    };
    saveTheme();
  }, [theme]);

  // Merge custom theme with Eva's base theme
  const currentTheme = { ...eva[theme], ...customColors };

  // Function to toggle between light and dark themes
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={currentTheme}>
        <NavigationContainer>
          {/* loads the header buttons to all screens, some screens overwrite them with their own */}
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={({ navigation }) => ({
              headerRight: () => (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <InfoButton navigation={navigation} />
                  <NotificationsButton navigation={navigation} />
                  <SettingsButton />
                </View>
              ),
            })}
          >
            <Stack.Screen name="Login" component={Auth} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="SelectSite" component={SelectSite} />
            <Stack.Screen name="AddNotes" component={AddNotes} />
            <Stack.Screen name="ViewNotes" component={ViewNotes} />
            <Stack.Screen name="BadData" component={BadData} />
            <Stack.Screen name="InstrumentMaintenance" component={InstrumentMaintenance} />
            <Stack.Screen name="TankTracker" component={TankTracker} />
            <Stack.Screen name="SelectInstrument" component={SelectInstrument} />
            <Stack.Screen name="PlanVisit" component={PlanVisit} />
            <Stack.Screen name="SelectTank" component={SelectTank} />
            <Stack.Screen name="AddNotesMobile" component={AddNotesMobile} />
            <Stack.Screen name="SelectNotes" component={SelectNotes} />
            <Stack.Screen name="Calendar" component={Calendar} />
            <Stack.Screen name="Diagnostics" component={Diagnostics} />
            <Stack.Screen name="ViewNotifications" component={ViewNotifications}
              options={({ navigation }) => ({
                headerRight: () => (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <InfoButton navigation={navigation} />
                    <SettingsButton />
                  </View>
                ),
              })}
            />
            <Stack.Screen name="ContactInfo" component={ContactInfo}
              options={({ navigation }) => ({
                headerRight: () => (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <NotificationsButton navigation={navigation} />
                    <SettingsButton />
                  </View>
                ),
              })}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ApplicationProvider>
    </ThemeContext.Provider>
  );
}
