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
import { RouteProp, useRoute } from '@react-navigation/native';
import { Layout, Button, Text } from '@ui-kitten/components';
import PopupProp from './Popup';
import { NavigationType, routeProp } from './types'
import { getBadDataSites, getDirectory } from '../scripts/APIRequests';
import { ScrollView } from 'react-native-gesture-handler';


export default function SelectInstrument({navigation}: NavigationType) {
  const route = useRoute<routeProp>();

  let from = route.params?.from;
  let notes = route.params?.notes;
  const [visible, setVisible] = useState(false);
  const [messageColor, setMessageColor] = useState("");
  const [message, setMessage] = useState("");
  // State to hold the list of site names
  const [instrumentNames, setInstrumentNames] = useState<string[]>();

  // Fetch site names from GitHub Repo
  useEffect(() => {
    const fetchSiteNames = async () => {
      try {
        let names = await getDirectory(`instrument_maint/${from}`);

        if(names?.success)
        {
          setInstrumentNames(names.data);
        } // Set the fetched site names
    }
      catch (error)
      {
        console.error("Error processing instrument names:", error);
      }
    };

    fetchSiteNames();
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
    <ScrollView>
    <Layout style={styles.container}>
      <PopupProp
        popupText={message}
        popupColor={messageColor}
        onPress={setVisible}
        visible={visible}
      />

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
