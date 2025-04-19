import { StyleSheet } from "react-native";
import HomeButtonProp from "../components/HomeButtonProp";
import { Layout } from "@ui-kitten/components";
import React, {useEffect, useState} from "react";
import { NavigationType } from "../components/types";
import { getFileContents, visit } from "../scripts/APIRequests";
import { processVisits } from "../scripts/Parsers";
import { Calendar } from "react-native-calendars";
import * as Network from "expo-network"

let visitDict: Map<string, visit[]>

let online = false

export default function CalendarScreen({ navigation }: NavigationType) {
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    async function fetchData() {
      try{
        let check = await (Network.getNetworkStateAsync())
        online = check.isConnected
        if(check.isConnected)
        {
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
          }
          else
          {
            console.error(response.error);
          }
        }
      }
      catch(error)
      {
        console.error(error)
      }
    }
    fetchData();
}, []);

  return (
    <Layout style={styles.container}>
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
            if (online && visitDict.has(Date.dateString)){
              navigation.push("ViewNotes", {site: "", from: "Calendar", visits: visitDict.get(Date.dateString)})
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
