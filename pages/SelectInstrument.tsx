/**
 * Select Instrument Page
 * @author Blake Stambaugh and Megan Ostlie
 * Updated: 1/14/25 - MO
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
import { fetchInstrumentNames, fetchSiteNames } from '../scripts/DataFetching';


export default function SelectInstrument({navigation}: NavigationType) {
  const route = useRoute<routeProp>();

  let from = route.params?.from;
  let notes = route.params?.notes;
  // State to hold the list of site names
  const [instrumentNames, setInstrumentNames] = useState<string[]>();

  useEffect(() => {
    fetchInstrumentNames(setInstrumentNames, from);
  }, [from]);

  // data for buttons
  let buttonData = [];

  if (instrumentNames) {
    for (let i = 0; i < instrumentNames.length; i++) {
      buttonData.push({ id: i+1, label: instrumentNames[i], onPress: () => handleConfirm(instrumentNames[i])});
    }
  } else {
    //alert("No instruments could be parsed.");
  }

  const handleConfirm = (selectedInstrument: string) => {
    if (notes) {
      navigation.navigate('ViewNotes', {site: `instrument_maint/${from}/${selectedInstrument}`});
    } else {
      navigation.navigate('InstrumentMaintenance', {site: `instrument_maint/${from}/${selectedInstrument}`}); 
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
    <Layout style={styles.container}>

      {buttonData.map((button) => (
        <Button key={button.id} style={styles.button} onPress={button.onPress}>
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
