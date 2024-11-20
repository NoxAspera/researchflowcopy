import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import HomeButtonProp from './HomeButtonProp';

// Define the type for the stack's navigation parameters
type RootStackParamList = {
  SelectSite: undefined; // Add any other screens with their params here
  // OtherScreen: { paramName: string }; // Example with params
};

// Type for the navigation prop for this screen
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SelectSite'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}


export default function HomeScreen({navigation}: HomeScreenProps) {
  return (
    <View style={styles.container}>
      {/* header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Home</Text>
      </View>

      {/* buttons */}
      
      {/* Select Site  */}
      <HomeButtonProp color='green' text='Add Notes' onPress={() => navigation.navigate('SelectSite')} />
      {/* <TouchableOpacity
        style={[styles.homeButton, {backgroundColor: 'green'}]}
        onPress={() => navigation.navigate('SelectSite')} >
          <Text style={styles.homeButtonText}>Add Notes</Text>
      </TouchableOpacity> */}

      {/* Bad Data  */}
      <HomeButtonProp color='red' text='test' onPress={() => alert("bad data")} />
      {/* <TouchableOpacity
        style={[styles.homeButton, {backgroundColor: 'red'}]}
        onPress={() => alert('Bad Data')} >
          <Text style={styles.homeButtonText}>Bad Data</Text>
      </TouchableOpacity> */}

      {/* Tank Tracker  */}
      <HomeButtonProp color='blue' text='Tank Tracker' onPress={() => alert('tank tracker')} />
      {/* <TouchableOpacity
        style={[styles.homeButton, {backgroundColor: 'blue'}]}
        onPress={() => alert('Tank Tracker')} >
          <Text style={styles.homeButtonText}>Tank Tracker</Text>
      </TouchableOpacity> */}

      {/* Instrument Maintenence  */}
      <HomeButtonProp color='yellow' text='Instrument Maintenence' onPress={() => alert('instrument maintenence')} />
      {/* <TouchableOpacity
        style={[styles.homeButton, {backgroundColor: 'yellow'}]}
        onPress={() => alert('Instrument Maintenence')} >
          <Text style={styles.homeButtonText}>Instrument Maintenence</Text>
      </TouchableOpacity> */}

      {/* View Past Notes  */}
      <HomeButtonProp color='grey' text='View Past Notes' onPress={() => navigation.navigate('SelectSite')} />
      {/* <TouchableOpacity
        style={[styles.homeButton, {backgroundColor: 'grey'}]}
        onPress={() => navigation.navigate('SelectSite')} >
          <Text style={styles.homeButtonText}>View Past Notes</Text>
      </TouchableOpacity> */}

      {/* Plan a visit  */}
      <HomeButtonProp color='orange' text='Plan a Visit' onPress={() => alert('plan a visit')} />
      {/* <TouchableOpacity
        style={[styles.homeButton, {backgroundColor: 'orange'}]}
        onPress={() => alert('Plan a visit')} >
          <Text style={styles.homeButtonText}>Plan a Visit</Text>
      </TouchableOpacity> */}
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
  // homeButton: {
  //   flex: 1,                      // has button fill space vertically
  //   borderRadius: 10,
  //   justifyContent: 'center',     // this and alignItems places text in center of button
  //   alignItems: "center",
  //   margin: 10
  // },
  // homeButtonText: {
  //   flex: 1,
  //   fontSize: 30
  // },
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
