/**
 * Home Screen
 * @author Blake Stambaugh
 * 11/26/2024
 * 
 * The follow code represents the home page the user sees when they first launch our app.
 * It has a button for each section of the app that will take them to the next page.
**/ 
import { StyleSheet, View, TouchableOpacity, ScrollView, TouchableWithoutFeedback, ImageBackground, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import HomeButtonProp from './HomeButtonProp';
import { NaviProp } from './types';
import { ApplicationProvider, Layout, Text } from '@ui-kitten/components'
import * as eva from '@eva-design/eva';
import { customTheme } from './CustomTheme'
import React from 'react';

export default function HomeScreen({ navigation }) {
  return (
    <ApplicationProvider {...eva} theme={customTheme}>
      <Layout style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              
            {/* Add Notes */}
            <HomeButtonProp text='ADD NOTES' 
              onPress={() => navigation.navigate('SelectSite', {from: 'AddNotes'})} />

            {/* VIEW PAST NOTES */}
            <HomeButtonProp text='VIEW NOTES' 
              onPress={() => navigation.navigate('SelectSite', {from: 'ViewNotes'})} />

            {/* BAD DATA */}
            <HomeButtonProp text='BAD DATA' 
              onPress={() => navigation.navigate('SelectSite', {from: 'BadData'})} />

            {/* INSTRUMENT MAINTENENCE */}
            <HomeButtonProp text='INSTRUMENT MAINTENENCE' 
              onPress={() => navigation.navigate('SelectSite', {from: 'InstrumentMaintenance'})} />

            {/* TANK TRACKER */}
            <HomeButtonProp text='TANK TRACKER' 
              onPress={() => navigation.navigate('SelectSite', {from: 'TankTracker'})} />
            
            {/* PLAN A VISIT */}
            <HomeButtonProp text='PLAN A VISIT' 
              onPress={() => navigation.navigate('SelectSite', {from: 'TankTracker'})} />

            </ScrollView>
        </Layout>
    </ApplicationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',        // has button fill space horizontally
    justifyContent: 'space-evenly',
  },
  scrollContainer: {
    paddingVertical: 16,
    alignItems: 'center', // Center cards horizontally
  },
});
