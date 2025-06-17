/**
 * Home Screen
 * @author Blake Stambaugh, Callum O'Rourke, Megan Ostlie
 * 4/21/2025
 *
 * The follow code represents the home page the user sees when they first launch our app.
 * It has a button for each section of the app that will take them to the next page.
 **/
import { StyleSheet, ScrollView } from "react-native";
import HomeButtonProp from "../components/HomeButtonProp";
import { Layout } from "@ui-kitten/components";
import React, { useState, useEffect } from 'react';
import { NavigationType } from "../components/types";
import { isConnected } from "../scripts/Helpers";

export default function HomeScreen({ navigation }: NavigationType) {
  const [networkStatus, setNetworkStatus] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setNetworkStatus(await isConnected());
    }
    fetchData();
  }, []);

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

        {/* CALENDAR */}
        <HomeButtonProp
          text="CALENDAR"
          color="#FFC581"
          onPress={() =>
            navigation.navigate('Calendar')
          }
        />

        {/* DIAGNOSTICS */}
        {networkStatus && (
        <HomeButtonProp
          text="DIAGNOSTICS"
          color="#C3A2E4"
          onPress={() =>
            navigation.navigate("SelectSite", { from: "Diagnostics" })
          }
        />
        )}
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
