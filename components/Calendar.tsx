/**
 * Home Screen
 * @author Blake Stambaugh
 * 11/26/2024
 *
 * The follow code represents the home page the user sees when they first launch our app.
 * It has a button for each section of the app that will take them to the next page.
 **/
import { StyleSheet, Dimensions } from "react-native";
import HomeButtonProp from "./HomeButtonProp";
import { Layout } from "@ui-kitten/components";
import React, {useEffect, useState} from "react";
import { NavigationType } from "./types";
const { width, height } = Dimensions.get("window"); //this pulls in the screen width and height to use for scalars
import * as calendar from 'expo-calendar';
import { getFileContents, visit } from "../scripts/APIRequests";
import { processVisits } from "../scripts/Parsers";
import { DateData, LocaleConfig} from 'react-native-calendars'
import { Calendar, CalendarList,Agenda } from "react-native-calendars";
import { customTheme } from './CustomTheme';
import PopupProp from './Popup';
import PlanVisit from "./PlanVisit";
import ViewNotes from "./ViewNotes";

let visitDict: Map<string, visit[]>

function handlePress(date: DateData)
{
  let temp = visitDict.get(date.dateString)
  
}

export function getVisitDictionary()
{
  return visitDict.get()
}

export default function CalendarScreen({ navigation }: NavigationType) {
  const [markedDates, setMarkedDates] = useState({});
  const [visible, setVisible] = useState(false);
  const [messageColor, setMessageColor] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchData() {
      try{
        let response = await getFileContents("researchflow_data/visits")
        if (response.success)
        {
          visitDict = new Map()
          let visits: visit[] = processVisits(response.data)
          visits.forEach((value) => {
            if(visitDict.has(value.date))
            {
              let temp = visitDict.get(value.date)
              temp.push(value)
              visitDict.set(value.date,temp)
              console.log("overlap")
            }
            else
            {
              visitDict.set(value.date,[value])
            }

            if(markedDates)
            {
              setMarkedDates(prevmarkedDates => ({...prevmarkedDates,[value.date] :{marked: true, dotColor: 'blue'}}))
            }
          })
          console.log(visitDict.size)
        }
        else
        {
          setMessage(`Error: ${response.error}`);
          setMessageColor(customTheme["color-danger-700"]);
          setVisible(true);
        }
      }
      catch(error)
      {
        console.log(error)
      }
    }
    fetchData();
}, []);

  return (
    <Layout style={styles.container}>
        {/*If you add a new navigation point you have to add it in types.ts, and App.tsx*/}
        <PopupProp
          popupText={message}
          popupColor={messageColor}
          onPress={setVisible}
          visible={visible}
        />
        {/* Plan a Visit */}
        <HomeButtonProp
          text="PLAN A VISIT"
          color="#4DD7FA"
          onPress={() =>
            navigation.push("SelectSite", {from: "PlanVisit"})
          }
        />
        <Calendar
          onDayPress={Date => {
            if (visitDict.has(Date.dateString)){
              navigation.push("ViewNotes", {from: "Calendar", visits: visitDict.get(Date.dateString)})
            }
          }}
          markedDates={markedDates}
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
