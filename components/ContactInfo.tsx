/**
 * View Contact Info
 * @author Megan Ostlie
 */
import { useRoute } from '@react-navigation/native';
import { Layout, Text } from '@ui-kitten/components';
import React from 'react';
import { StyleSheet, View, Linking, TouchableOpacity, Platform } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { NavigationType, routeProp } from './types'

const contacts = [
    {id: "1", name: "Maria Garcia", phone: "+18017923277"},
    {id: "2", name: "Megan Ostlie", phone: "+18015890602"},
    {id: "3", name: "John Lin", phone: "+18013490831"},
    {id: "4", name: "Atmos Office", phone: "+18015816136"},
]

const hospitals = [
  {id: "1", name: "Salt Lake City", address: "50 Medical Dr N, Salt Lake City, UT 84132"},
  {id: "2", name: "Vernal", address: "150 W 100 N, Vernal, UT 84078"}
]

export default function ContactInfo({ navigation }: NavigationType) {
  const route = useRoute<routeProp>();

  const callContact = (phone) => {
    Linking.openURL(`tel:${phone}`);
  };

  const openMaps = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
  
    const url = Platform.OS === 'ios'
      ? `maps://maps.apple.com/?q=${encodedAddress}`  // Apple Maps for iOS
      : `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`; // Google Maps for Android

    Linking.openURL(url);
  }

  return (
      <Layout style={styles.container} level="1">
        <Text style={styles.headerText}>
            Contact Information
        </Text>
        <FlatList
            data={contacts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <View style={styles.listContainer}>
                <Text>{item.name}</Text>
                <TouchableOpacity
                  onPress={() => callContact(item.phone)}
                >
                  <Text style={styles.phoneText}>{item.phone}</Text>
                </TouchableOpacity>
                </View>
            )}
        />

        <Text style={styles.headerText}>
          Hospitals
        </Text>
        <FlatList
            data={hospitals}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <View style={styles.listContainer}>
                <Text>{item.name}:</Text>
                <TouchableOpacity
                  onPress={() => openMaps(item.address)}
                >
                <Text style={styles.phoneText}>{item.address}</Text>
                </TouchableOpacity>
                </View>
            )}
        />
        
      </Layout>
  );
}
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',        // has button fill space horizontally
      justifyContent: 'center',
    },
    scrollContainer: {
      backgroundColor: '#1C2760'
    },

    label: {
        margin: 15,
        fontSize: 24,
        alignItems: 'flex-start'
      },
    rowContainer:
    {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-start',        // has button fill space horizontally
      justifyContent: 'space-around',
      marginBottom: 10
    },
    header: {
      margin: 10,
      width: '100%', // Ensure the header takes full width
      alignItems: 'flex-start', // Center the text on the left
      marginBottom: 20, // Add space between the header and the buttons
    },
    headerText: {
      fontSize: 34,
      padding: 20
    },
    phoneText: {
      textDecorationLine: 'underline',
      color: 'blue'
    },
    listContainer: {
      flex: 1, 
      flexDirection: 'column', 
      alignItems: 'center', 
      padding: 10
    }
});