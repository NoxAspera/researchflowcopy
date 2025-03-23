/**
 * Diagnostics
 * @author Megan Ostlie
 * 3/21/25
 *
 * This page is used for plotting up tank values and connecting to air.utah.edu diagnostics
 */
import { StyleSheet, KeyboardAvoidingView, Linking, Dimensions, View} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useRoute } from "@react-navigation/native";
import { Button, Layout, Datepicker, Text } from "@ui-kitten/components";
import TextInput from "./TextInput";
import { customTheme } from "./CustomTheme";
import { NavigationType, routeProp } from "./types";
import { ScrollView } from "react-native-gesture-handler";
import { ThemeContext } from "./ThemeContext";
import { visit, setVisitFile } from "../scripts/APIRequests";
import PopupProp from './Popup';
import LoadingScreen from "./LoadingScreen";
import { processNotes, ParsedData, Entry, TankInfo } from "../scripts/Parsers";
import { LineChart } from "react-native-chart-kit";

const extractNumericValue = (pressure: string | null): number | null => {
  if (!pressure) return null; // Handle null or undefined
  const match = pressure.match(/\d+(\.\d+)?/); // Match integer or decimal numbers
  return match ? parseInt(match[0]) : null; // Return the matched number as a string
};

const groupTankData = (entries: Entry[]) => {
  const latestTankByType: Record<string, string> = {}; // Stores latest tank ID per type
  const tankTimestamps: Record<string, string> = {}; // Stores the latest timestamp per tank type
  const tankMap: Record<string, { time: string; pressure: number }[]> = {}; // Stores all pressures for latest tank ID

  // First pass: Identify the most recent tank ID for each type
  entries.forEach((entry) => {
    ["low_cal", "mid_cal", "high_cal", "lts"].forEach((tankType) => {
      const tank = entry[tankType as keyof Entry] as TankInfo | null;
      if (tank) {
        const time = entry.time_in || "Unknown";

        // Update if it's the most recent entry
        if (!tankTimestamps[tankType] || new Date(time) > new Date(tankTimestamps[tankType])) {
          latestTankByType[tankType] = tank.id;
          tankTimestamps[tankType] = time;
        }
      }
    });
  });

  // Second pass: Collect all pressures for the most recent tank ID per type
  entries.forEach((entry) => {
    ["low_cal", "mid_cal", "high_cal", "lts"].forEach((tankType) => {
      const tank = entry[tankType as keyof Entry] as TankInfo | null;
      if (tank && tank.id === latestTankByType[tankType]) {
        const pressure = extractNumericValue(tank.pressure);
        if (pressure !== null) {
          if (!tankMap[latestTankByType[tankType]]) {
            tankMap[latestTankByType[tankType]] = [];
          }
          tankMap[latestTankByType[tankType]].push({ time: entry.time_in || "Unknown", pressure });
        }
      }
    });
  });

  return tankMap;
};

export default function Diagnostics({ navigation }: NavigationType) {
  const route = useRoute<routeProp>();
  let site = route.params?.site;
  const themeContext = React.useContext(ThemeContext);
  const isDarkMode = themeContext.theme === 'dark';
  let siteName = site;
  if (site.includes("mobile/")) {
    siteName = site.replace("mobile/", "");
  }
  let date = new Date();
  let year = date.getFullYear();
  let month = String(date.getMonth() + 1).padStart(2, '0');
  let day = String(date.getDate()).padStart(2, '0');
  let today = `${year}-${month}-${day}`;

  date.setDate(date.getDate() - 7);
  year = date.getFullYear();
  month = String(date.getMonth() + 1).padStart(2, '0');
  day = String(date.getDate()).padStart(2, '0');
  let lastWeek = `${year}-${month}-${day}`;

  const openURL = async () => {
      const url =
      `https://air.utah.edu/s/diagnostics/?_inputs_&remove_failed_qc=false&color_by=%22QAQC_Flag%22&dates=%5B%22${lastWeek}%22%2C%22${today}%22%5D&column=%22%22&lvl=%22%22&instrument=%22%22&stid=%22${siteName}%22&submit=0&sidebarCollapsed=false&sidebarItemExpanded=null`;
  
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        alert("Cannot open the URL");
      }
    };

  // State to hold parsed data
  const [data, setData] = useState<ParsedData | null>(null);
  const [lowCalList, setLowCalList] = useState<{ id: string; pressure: number; time_in: string | null }[]>([]);
  const [midCalList, setMidCalList] = useState<{ id: string; pressure: number; time_in: string | null }[]>([]);
  const [highCalList, setHighCalList] = useState<{ id: string; pressure: number; time_in: string | null }[]>([]);
  const [ltsList, setLtsList] = useState<{ id: string; pressure: number; time_in: string | null }[]>([]);
  const [n2List, setN2List] = useState<{ id: string; pressure: number; time_in: string | null }[]>([]);
  
  // Get current notes for the site
  useEffect(() => {
    async function fetchData() {
      if (site && !data) {
        try {
            const parsedData = await processNotes(site);
            setData(parsedData); // Update state with the latest entry
          } catch (error) {
              console.error("Error processing notes:", error);
          }
      }
    }
    fetchData();
  }, [site]); // Re-run if `site` changes

  const [tankData, setTankData] = useState<Record<string, { time: string; pressure: number }[]>>({});

  useEffect(() => {
    if (data) {
      setTankData(groupTankData(data.entries));
    }
  }, [data]);

  const screenWidth = Dimensions.get("window").width;

  return (
    <KeyboardAvoidingView
      behavior = "padding"
      style={styles.container}
    >
      <ScrollView automaticallyAdjustKeyboardInsets={true} keyboardShouldPersistTaps='handled'>
          {/* button for air.utah.edu */}
          <Button
            onPress={() => openURL()}
            appearance="filled"
            status="primary"
            style={styles.submitButton}
          >
          {evaProps => <Text {...evaProps} category="h6" style={{color: "black"}}>Diagnostics</Text>}
          </Button>

          <Text style={{ textAlign: "center", fontSize: 18, fontWeight: "bold", margin: 10 }}>
        Tank Pressure Over Time
      </Text>
      {Object.entries(tankData).map(([tankId, data]) => {
        const labels = data.map((d) => d.time);
        const pressures = data.map((d) => d.pressure);

        return (
          <View key={tankId} style={{ marginVertical: 10 }}>
            <Text style={{ textAlign: "center", fontSize: 16, fontWeight: "bold" }}>
              Tank ID: {tankId}
            </Text>
            <LineChart
              data={{
                labels,
                datasets: [{ data: pressures }],
              }}
              width={screenWidth - 20}
              height={220}
              yAxisLabel=""
              yAxisSuffix=" psi"
              chartConfig={{
                backgroundColor: "#f5f5f5",
                backgroundGradientFrom: "#e0f7fa",
                backgroundGradientTo: "#80deea",
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(0, 150, 136, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: { borderRadius: 16 },
                propsForDots: { r: "4", strokeWidth: "2", stroke: "#00695c" },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          </View>
        );
      })}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch", // has button fill space horizontally
    justifyContent: "space-evenly",
  },
  reasonText: {
    flex: 1,
    margin: 8,
  },
  textInput: {
    flex: 1,
    margin: 8,
  },
  submitButton:{
    margin: 20, 
    backgroundColor: "#06b4e0",
  },
});