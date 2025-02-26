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
import ViewNotifications from './components/ViewNotifications';
import { NavigationType } from './components/types';
import { Button, Icon, IconElement } from '@ui-kitten/components';
import CalendarScreen from './components/Calendar';

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
  const bellIcon = (props): IconElement => <Icon {...props} name='bell-outline' />;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={currentTheme}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={Auth} options={{ headerRight: () => <SettingsButton/>}}/>
            <Stack.Screen name="Home" component={HomeScreen} options={({ navigation }) => ({
              headerRight: () => (
                [<Button testID='notificationsButton'
                    onPress={() => navigation.navigate('ViewNotifications')} 
                    appearance="ghost"
                    accessoryLeft={bellIcon} 
                    size='large'/>,
                <SettingsButton/>]
              ),
            })}/>
            <Stack.Screen name="SelectSite" component={SelectSite} options={({ navigation }) => ({
              headerRight: () => (
                [<Button testID='notificationsButton'
                    onPress={() => navigation.navigate('ViewNotifications')} 
                    appearance="ghost"
                    accessoryLeft={bellIcon} 
                    size='large'/>,
                <SettingsButton/>]
              ),
            })}/>
            <Stack.Screen name="AddNotes" component={AddNotes} options={({ navigation }) => ({
              headerRight: () => (
                [<Button testID='notificationsButton'
                    onPress={() => navigation.navigate('ViewNotifications')} 
                    appearance="ghost"
                    accessoryLeft={bellIcon} 
                    size='large'/>,
                <SettingsButton/>]
              ),
            })}/>
            <Stack.Screen name="ViewNotes" component={ViewNotes} options={({ navigation }) => ({
              headerRight: () => (
                [<Button testID='notificationsButton'
                    onPress={() => navigation.navigate('ViewNotifications')} 
                    appearance="ghost"
                    accessoryLeft={bellIcon} 
                    size='large'/>,
                <SettingsButton/>]
              ),
            })}/>
            <Stack.Screen name="BadData" component={BadData} options={({ navigation }) => ({
              headerRight: () => (
                [<Button testID='notificationsButton'
                    onPress={() => navigation.navigate('ViewNotifications')} 
                    appearance="ghost"
                    accessoryLeft={bellIcon} 
                    size='large'/>,
                <SettingsButton/>]
              ),
            })}/>
            <Stack.Screen name="InstrumentMaintenance" component={InstrumentMaintenance} options={({ navigation }) => ({
              headerRight: () => (
                [<Button testID='notificationsButton'
                    onPress={() => navigation.navigate('ViewNotifications')} 
                    appearance="ghost"
                    accessoryLeft={bellIcon} 
                    size='large'/>,
                <SettingsButton/>]
              ),
            })}/>
            <Stack.Screen name="TankTracker" component={TankTracker} options={({ navigation }) => ({
              headerRight: () => (
                [<Button testID='notificationsButton'
                    onPress={() => navigation.navigate('ViewNotifications')} 
                    appearance="ghost"
                    accessoryLeft={bellIcon} 
                    size='large'/>,
                <SettingsButton/>]
              ),
            })}/>
            <Stack.Screen name="SelectInstrument" component={SelectInstrument} options={({ navigation }) => ({
              headerRight: () => (
                [<Button testID='notificationsButton'
                    onPress={() => navigation.navigate('ViewNotifications')} 
                    appearance="ghost"
                    accessoryLeft={bellIcon} 
                    size='large'/>,
                <SettingsButton/>]
              ),
            })}/>
            <Stack.Screen name="PlanVisit" component={PlanVisit} options={({ navigation }) => ({
              headerRight: () => (
                [<Button testID='notificationsButton'
                    onPress={() => navigation.navigate('ViewNotifications')} 
                    appearance="ghost"
                    accessoryLeft={bellIcon} 
                    size='large'/>,
                <SettingsButton/>]
              ),
            })}/>
            <Stack.Screen name="SelectTank" component={SelectTank} options={({ navigation }) => ({
              headerRight: () => (
                [<Button testID='notificationsButton'
                    onPress={() => navigation.navigate('ViewNotifications')} 
                    appearance="ghost"
                    accessoryLeft={bellIcon} 
                    size='large'/>,
                <SettingsButton/>]
              ),
            })}/>
            <Stack.Screen name="AddNotesMobile" component={AddNotesMobile} options={({ navigation }) => ({
              headerRight: () => (
                [<Button testID='notificationsButton'
                    onPress={() => navigation.navigate('ViewNotifications')} 
                    appearance="ghost"
                    accessoryLeft={bellIcon} 
                    size='large'/>,
                <SettingsButton/>]
              ),
            })}/>
            <Stack.Screen name="SelectNotes" component={SelectNotes} options={({ navigation }) => ({
              headerRight: () => (
                [<Button testID='notificationsButton'
                    onPress={() => navigation.navigate('ViewNotifications')} 
                    appearance="ghost"
                    accessoryLeft={bellIcon} 
                    size='large'/>,
                <SettingsButton/>]
              ),
            })}/>
            <Stack.Screen name="Calendar" component={CalendarScreen} options={({ navigation }) => ({
              headerRight: () => (
                [<Button testID='notificationsButton'
                    onPress={() => navigation.navigate('ViewNotifications')} 
                    appearance="ghost"
                    accessoryLeft={bellIcon} 
                    size='large'/>,
                <SettingsButton/>]
              ),
            })}/>
            <Stack.Screen name="ViewNotifications" component={ViewNotifications} options={{ headerRight: () => <SettingsButton/>}}/>
          </Stack.Navigator>
        </NavigationContainer>
      </ApplicationProvider>
    </ThemeContext.Provider>
  );
}
