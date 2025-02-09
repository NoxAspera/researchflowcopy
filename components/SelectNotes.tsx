/**
 * Select Notes Page
 * @author Blake Stambaugh and Megan Ostlie
 * Updated: 2/4/25 - MO
 * 
 * This page is the lets the user select whether they want to view site notes or instrument
 * maintenance notes
 */
import { StyleSheet } from 'react-native';
import React, { Component, useEffect, useState } from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Layout, Button, Text } from '@ui-kitten/components';
import PopupProp from './Popup';
import { NavigationType, routeProp } from './types'
import { getBadDataSites, getDirectory, getTankList } from '../scripts/APIRequests';
import { ScrollView } from 'react-native-gesture-handler';


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

  // data for buttons
  let buttonData = [
      { id: 1, label: 'Site Notes', onPress: () => handleConfirm('ViewNotes')},
      { id: 2, label: 'Instrument Maintenance', onPress: () => handleConfirm('InstrumentMaintenanceNotes')},
    ];

  const handleConfirm = (selectedSite: string) => {
    navigation.navigate('SelectSite', {from: selectedSite}); //{site: selectValue} tells the AddNotes what the selected value is
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
    justifyContent: 'space-around',
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