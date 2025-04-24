import { StyleSheet } from "react-native";
import HomeButtonProp from "../components/HomeButtonProp";
import { Layout } from "@ui-kitten/components";
import React, {useEffect, useState} from "react";
import { NavigationType } from "../components/types";
import { visit } from "../scripts/APIRequests";
import { Calendar } from "react-native-calendars";
import { fetchCalendarData } from "../scripts/DataFetching";

let visitDict: Map<string, visit[]>

export default function CalendarScreen({ navigation }: NavigationType) {
  const [markedDates, setMarkedDates] = useState({});
  const [online, setOnline] = useState(false);

  useEffect(() => {
    async function fetchData() {
      visitDict = await fetchCalendarData(setOnline, setMarkedDates, markedDates);
    }
    fetchData()
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
