/**
 * Select Site Page
 * @author Blake Stambaugh and Megan Ostlie
 * Updated: 1/14/25 - MO
 * 
 * This page is the lets the user select the site they are currently at. When they
 * choose an action on the home page, they will be directed to this screen to determine
 * their site. Once they have chosen a site, they will be sent to the page they requested
 * and all info for that site will be given.
 */
import { StyleSheet } from 'react-native';
import React, { Component, useEffect, useState } from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Layout, Button, Text } from '@ui-kitten/components';
import PopupProp from './Popup';
import { NavigationType, routeProp } from './types'
import { getBadDataSites, getDirectory } from '../scripts/APIRequests';


export default function SelectSite({navigation}: NavigationType) {
  // type routeProp = RouteProp<{params: RouteParams}, 'params'>;
  const route = useRoute<routeProp>();

  // previous buttons hit, used to know where to go next
  let from = route.params?.from;
  const [visible, setVisible] = useState(false);
  const [messageColor, setMessageColor] = useState("");
  const [message, setMessage] = useState("");
  // State to hold the list of site names
  const [siteNames, setSiteNames] = useState<string[]>();

  // Fetch site names from GitHub Repo
  useEffect(() => {
    const fetchSiteNames = async () => {
      try {
        let names;
        if (from === 'AddNotes' || from === 'ViewNotes') {
          names = await getDirectory("site_notes");
        } else if (from === 'BadData') {
          names = await getBadDataSites();
        } else if (from === 'InstrumentMaintenance') {
          names = await getDirectory("instrument_maint")
        }
        if(names?.success)
        {
          setSiteNames(names.data);
        } // Set the fetched site names
    }
      catch (error)
      {
        console.error("Error processing site names:", error);
      }
    };

    fetchSiteNames();
  }, [from]);

  // data for buttons
  let buttonData = [];

  if (from == 'AddNotes' || from == 'ViewNotes' || from == 'BadData' || from == 'InstrumentMaintenance') {
    if (siteNames) {
      for (let i = 0; i < siteNames.length; i++) {
        buttonData.push({ id: i+1, label: siteNames[i], onPress: () => handleConfirm(siteNames[i])});
      }
    }
  } 
  else {
    buttonData = [
      { id: 1, label: 'CSP', onPress: () => handleConfirm('CSP')},
      { id: 2, label: 'DBK', onPress: () => handleConfirm('DBK')},
      { id: 3, label: 'FRU', onPress: () => handleConfirm('FRU')},
      { id: 4, label: 'HDP', onPress: () => handleConfirm('HDP')},
      { id: 5, label: 'SUG', onPress: () => handleConfirm('SUG')},
      { id: 6, label: 'WBB', onPress: () => handleConfirm('WBB')}
    ];
  }

  const handleConfirm = (selectedSite: string) => {
    if(from === 'AddNotes')
    {
      navigation.navigate('AddNotes', {site: selectedSite}); //{site: selectValue} tells the AddNotes what the selected value is
    }
    else if(from === 'ViewNotes')
    {
      navigation.navigate('ViewNotes', {site: selectedSite}); //{site: selectValue} tells the AddNotes what the selected value is
    }
    else if(from === 'BadData')
    {
      navigation.navigate('BadData', {site: selectedSite}); //{site: selectValue} tells the AddNotes what the selected value is
    }
    else if (from === 'InstrumentMaintenance')
    {
      navigation.navigate('SelectInstrument', {from: selectedSite});
    }
    else if (from === 'TankTracker')
    {
      navigation.navigate('TankTracker', {site: selectedSite});
    }
    else if (from == 'PlanVisit'){
      navigation.navigate('PlanVisit', {site: selectedSite})
    }
  };

  return (
    <Layout style={styles.container}>
      <PopupProp
        popupText={message}
        popupColor={messageColor}
        onPress={setVisible}
        visible={visible}
      />

      {buttonData.map((button) => (
        <Button key={button.id} style={styles.button} onPress={button.onPress}>
          {(evaProps) => (
            <Text {...evaProps} category="h6" style={{ color: "black" }}>
              {button.label}
            </Text>
          )}
        </Button>
      ))}
    </Layout>
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
    backgroundColor: "#06b4e0"
  },
});
