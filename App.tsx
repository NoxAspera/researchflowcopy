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
import { ThemeContext } from './components/theme-context'
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import SelectTank from './components/SelectTank';
import customColors from './custom-theme.json'
import { useState } from 'react';

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
      <ApplicationProvider {...eva} theme={currentTheme}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
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
          </Stack.Navigator>
        </NavigationContainer>
      </ApplicationProvider>
    </ThemeContext.Provider>
  );
}
