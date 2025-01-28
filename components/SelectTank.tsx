/**
 * depreciated
 */
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { useRoute } from '@react-navigation/native';

export default function SelectTank({navigation}) {
  const [selectedValue, setSelectedValue] = useState("Tank 1");
  const route = useRoute();

  const handleConfirm = () => {
    navigation.navigate('Tank Tracker', {tank: selectedValue});
  };

  return (
    <View style={styles.container}>
      <View style={styles.dropdownContainer}>
        <Text style={styles.label}>Select Tank</Text>
        <Picker
          selectedValue={selectedValue}
          onValueChange={(itemValue: React.SetStateAction<string>) => setSelectedValue(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Tank 1" value="Tank 1" />
          <Picker.Item label="Tank 2" value="Tank 2" />
          <Picker.Item label="Tank 3" value="Tank 3" />
          <Picker.Item label="Tank 4" value="Tank 4" />
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