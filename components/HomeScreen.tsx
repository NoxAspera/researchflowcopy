/**
 * Home Screen
 * @author Blake Stambaugh
 * 11/26/2024
 * 
 * The follow code represents the home page the user sees when they first launch our app.
 * It has a button for each section of the app that will take them to the next page.
**/ 
import { StyleSheet, View, TouchableOpacity, ScrollView, TouchableWithoutFeedback, ImageBackground, Image, Dimensions } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import HomeButtonProp from './HomeButtonProp';
import { NaviProp } from './types';
import { ApplicationProvider, Layout, Text } from '@ui-kitten/components'
import * as eva from '@eva-design/eva';
import { customTheme } from './CustomTheme'
import React from 'react';
import { NavigationType } from './types'
const { width, height } = Dimensions.get("window"); //this pulls in the screen width and height to use for scalars

export default function HomeScreen({ navigation }: NavigationType) {
  return (
    <ApplicationProvider {...eva} theme={customTheme}>
      <Layout style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              
            {/* Add Notes */}
            <HomeButtonProp text='ADD NOTES' color="#AEDD94"
              onPress={() => navigation.navigate('SelectSite', {from: 'AddNotes'})} />

            {/* VIEW PAST NOTES */}
            <HomeButtonProp text='VIEW NOTES' color="#EBEBEB"
              onPress={() => navigation.navigate('SelectSite', {from: 'ViewNotes'})} />

            {/* BAD DATA */}
            <HomeButtonProp text='BAD DATA' color="#FF8A84"
              onPress={() => navigation.navigate('SelectSite', {from: 'BadData'})} />

            {/* INSTRUMENT MAINTENENCE */}
            <HomeButtonProp text='INSTRUMENT MAINTENENCE' color="#FEF8A0"
              onPress={() => navigation.navigate('SelectSite', {from: 'InstrumentMaintenance'})} />

            {/* TANK TRACKER */}
            <HomeButtonProp text='TANK TRACKER' color="#4DD7FA"
              onPress={() => navigation.navigate('SelectSite', {from: 'TankTracker'})} />
            
            {/* PLAN A VISIT */}
            <HomeButtonProp text='PLAN A VISIT' color="#FFC581"
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
