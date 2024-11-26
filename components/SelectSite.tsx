import { StyleSheet, Text, View, Alert, Button, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { getSites, siteResponse } from './APIRequests';

export default function SelectSite({navigation}) {
  const [selectedValue, setSelectedValue] = useState("CSP");
  const route = useRoute();
  let from = route.params?.from;

  const handleConfirm = () => {
    if(from === 'Add Notes'){
        navigation.navigate('Add Notes', {site: selectedValue}); //{site: selectValue} tells the AddNotes what the selected value is
        }
    else if(from === 'View Notes'){
        navigation.navigate('View Notes', {site: selectedValue}); //{site: selectValue} tells the AddNotes what the selected value is
        }
    else if(from === 'Bad Data'){
        navigation.navigate('Bad Data', {site: selectedValue}); //{site: selectValue} tells the AddNotes what the selected value is
        }
  };

  let siteNames: siteResponse[];
  const sitesPromise: Promise<siteResponse[]> = getSites();
    sitesPromise.then(result => {result.forEach(function (value) {siteNames.push(value)})})
  return (
    <View style={styles.container}>
      <View style={styles.dropdownContainer}>
        <Text style={styles.label}>Where are you?</Text>
        <Picker
          selectedValue={selectedValue}
          onValueChange={(itemValue: React.SetStateAction<string>) => setSelectedValue(itemValue)}
          style={styles.picker}
        >
         
        </Picker>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => handleConfirm()}>
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    padding: 20,
  },
  dropdownContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  label: {
    fontSize: 36,
    marginBottom: 50,
  },
  picker: {
    height: 50,
    width: '50%',
  },
  buttonContainer: {
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#007AFF', 
    paddingVertical: 15,       
    paddingHorizontal: 40,     
    borderRadius: 8,           
    alignItems: 'center',      
  },
  buttonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
});