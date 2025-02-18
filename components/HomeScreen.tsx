/**
 * Home Screen
 * @author Blake Stambaugh
 * 11/26/2024
 *
 * The follow code represents the home page the user sees when they first launch our app.
 * It has a button for each section of the app that will take them to the next page.
 **/
import { StyleSheet, ScrollView, Dimensions } from "react-native";
import HomeButtonProp from "./HomeButtonProp";
import { Layout } from "@ui-kitten/components";
import React, { useState, useEffect } from 'react';
import { NavigationType } from "./types";
const { width, height } = Dimensions.get("window"); //this pulls in the screen width and height to use for scalars
import { tankTrackerSpinUp, setVisitFile, getFileContents, visit } from '../scripts/APIRequests';
import { parseVisits, VisitList } from '../scripts/Parsers'
import NoteInput from './NoteInput'

export default function HomeScreen({ navigation }: NavigationType) {

  tankTrackerSpinUp()
  // State to hold parsed data
  const [data, setData] = useState<VisitList | null>(null);
  // Get current visits
  useEffect(() => {
      async function fetchData() {
          if (!data) {
              try {
                  const parsedData = await processVisits();
                  setData(parsedData); // Update state with the latest entry
                  console.log("data variable set")
              } catch (error) {
                  console.error("Error processing notes:", error);
              }
          }
      }
      fetchData();
  },[]);
  //Get latest notes entry from site
  let latestEntry = null;
  if (data) {
    console.log("data exists")
    latestEntry = data.visits[0];
    console.log("data[0] is: " + latestEntry)
  }
  const [dateValue, setDate] = useState("");
  //Set tank ids, values, and instruments if available in parsed data
    useEffect(() => {
      if (latestEntry) {
        console.log("latestEntry exists")
        if (latestEntry.date) {
          console.log("latestEntry has a date")
          const date = latestEntry.date;
          if (date) {
            setDate(date)
            console.log("set date too:" + date)
          }
        }
      }
    }, [latestEntry]);
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
            navigation.navigate("SelectSite", { from: "PlanVisit" })
          }
        />
        {/* notes entry */}
        <NoteInput labelText='Notes' 
              labelValue={dateValue} 
              onTextChange={setDate} 
              placeholder='All Good.' 
              multiplelines={true} 
              style={styles.notesInput}/>
      </ScrollView>
    </Layout>
  );
}

/**
 * @author David Ostlie
 *  a function that pulls the current note document for the specified site from GitHub
 *  @param siteName the name of the site
 * 
 * @returns a VisitsList object that contains the information of the given document
 */
async function processVisits() {
  const fileContents = await getFileContents(`researchflow_data/visits`);
  if(fileContents.data){
    return parseVisits(fileContents.data)
  }
  else
  {
    return null
  }
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
