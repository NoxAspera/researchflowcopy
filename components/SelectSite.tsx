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
import React from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { ApplicationProvider, Layout, Button, Text } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { customTheme } from './CustomTheme'
import { NavigationType, routeProp } from './types'


export default function SelectSite({navigation}: NavigationType) {
  // type routeProp = RouteProp<{params: RouteParams}, 'params'>;
  const route = useRoute<routeProp>();

  // previous buttons hit, used to know where to go next
  let from = route.params?.from;

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
      navigation.navigate('InstrumentMaintenance', {site: selectedSite});
    }
    else if (from === 'TankTracker')
    {
      navigation.navigate('TankTracker', {site: selectedSite});
    }
  };


  // data for buttons
  const buttonData = [
    { id: 1, label: 'CSP', onPress: () => handleConfirm('CSP')},
    { id: 2, label: 'DBK', onPress: () => handleConfirm('DBK')},
    { id: 3, label: 'FRU', onPress: () => handleConfirm('FRU')},
    { id: 4, label: 'HDP', onPress: () => handleConfirm('HDP')},
    { id: 5, label: 'SUG', onPress: () => handleConfirm('SUG')},
    { id: 6, label: 'WBB', onPress: () => handleConfirm('WBB')}
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
          {evaProps => <Text {...evaProps} category="h6" style={{color: "black"}}>{button.label}</Text>}
            
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
    backgroundColor: "#06b4e0"
  },
});
