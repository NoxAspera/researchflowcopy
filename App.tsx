import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SelectSite from './pages/SelectSite'
import HomeScreen from './pages/HomeScreen'
import AddNotes from './pages/AddNotes'
import ViewNotes from './pages/ViewNotes'
import BadData from './pages/BadData'
import InstrumentMaintenance from './pages/InstrumentMaintenance'
import TankTracker from './pages/TankTracker'
import Auth from './pages/Auth'
import SelectInstrument from './pages/SelectInstrument';
import PlanVisit from './pages/PlanVisit';
import AddNotesMobile from './pages/AddNotesMobile';
import SelectNotes from './pages/SelectNotes';
import { ThemeContext } from './components/ThemeContext'
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import SelectTank from './pages/SelectTank';
import customColors from './custom-theme.json';
import Calendar from './pages/Calendar';
import { useEffect, useState } from 'react';
import SettingsButton from './components/SettingsButton';
import ViewNotifications from './components/ViewNotifications';
import ContactInfo from './pages/ContactInfo';
import EmailSetup from './pages/EmailSetup';
import { Button, Icon, IconElement } from '@ui-kitten/components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, LogBox } from 'react-native';
import Diagnostics from './pages/Diagnostics';
import EmailButton from './components/EmailButton';
import InfoButton from './components/InfoButton';
import NotificationsButton from './components/NotificationsButton';

const Stack = createStackNavigator();
type ThemeType = "light" | "dark";
/**
 * @author Blake Stambaugh, Callum O'Rourke, David Schiwal, Megan Ostlie 
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
                  <EmailButton navigation={navigation}/>
                  <SettingsButton />
                </View>
              ),
            })}
          >
            <Stack.Screen name="Login" component={Auth} 
              options={({ navigation }) => ({
                headerRight: () => (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <InfoButton navigation={navigation} />
                  </View>
                ),
              })}/>
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
                    <SettingsButton/>
                    <InfoButton navigation={navigation} />
                    <EmailButton navigation={navigation}/>
                  </View>
                ),
              })}
            />
            <Stack.Screen name="ContactInfo" component={ContactInfo}
              options={({ navigation }) => ({
                headerRight: () => (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <NotificationsButton navigation={navigation} />
                    <EmailButton navigation={navigation}/>
                    <SettingsButton/>
                  </View>
                ),
              })}
            />
            <Stack.Screen name="EmailSetup" component={EmailSetup}
              options={({ navigation }) => ({
                headerRight: () => (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <NotificationsButton navigation={navigation} />
                    <SettingsButton/>
                    <InfoButton navigation={navigation} />
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
