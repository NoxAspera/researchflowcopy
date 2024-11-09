import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      {/* header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Home</Text>
      </View>

      {/* buttons */}
      <TouchableOpacity
        style={[styles.homeButton, {backgroundColor: 'green'}]}
        onPress={() => alert('Add Notes')} >
          <Text style={styles.homeButtonText}>Add Notes</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.homeButton, {backgroundColor: 'red'}]}
        onPress={() => alert('Bad Data')} >
          <Text style={styles.homeButtonText}>Bad Data</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.homeButton, {backgroundColor: 'yellow'}]}
        onPress={() => alert('Tank Tracker')} >
          <Text style={styles.homeButtonText}>Tank Tracker</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.homeButton, {backgroundColor: 'grey'}]}
        onPress={() => alert('Instrument Maintenence')} >
          <Text style={styles.homeButtonText}>Instrument Maintenence</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.homeButton, {backgroundColor: 'orange'}]}
        onPress={() => alert('Plan a Visit')} >
          <Text style={styles.homeButtonText}>Plan a Visit</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
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
  homeButton: {
    flex: 1,                      // has button fill space vertically
    borderRadius: 10,
    justifyContent: 'center',     // this and alignItems places text in center of button
    alignItems: "center",
    margin: 10
  },
  homeButtonText: {
    flex: 1,
    fontSize: 30
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
