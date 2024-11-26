import { StyleSheet, Text, View, Alert, Button, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { useRoute } from '@react-navigation/native';

export default function SelectInstrument({navigation}) {
  const [selectedValue, setSelectedValue] = useState("Pump LG-14-0237");
  const route = useRoute();

  const handleConfirm = () => {
    navigation.navigate('Instrument Maintenance', {instrument: selectedValue});
  };

  return (
    <View style={styles.container}>
      <View style={styles.dropdownContainer}>
        <Text style={styles.label}>Select Instrument</Text>
        <Picker
          selectedValue={selectedValue}
          onValueChange={(itemValue: React.SetStateAction<string>) => setSelectedValue(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Pump LG-14-0237" value="Pump LG-14-0237" />
          <Picker.Item label="Teledyne T200" value="Teledyne T200" />
          <Picker.Item label="Teledyne T300" value="Teledyne T300" />
          <Picker.Item label="Teledyne T400" value="Teledyne T400" />
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
    width: '57%',
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