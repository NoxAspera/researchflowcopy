/**
 * View Contact Info
 * @author Megan Ostlie
 */
import { useRoute } from '@react-navigation/native';
import { Layout, Text } from '@ui-kitten/components';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { NavigationType, routeProp } from './types'

const contacts = [
    {id: "1", name: "Maria Garcia", phone: "+18017923277"},
    {id: "2", name: "Megan Ostlie", phone: "+18015890602"}
]

export default function ContactInfo({ navigation }: NavigationType) {
  const route = useRoute<routeProp>();

  return (
      <Layout style={styles.container} level="1">
        <Text style={styles.headerText}>
            Contact Information
        </Text>
        <FlatList
            data={contacts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <View style={styles.rowContainer}>
                <Text>{item.name}</Text>
                <Text>{item.phone}</Text>
                </View>
            )}
        />
        
      </Layout>
  );
}
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'stretch',        // has button fill space horizontally
      justifyContent: 'space-evenly',
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
      justifyContent: 'space-evenly',
    },
    header: {
      margin: 10,
      width: '100%', // Ensure the header takes full width
      alignItems: 'flex-start', // Center the text on the left
      marginBottom: 20, // Add space between the header and the buttons
    },
    headerText: {
      fontSize: 34,
      marginTop: 30,
      marginBottom: 30,
      paddingHorizontal: 50
    }
});