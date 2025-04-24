/**
 * Select Notes Page
 * @author Blake Stambaugh and Megan Ostlie
 * Updated: 2/4/25 - MO
 * 
 * This page is the lets the user select whether they want to view site notes or instrument
 * maintenance notes
 */
import { StyleSheet } from 'react-native';
import React from 'react';
import { Layout, Button, Text } from '@ui-kitten/components';
import { NavigationType } from '../components/types'
import { ScrollView } from 'react-native-gesture-handler';

export default function SelectSite({navigation}: NavigationType) {
  // data for buttons
  let buttonData = [
      { id: 1, label: 'Site Notes', onPress: () => handleConfirm('ViewNotes')},
      { id: 2, label: 'Instrument Maintenance', onPress: () => handleConfirm('InstrumentMaintenanceNotes')},
    ];

  const handleConfirm = (selectedSite: string) => {
    navigation.navigate('SelectSite', {from: selectedSite}); //{site: selectValue} tells the AddNotes what the selected value is
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