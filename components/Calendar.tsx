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
import React from "react";
import { NavigationType } from "./types";
const { width, height } = Dimensions.get("window"); //this pulls in the screen width and height to use for scalars
import * as calendar from 'expo-calendar';
import {DateData, LocaleConfig} from 'react-native-calendars'
import { Calendar, CalendarList,Agenda } from "react-native-calendars";

function handlePress(date: DateData)
{
  console.log(date)
}

export default function CalendarScreen({ navigation }: NavigationType) {
  
  return (
    <Layout style={styles.container}>
        {/*If you add a new navigation point you have to add it in types.ts, and App.tsx*/}
        
        {/* Plan a Visit */}
        <HomeButtonProp
          text="PLAN A VISIT"
          color="#4DD7FA"
          onPress={() =>
            navigation.navigate("PlanVisit")
          }
        />
        <Calendar
          onDayPress={Date => {handlePress(Date)}}
        />
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center", // has button fill space horizontally
    justifyContent: "space-evenly",
  },
  scrollContainer: {
    paddingVertical: 16,
    alignItems: "center", // Center cards horizontally
  },
});
