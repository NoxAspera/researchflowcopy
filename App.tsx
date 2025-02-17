import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SelectSite from './components/SelectSite'
import HomeScreen from './components/HomeScreen'
import AddNotes from './components/AddNotes'
import ViewNotes from './components/ViewNotes'
import BadData from './components/BadData'
import InstrumentMaintenance from './components/InstrumentMaintenance'
import TankTracker from './components/TankTracker'
import Auth from './components/Auth'
import SelectInstrument from './components/SelectInstrument';
import PlanVisit from './components/PlanVisit';
import AddNotesMobile from './components/AddNotesMobile';
import SelectNotes from './components/SelectNotes';
import { ThemeContext } from './components/ThemeContext'
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import SelectTank from './components/SelectTank';
import customColors from './custom-theme.json'
import { useState } from 'react';
import SettingsButton from './components/SettingsButton';

const Stack = createStackNavigator();
type ThemeType = 'light' | 'dark';

export default function App() {
  // used for swapping between light and dark mode
  // Initialize state with a type
  const [theme, setTheme] = useState<ThemeType>('light');

  // Merge custom theme with Eva's base theme
  const currentTheme = { ...eva[theme], ...customColors };

  // Function to toggle between light and dark themes
  const toggleTheme = () => {
      setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={currentTheme}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={Auth} options={{ headerRight: () => <SettingsButton/>}}/>
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerRight: () => <SettingsButton/>}}/>
            <Stack.Screen name="SelectSite" component={SelectSite} options={{ headerRight: () => <SettingsButton/>}}/>
            <Stack.Screen name="AddNotes" component={AddNotes} options={{ headerRight: () => <SettingsButton/>}}/>
            <Stack.Screen name="ViewNotes" component={ViewNotes} options={{ headerRight: () => <SettingsButton/>}}/>
            <Stack.Screen name="BadData" component={BadData} options={{ headerRight: () => <SettingsButton/>}}/>
            <Stack.Screen name="InstrumentMaintenance" component={InstrumentMaintenance} options={{ headerRight: () => <SettingsButton/>}}/>
            <Stack.Screen name="TankTracker" component={TankTracker} options={{ headerRight: () => <SettingsButton/>}}/>
            <Stack.Screen name="SelectInstrument" component={SelectInstrument} options={{ headerRight: () => <SettingsButton/>}}/>
            <Stack.Screen name="PlanVisit" component={PlanVisit} options={{ headerRight: () => <SettingsButton/>}}/>
            <Stack.Screen name="SelectTank" component={SelectTank} options={{ headerRight: () => <SettingsButton/>}}/>
            <Stack.Screen name="AddNotesMobile" component={AddNotesMobile} options={{ headerRight: () => <SettingsButton/>}}/>
            <Stack.Screen name="SelectNotes" component={SelectNotes} options={{ headerRight: () => <SettingsButton/>}}/>
            <Stack.Screen name ="Calendar" component={Calendar} options={{headerRight: () => <SettingsButton/>}}/>
          </Stack.Navigator>
        </NavigationContainer>
      </ApplicationProvider>
    </ThemeContext.Provider>
  );
}
