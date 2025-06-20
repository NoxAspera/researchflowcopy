/**
 * Select Site Page
 * @author Blake Stambaugh and Megan Ostlie
 * Updated: 2/6/25 - MO
 * 
 * This page is the lets the user select the site they are currently at. When they
 * choose an action on the home page, they will be directed to this screen to determine
 * their site. Once they have chosen a site, they will be sent to the page they requested
 * and all info for that site will be given.
 */
import { StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { Layout, Button, Text } from '@ui-kitten/components';
import { NavigationType, routeProp } from '../components/types'
import { ScrollView } from 'react-native-gesture-handler';
import { fetchSiteNames } from '../scripts/DataFetching';


export default function SelectSite({navigation}: NavigationType) {
  // type routeProp = RouteProp<{params: RouteParams}, 'params'>;
  const route = useRoute<routeProp>();

  // previous buttons hit, used to know where to go next
  let from = route.params?.from;
  // State to hold the list of site names
  const [siteNames, setSiteNames] = useState<string[]>();

  // Fetch site names from GitHub Repo
  useEffect(() => {
    fetchSiteNames(from, setSiteNames);
  }, [from]);

  // data for buttons
  let buttonData = [];

  // Creates buttons for each site
  if (siteNames) {
    for (let i = 0; i < siteNames.length; i++) {
      if (siteNames[i]) {

        if(siteNames[i] === "mobile")
        {
          continue
        }
        buttonData.push({ id: i+1, label: siteNames[i], onPress: () => handleConfirm(siteNames[i])});
      }
    }

  }

  // Determines which screen to navigate to next
  const handleConfirm = (selectedSite: string) => {
    if(from === 'AddNotes')
    {
      if (selectedSite.includes("mobile/")) {
        navigation.navigate('AddNotesMobile', {site: selectedSite});
      } else {
        navigation.navigate('AddNotes', {site: selectedSite}); //{site: selectValue} tells the AddNotes what the selected value is
      }
    }
    else if(from === 'ViewNotes')
    {
      navigation.navigate('ViewNotes', {site: `site_notes/${selectedSite}`, from: "", visits: undefined}); //{site: selectValue} tells the AddNotes what the selected value is
    }
    else if(from === 'BadData')
    {
      navigation.navigate('BadData', {site: selectedSite}); //{site: selectValue} tells the AddNotes what the selected value is
    }
    else if (from === 'InstrumentMaintenance')
    {
      navigation.navigate('SelectInstrument', {from: selectedSite, notes: false});
    }
    else if (from === 'InstrumentMaintenanceNotes') {
      navigation.navigate('SelectInstrument', {from: selectedSite, notes: true});
    }
    else if (from === 'TankTracker')
    {
      navigation.navigate('TankTracker', {site: selectedSite});
    }
    else if (from === 'PlanVisit'){
      navigation.navigate('PlanVisit', {site: selectedSite});
    }
    else if (from === 'Diagnostics') {
      navigation.navigate('Diagnostics', {site: selectedSite});
    }
  };

  return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <Layout style={styles.container}>

        {buttonData.map((button) => (
          <Button
            key={button.id}
            style={styles.button}
            onPress={button.onPress}
          >
          {evaProps => <Text {...evaProps} category="h6" style={{color: "black"}}>{button.label}</Text>}
            
          </Button>
        ))}
      </Layout>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 20,
    paddingVertical: 20,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: "#06b4e0",
    margin: 8
  },
  
});