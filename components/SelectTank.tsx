/**
 * Select Tank Page
 * @author Blake Stambaugh and Megan Ostlie
 * Updated: 2/3/25 - MO
 * 
 * This page is the lets the user select the tank they want to update. Once 
 * a tank is selected, the page will navigate to the TankTracker.
 */
import { StyleSheet, KeyboardAvoidingView, Platform, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { Button, Text } from '@ui-kitten/components';
import { NavigationType, routeProp } from './types'
import { getTankList } from '../scripts/APIRequests';
import { ScrollView, TextInput} from 'react-native-gesture-handler';

export default function SelectTank({navigation}: NavigationType) {
  const route = useRoute<routeProp>();
  const onSelect = route.params?.onSelect; // Get the onSelect function if passed

  // previous buttons hit, used to know where to go next
  let from = route.params?.from;
  const [visible, setVisible] = useState(false);
  const [messageColor, setMessageColor] = useState("");
  const [message, setMessage] = useState("");
  // State to hold the list of site names
  const [tankNames, setTankNames] = useState<string[]>();
  const [searchQuery, setSearchQuery] = useState<string>(""); // Search input state
  const [filteredTanks, setFilteredTanks] = useState<string[]>([]); // Filtered results


  useEffect(() => {
    const fetchTankNames = async () => {
      try {
        const tanks = getTankList(); // Ensure getTankList is returning a valid list
        //console.log(tanks)
        const validTanks = tanks.filter(tank => tank && tank.trim() !== "");
        setTankNames(validTanks);
        setFilteredTanks(validTanks); // Initialize filtered list
      } catch (error) {
        console.error("Error fetching tank names:", error);
      }
    };

    fetchTankNames();
  }, []);

  // Handle search input change
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === "") {
      setFilteredTanks(tankNames); // Show all tanks if no search input
    } else {
      setFilteredTanks(tankNames.filter(tank => tank.toLowerCase().includes(text.toLowerCase())));
    }
  };

  const handleConfirm = (selectedTank: string) => {
    if (onSelect) {
      onSelect(selectedTank); // Call the callback function
      navigation.goBack(); // Return to the AddNotes screen
    } else {
      navigation.navigate('TankTracker', {site: selectedTank});
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={styles.flexContainer}
    >
      <View style={styles.container}>
        {/* Search Input */}
        <TextInput
          style={styles.inputText}
          placeholder="Search for a tank..."
          value={searchQuery}
          onChangeText={handleSearch}
        />

        {/* Scrollable List */}
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          {filteredTanks.map((tank, index) => (
            <Button key={index} style={styles.button} onPress={() => handleConfirm(tank)}>
              {evaProps => <Text {...evaProps} category="h6" style={{color: "black"}}>{tank}</Text>}
            </Button>
          ))}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  inputText: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 10, // Space below input
  },
  scrollContainer: {
    flexGrow: 1, // Ensures content fills space dynamically
  },
  listItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  listText: {
    fontSize: 18,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: "#06b4e0"
  },
});