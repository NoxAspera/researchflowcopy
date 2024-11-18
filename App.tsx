import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SelectSite from './components/SelectSite'
import HomeScreen from './components/HomeScreen'
import AddNotes from './components/AddNotes'
import ViewNotes from './components/ViewNotes'
import BadData from './components/BadData'
import SelectInstrument from './components/SelectInstrument'
import InstrumentMaintenance from './components/InstrumentMaintenance'
import SelectTank from './components/SelectTank'
import TankTracker from './components/TankTracker'

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Select Site" component={SelectSite} />
        <Stack.Screen name="Add Notes" component={AddNotes} />
        <Stack.Screen name="View Notes" component={ViewNotes} />
        <Stack.Screen name="Bad Data" component={BadData} />
        <Stack.Screen name="Select Instrument" component={SelectInstrument} />
        <Stack.Screen name="Instrument Maintenance" component={InstrumentMaintenance} />
        <Stack.Screen name="Select Tank" component={SelectTank} />
        <Stack.Screen name="Tank Tracker" component={TankTracker} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


