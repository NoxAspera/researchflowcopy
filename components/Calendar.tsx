/** Calendar Screen
 * @author August O'Rourke
 * Last Updated 4/10/25
 * 
 * This is the screen that pops up after the user selects "Calendar"
 */
import { StyleSheet, Dimensions } from "react-native";
import HomeButtonProp from "./HomeButtonProp";
import { Layout } from "@ui-kitten/components";
import React, {useEffect, useState} from "react";
import { NavigationType } from "./types";
const { width, height } = Dimensions.get("window"); //this pulls in the screen width and height to use for scalars
import { getFileContents, visit } from "../scripts/APIRequests";
import { processVisits } from "../scripts/Parsers";
import { Calendar } from "react-native-calendars";
import { customTheme } from './CustomTheme';
import { isConnected } from "../scripts/Helpers";

let visitDict: Map<string, visit[]>


export default function CalendarScreen({ navigation }: NavigationType) {
  const [markedDates, setMarkedDates] = useState({});
  const [visible, setVisible] = useState(false);
  const [messageColor, setMessageColor] = useState("");
  const [message, setMessage] = useState("");
  const [networkStatus, setNetworkStatus] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try{
        setNetworkStatus(await isConnected())
        if(networkStatus)
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
            setMessage(`Error: ${response.error}`);
            setMessageColor(customTheme["color-danger-700"]);
            setVisible(true);
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
            if (networkStatus && visitDict.has(Date.dateString)){

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
