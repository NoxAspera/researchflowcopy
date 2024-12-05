/**
 * Select Site Page
 * @author Blake Stambaugh and Megan Ostlie
 * 12/5/24
 * 
 * This page is the lets the user select the site they are currently at. When they
 * choose an action on the home page, they will be directed to this screen to determine
 * their site. Once they have chosen a site, they will be sent to the page they requested
 * and all info for that site will be given.
 */
import { StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ApplicationProvider, Layout, Button } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { customTheme } from './CustomTheme'

// Define the type for the stack's navigation parameters
type RootStackParamList = {
  SelectSite: undefined; // Add any other screens with their params here
  AddNotes: { site: string };
  ViewNotes: { site: string };
  BadData: { site: string };
  InstrumentMaintenance: { site: string };
  TankTracker: { site: string };
};

// Type for the navigation prop for this screen
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SelectSite'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export default function SelectSite({navigation}: HomeScreenProps) {
  const route = useRoute();

  // previous buttons hit, used to know where to go next
  let from = route.params?.from;

  // data for buttons
  const buttonData = [
    { id: 1, label: 'CSP', onPress: () => navigation.navigate(from, {site: 'CSP'})},
    { id: 2, label: 'DBK', onPress: () => navigation.navigate(from, {site: 'DBK'})},
    { id: 3, label: 'FRU', onPress: () => navigation.navigate(from, {site: 'FRU'})},
    { id: 4, label: 'HDP', onPress: () => navigation.navigate(from, {site: 'HDP'})},
    { id: 5, label: 'SUG', onPress: () => navigation.navigate(from, {site: 'SUG'})},
    { id: 6, label: 'WBB', onPress: () => navigation.navigate(from, {site: 'WBB'})}
  ]

  return (
    <ApplicationProvider {...eva} theme={customTheme}>
      <Layout style={styles.container}>
        {buttonData.map((button) => (
          <Button
            key={button.id}
            style={styles.button}
            onPress={button.onPress}
          >
            {button.label}
          </Button>
        ))}
      </Layout>
    </ApplicationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    padding: 20,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: 'center',
  },
});
