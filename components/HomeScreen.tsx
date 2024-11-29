import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Home</Text>
      </View>

      {/* buttons */}
      
      {/* Select Site  */}
      <TouchableOpacity
        style={[styles.homeButton, {backgroundColor: 'green'}]}
        onPress={() => navigation.navigate('SelectSite', {from: 'AddNotes'})} >
          <Text style={styles.homeButtonText}>Add Notes</Text>
      </TouchableOpacity>

      {/* Bad Data  */}
      <TouchableOpacity
        style={[styles.homeButton, {backgroundColor: 'red'}]}
        onPress={() => navigation.navigate('SelectSite', {from: 'BadData'})}>
          <Text style={styles.homeButtonText}>Bad Data</Text>
      </TouchableOpacity>

      {/* Tank Tracker  */}
      <TouchableOpacity
        style={[styles.homeButton, {backgroundColor: 'blue'}]}
        onPress={() => navigation.navigate('SelectTank')} >
          <Text style={styles.homeButtonText}>Tank Tracker</Text>
      </TouchableOpacity>

      {/* Instrument Maintenance  */}
      <TouchableOpacity
        style={[styles.homeButton, {backgroundColor: 'yellow'}]}
        onPress={() => navigation.navigate('SelectInstrument')} >
          <Text style={styles.homeButtonText}>Instrument Maintenance</Text>
      </TouchableOpacity>

      {/* View Past Notes  */}
      <TouchableOpacity
        style={[styles.homeButton, {backgroundColor: 'grey'}]}
        onPress={() => navigation.navigate('SelectSite', {from: 'ViewNotes'})} >
          <Text style={styles.homeButtonText}>View Past Notes</Text>
      </TouchableOpacity>

      {/* Plan a visit  */}
      <TouchableOpacity
        style={[styles.homeButton, {backgroundColor: 'orange'}]}
        onPress={() => alert('Plan a visit')} >
          <Text style={styles.homeButtonText}>Plan a Visit</Text>
      </TouchableOpacity>
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
