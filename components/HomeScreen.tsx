/**
 * Home Screen
 * By Blake Stambaugh
 * 11/26/2024
 * 
 * The follow code represents the home page the user sees when they first launch our app.
 * It has a button for each section of the app that will take them to the next page.
**/ 
import { StyleSheet, View, TouchableOpacity, ScrollView, TouchableWithoutFeedback, ImageBackground, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import HomeButtonProp from './HomeButtonProp';
import { NaviProp } from './types';
import { ApplicationProvider, Layout, Text } from '@ui-kitten/components'
import * as eva from '@eva-design/eva';
import { default as theme } from '../custom-theme.json'


export default function HomeScreen({navigation}: NaviProp) {
  return (
    <ApplicationProvider {...eva} theme={theme}>
      <Layout style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
            {/* Add Notes */}
            <TouchableWithoutFeedback onPress={() => navigation.navigate('SelectSite', {from: 'AddNotes'})}>
                <Layout style={styles.tab} level="2">
                  {/* <ImageBackground source={{uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAQWkqKNH5kgJFOJzGNeGPogFhdvMBAwtiDg&s'}} 
                  resizeMode='cover' style={styles.imageBackground}> */}
                    <Text category="h5">ADD NOTES</Text>
                  {/* </ImageBackground> */}
                </Layout>
            </TouchableWithoutFeedback>

            {/* VIEW PAST NOTES */}
            <TouchableWithoutFeedback onPress={() => navigation.navigate('SelectSite', {from: 'ViewNotes'})}>
                <Layout style={styles.tab} level="2">
                    <Text category="h5">VIEW PAST NOTES</Text>
                </Layout>
            </TouchableWithoutFeedback>
            {/* BAD DATA */}
            <TouchableWithoutFeedback onPress={() => navigation.navigate('SelectSite', {from: "BadData"})}>
                <Layout style={styles.tab} level="2">
                    <Text category="h5">BAD DATA</Text>
                </Layout>
            </TouchableWithoutFeedback>
            {/* INSTRUMENT MAINTENENCE */}
            <TouchableWithoutFeedback onPress={() => navigation.navigate('SelectSite', {from: "InstrumentMaintenance"})}>
                <Layout style={styles.tab} level="2">
                    <Text category="h5">INSTRUMENT MAINTENENCE</Text>
                </Layout>
            </TouchableWithoutFeedback>
            {/* TANK TRACKER */}
            <TouchableWithoutFeedback onPress={() => navigation.navigate('SelectSite', {from: "TankTracker"})}>
                <Layout style={styles.tab} level="2">
                    <Text category="h5">TANK TRACKER</Text>
                </Layout>
            </TouchableWithoutFeedback>
            {/* PLAN A VISIT */}
            <TouchableWithoutFeedback onPress={() => alert('PLAN A VISIT')}>
                <Layout style={styles.tab} level="2">
                    <Text category="h5">PLAN A VISIT</Text>
                </Layout>
            </TouchableWithoutFeedback>
            </ScrollView>
        </Layout>
    </ApplicationProvider>
    // <View style={styles.container}>
    //   {/* header */}
    //   <View style={styles.header}>
    //     <Text style={styles.headerText}>Home</Text>
    //   </View>

    //   {/* buttons */}
      
    //   {/* Select Site  */}
    //   <HomeButtonProp color='green' text='Add Notes' onPress={() => navigation.navigate('SelectSite', {from: 'AddNotes'})} />

    //   {/* Bad Data  */}
    //   <HomeButtonProp color='red' text='Bad Data' onPress={() => navigation.navigate('SelectSite', {from: "BadData"})}/>

    //   {/* Tank Tracker  */}
    //   <HomeButtonProp color='blue' text='Tank Tracker' onPress={() => navigation.navigate('SelectTank')} />

    //   {/* Instrument Maintenence  */}
    //   <HomeButtonProp color='yellow' text='Instrument Maintenence' onPress={() => navigation.navigate('SelectInstrument')} />

    //   {/* View Past Notes  */}
    //   <HomeButtonProp color='grey' text='View Past Notes' onPress={() => navigation.navigate('SelectSite', {from: 'ViewNotes'})} />

    //   {/* Plan a visit  */}
    //   <HomeButtonProp color='orange' text='Plan a Visit' onPress={() => alert('plan a visit')} />
    // </View>
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
  },
  scrollContainer: {
    paddingVertical: 16,
    alignItems: 'center', // Center cards horizontally
  },
  tab: {
    width: '90%', // Card width to adjust appearance
    height: 200,
    marginVertical: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    elevation: 4, // For shadow on Android
    shadowColor: '#000', // For shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  imageBackground: {
    flex: 1,
    height: 150, // Adjust as needed for your design
    justifyContent: 'center',
    alignItems: 'center',
  },
});
