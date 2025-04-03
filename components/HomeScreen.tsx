/**
 * Home Screen
 * @author Blake Stambaugh
 * 11/26/2024
 *
 * The follow code represents the home page the user sees when they first launch our app.
 * It has a button for each section of the app that will take them to the next page.
 **/
import { StyleSheet, ScrollView, Dimensions, Platform, PermissionsAndroid } from "react-native";
import HomeButtonProp from "./HomeButtonProp";
import { Layout } from "@ui-kitten/components";
import React, { useState, useEffect } from 'react';
import { NavigationType } from "./types";
//const { width, height } = Dimensions.get("window"); //this pulls in the screen width and height to use for scalars
import NoteInput from './NoteInput'
import LoadingScreen from './LoadingScreen';
import * as Network from 'expo-network'

export default function HomeScreen({ navigation }: NavigationType) {
  
  return (
    <Layout style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
      
        {/*If you add a new navigation point you have to add it in types.ts, and App.tsx*/}
        {/* Add Notes */}

        <HomeButtonProp
          text="ADD NOTES"
          color="#AEDD94"
          onPress={() =>
            navigation.navigate("SelectSite", { from: "AddNotes" })
          }
        />

        {/* VIEW PAST NOTES */}
        <HomeButtonProp
          text="VIEW NOTES"
          color="#EBEBEB"
          onPress={() =>
            navigation.navigate("SelectNotes", { from: "ViewNotes" })
          }
        />

        {/* BAD DATA */}
        <HomeButtonProp
          text="BAD DATA"
          color="#FF8A84"
          onPress={() => navigation.navigate("SelectSite", { from: "BadData" })}
        />

        {/* INSTRUMENT MAINTENENCE */}
        <HomeButtonProp
          text="INSTRUMENT MAINTENENCE"
          color="#FEF8A0"
          onPress={() =>
            navigation.navigate("SelectSite", { from: "InstrumentMaintenance" })
          }
        />

        {/* TANK TRACKER */}
        <HomeButtonProp
          text="TANK TRACKER"
          color="#4DD7FA"
          onPress={() =>
            navigation.navigate("SelectTank", { from: "TankTracker" })
          }
        />

        {/* PLAN A VISIT */}
        <HomeButtonProp
          text="PLAN A VISIT"
          color="#FFC581"
          onPress={() =>
            navigation.navigate('Calendar')
          }
        />
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch", // has button fill space horizontally
    justifyContent: "space-evenly",
  },
  scrollContainer: {
    paddingVertical: 16,
    alignItems: "center", // Center cards horizontally
  },
  notesInput:
  {
    flex: 1,
    margin: 8,
  },
});
