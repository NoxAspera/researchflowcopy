import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import HomeButtonProp from './HomeButtonProp';
import { NaviProp } from './types';


export default function HomeScreen({navigation}: NaviProp) {
  return (
    <View style={styles.container}>
      {/* header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Home</Text>
      </View>

      {/* buttons */}
      
      {/* Select Site  */}
      <HomeButtonProp color='green' text='Add Notes' onPress={() => navigation.navigate('SelectSite', {from: 'AddNotes'})} />

      {/* Bad Data  */}
      <HomeButtonProp color='red' text='Bad Data' onPress={() => navigation.navigate('SelectSite', {from: "BadData"})}/>

      {/* Tank Tracker  */}
      <HomeButtonProp color='blue' text='Tank Tracker' onPress={() => navigation.navigate('SelectTank')} />

      {/* Instrument Maintenence  */}
      <HomeButtonProp color='yellow' text='Instrument Maintenence' onPress={() => navigation.navigate('SelectInstrument')} />

      {/* View Past Notes  */}
      <HomeButtonProp color='grey' text='View Past Notes' onPress={() => navigation.navigate('SelectSite', {from: 'ViewNotes'})} />

      {/* Plan a visit  */}
      <HomeButtonProp color='orange' text='Plan a Visit' onPress={() => alert('plan a visit')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',        // has button fill space horizontally
    justifyContent: 'space-evenly',
  },
  header: {
    width: '100%', // Ensure the header takes full width
    alignItems: 'center', // Center the text horizontally
    marginBottom: 20, // Add space between the header and the buttons
  },
  headerText: {
    fontSize: 48,
    marginTop: 30,
  }
});
