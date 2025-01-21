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

const Stack = createStackNavigator();

export default function App() {
  return (
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
