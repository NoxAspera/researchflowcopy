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
import { View } from 'react-native';
import Diagnostics from './pages/Diagnostics';

const Stack = createStackNavigator();
type ThemeType = 'light' | 'dark';

export default function App() {
  // used for swapping between light and dark mode
  // Initialize state with a type
  const [theme, setTheme] = useState<ThemeType>('light');
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme === 'light' || savedTheme === 'dark') {
          setTheme(savedTheme);
        }
      } catch (e) {
        console.error("Failed to retrieve the previous theme: ", e);
      }
    }
    loadTheme();
  }, []);
  
  useEffect(() => {
    const saveTheme = async () => {
      try {
        await AsyncStorage.setItem('theme', theme);
      } catch (e) {
        console.error("Failed to save the current theme: ", e);
      }
    }
    saveTheme();
  }, [theme]);


  // Merge custom theme with Eva's base theme
  const currentTheme = { ...eva[theme], ...customColors };

  // Function to toggle between light and dark themes
  const toggleTheme = () => {
      setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  const bellIcon = (props): IconElement => <Icon {...props} name='bell-outline' />;
  const infoIcon = (props): IconElement => <Icon {...props} name='info-outline' />;
  const emailIcon = (props): IconElement => <Icon {...props} name='email-outline' />;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={currentTheme}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={Auth} options={{ headerRight: () => <SettingsButton/>}}/>
            <Stack.Screen name="Home" component={HomeScreen} options={({ navigation }) => ({
              headerRight: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Button testID='infoButton'
                  onPress={() => navigation.navigate('ContactInfo')} 
                  appearance="ghost"
                  accessoryLeft={infoIcon} 
                  size='large'
                  style={{ marginHorizontal: -15 }}/>
                  <Button testID='notificationsButton'
                  onPress={() => navigation.navigate('ViewNotifications')} 
                  appearance="ghost"
                  accessoryLeft={bellIcon} 
                  size='large'
                  style={{ marginHorizontal: -10 }}/>
                  <Button testID='notificationsButton'
                  onPress={() => navigation.navigate('EmailSetup')} 
                  appearance="ghost"
                  accessoryLeft={emailIcon} 
                  size='large'
                  style={{ marginHorizontal: -15 }}/>
                <SettingsButton/>
                </View>
              ),
            })}/>
            <Stack.Screen name="SelectSite" component={SelectSite} options={({ navigation }) => ({
              headerRight: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Button testID='infoButton'
                  onPress={() => navigation.navigate('ContactInfo')} 
                  appearance="ghost"
                  accessoryLeft={infoIcon} 
                  size='large'
                  style={{ marginHorizontal: -10 }}/>
                  <Button testID='notificationsButton'
                    onPress={() => navigation.navigate('ViewNotifications')} 
                    appearance="ghost"
                    accessoryLeft={bellIcon} 
                    size='large'
                    style={{ marginHorizontal: -10 }}/>
                <SettingsButton/>
                </View>
              ),
            })}/>
            <Stack.Screen name="AddNotes" component={AddNotes} options={({ navigation }) => ({
              headerRight: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Button testID='infoButton'
                  onPress={() => navigation.navigate('ContactInfo')} 
                  appearance="ghost"
                  accessoryLeft={infoIcon} 
                  size='large'
                  style={{ marginHorizontal: -10 }}/>
                  <Button testID='notificationsButton'
                    onPress={() => navigation.navigate('ViewNotifications')} 
                    appearance="ghost"
                    accessoryLeft={bellIcon} 
                    size='large'
                    style={{ marginHorizontal: -10 }}/>
                <SettingsButton/>
                </View>
              ),
            })}/>
            <Stack.Screen name="ViewNotes" component={ViewNotes} options={({ navigation }) => ({
              headerRight: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Button testID='infoButton'
                  onPress={() => navigation.navigate('ContactInfo')} 
                  appearance="ghost"
                  accessoryLeft={infoIcon} 
                  size='large'
                  style={{ marginHorizontal: -10 }}/>
                  <Button testID='notificationsButton'
                    onPress={() => navigation.navigate('ViewNotifications')} 
                    appearance="ghost"
                    accessoryLeft={bellIcon} 
                    size='large'
                    style={{ marginHorizontal: -10 }}/>
                <SettingsButton/>
                </View>
              ),
            })}/>
            <Stack.Screen name="BadData" component={BadData} options={({ navigation }) => ({
              headerRight: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Button testID='infoButton'
                  onPress={() => navigation.navigate('ContactInfo')} 
                  appearance="ghost"
                  accessoryLeft={infoIcon} 
                  size='large'
                  style={{ marginHorizontal: -10 }}/>
                  <Button testID='notificationsButton'
                    onPress={() => navigation.navigate('ViewNotifications')} 
                    appearance="ghost"
                    accessoryLeft={bellIcon} 
                    size='large'
                    style={{ marginHorizontal: -10 }}/>
                <SettingsButton/>
                </View>
              ),
            })}/>
            <Stack.Screen name="InstrumentMaintenance" component={InstrumentMaintenance} options={({ navigation }) => ({
              title: "Maintenance",
              headerRight: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Button testID='infoButton'
                  onPress={() => navigation.navigate('ContactInfo')} 
                  appearance="ghost"
                  accessoryLeft={infoIcon} 
                  size='large'
                  style={{ marginHorizontal: -10 }}/>
                  <Button testID='notificationsButton'
                    onPress={() => navigation.navigate('ViewNotifications')} 
                    appearance="ghost"
                    accessoryLeft={bellIcon} 
                    size='large'
                    style={{ marginHorizontal: -10 }}/>
                <SettingsButton/>
                </View>
              ),
            })}/>
            <Stack.Screen name="TankTracker" component={TankTracker} options={({ navigation }) => ({
              headerRight: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Button testID='infoButton'
                  onPress={() => navigation.navigate('ContactInfo')} 
                  appearance="ghost"
                  accessoryLeft={infoIcon} 
                  size='large'
                  style={{ marginHorizontal: -10 }}/>
                  <Button testID='notificationsButton'
                    onPress={() => navigation.navigate('ViewNotifications')} 
                    appearance="ghost"
                    accessoryLeft={bellIcon} 
                    size='large'
                    style={{ marginHorizontal: -10 }}/>
                <SettingsButton/>
                </View>
              ),
            })}/>
            <Stack.Screen name="SelectInstrument" component={SelectInstrument} options={({ navigation }) => ({
              headerRight: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Button testID='infoButton'
                  onPress={() => navigation.navigate('ContactInfo')} 
                  appearance="ghost"
                  accessoryLeft={infoIcon} 
                  size='large'
                  style={{ marginHorizontal: -10 }}/>
                  <Button testID='notificationsButton'
                    onPress={() => navigation.navigate('ViewNotifications')} 
                    appearance="ghost"
                    accessoryLeft={bellIcon} 
                    size='large'
                    style={{ marginHorizontal: -10 }}/>
                <SettingsButton/>
                </View>
              ),
            })}/>
            <Stack.Screen name="PlanVisit" component={PlanVisit} options={({ navigation }) => ({
              headerRight: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Button testID='infoButton'
                  onPress={() => navigation.navigate('ContactInfo')} 
                  appearance="ghost"
                  accessoryLeft={infoIcon} 
                  size='large'
                  style={{ marginHorizontal: -10 }}/>
                  <Button testID='notificationsButton'
                    onPress={() => navigation.navigate('ViewNotifications')} 
                    appearance="ghost"
                    accessoryLeft={bellIcon} 
                    size='large'
                    style={{ marginHorizontal: -10 }}/>
                <SettingsButton/>
                </View>
              ),
            })}/>
            <Stack.Screen name="SelectTank" component={SelectTank} options={({ navigation }) => ({
              headerRight: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Button testID='infoButton'
                  onPress={() => navigation.navigate('ContactInfo')} 
                  appearance="ghost"
                  accessoryLeft={infoIcon} 
                  size='large'
                  style={{ marginHorizontal: -10 }}/>
                  <Button testID='notificationsButton'
                    onPress={() => navigation.navigate('ViewNotifications')} 
                    appearance="ghost"
                    accessoryLeft={bellIcon} 
                    size='large'
                    style={{ marginHorizontal: -10 }}/>
                <SettingsButton/>
                </View>
              ),
            })}/>
            <Stack.Screen name="AddNotesMobile" component={AddNotesMobile} options={({ navigation }) => ({
              headerRight: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Button testID='infoButton'
                  onPress={() => navigation.navigate('ContactInfo')} 
                  appearance="ghost"
                  accessoryLeft={infoIcon} 
                  size='large'
                  style={{ marginHorizontal: -10 }}/>
                  <Button testID='notificationsButton'
                    onPress={() => navigation.navigate('ViewNotifications')} 
                    appearance="ghost"
                    accessoryLeft={bellIcon} 
                    size='large'
                    style={{ marginHorizontal: -10 }}/>
                <SettingsButton/>
                </View>
              ),
            })}/>
            <Stack.Screen name="SelectNotes" component={SelectNotes} options={({ navigation }) => ({
              headerRight: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Button testID='infoButton'
                  onPress={() => navigation.navigate('ContactInfo')} 
                  appearance="ghost"
                  accessoryLeft={infoIcon} 
                  size='large'
                  style={{ marginHorizontal: -10 }}/>
                  <Button testID='notificationsButton'
                    onPress={() => navigation.navigate('ViewNotifications')} 
                    appearance="ghost"
                    accessoryLeft={bellIcon} 
                    size='large'
                    style={{ marginHorizontal: -10 }}/>
                <SettingsButton/>
                </View>
              ),
            })}/>
            <Stack.Screen name="Calendar" component={Calendar} options={({ navigation }) => ({
              headerRight: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Button testID='infoButton'
                  onPress={() => navigation.navigate('ContactInfo')} 
                  appearance="ghost"
                  accessoryLeft={infoIcon} 
                  size='large'
                  style={{ marginHorizontal: -10 }}/>
                <Button testID='notificationsButton'
                  onPress={() => navigation.navigate('ViewNotifications')} 
                  appearance="ghost"
                  accessoryLeft={bellIcon} 
                  size='large'
                  style={{ marginHorizontal: -10 }}/>
                <SettingsButton/>
                </View>
              ),
            })}/>
            <Stack.Screen name="Diagnostics" component={Diagnostics} options={({ navigation }) => ({
              headerRight: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Button testID='infoButton'
                  onPress={() => navigation.navigate('ContactInfo')} 
                  appearance="ghost"
                  accessoryLeft={infoIcon} 
                  size='large'
                  style={{ marginHorizontal: -10 }}/>
                  <Button testID='notificationsButton'
                    onPress={() => navigation.navigate('ViewNotifications')} 
                    appearance="ghost"
                    accessoryLeft={bellIcon} 
                    size='large'
                    style={{ marginHorizontal: -10 }}/>
                <SettingsButton/>
                </View>
              ),
            })}/>
            <Stack.Screen name="ViewNotifications" component={ViewNotifications} options={{ headerRight: () => <SettingsButton/>}}/>
            <Stack.Screen name="ContactInfo" component={ContactInfo} options={{ headerRight: () => <SettingsButton/>}}/>
            <Stack.Screen name="EmailSetup" component={EmailSetup} options={{ headerRight: () => <SettingsButton/>}}/>
          </Stack.Navigator>
        </NavigationContainer>
      </ApplicationProvider>
    </ThemeContext.Provider>
  );
}
