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
import { Svg, Circle } from 'react-native-svg';

const extractNumericValue = (pressure: string | null): number | null => {
  if (!pressure) return null; // Handle null or undefined
  const match = pressure.match(/\d+(\.\d+)?/); // Match integer or decimal numbers
  return match ? parseInt(match[0]) : null; // Return the matched number as a string
};

const prepareComparisonData = (entries: Entry[]) => {
  const latestTankByType: Record<string, string> = {};
  const tankTimestamps: Record<string, string> = {};

  // Identify latest tank ID per type
  entries.forEach((entry) => {
    ["low_cal", "mid_cal", "high_cal", "lts"].forEach((tankType) => {
      const tank = entry[tankType as keyof Entry] as TankInfo | null;
      if (tank) {
        const time = entry.time_in || "Unknown";

        if (!tankTimestamps[tankType] || new Date(time) > new Date(tankTimestamps[tankType])) {
          latestTankByType[tankType] = tank.id;
          tankTimestamps[tankType] = time;
        }
      }
    });
  });

  // Collect all pressures into a flat array
  const comparisonData: { time: string; pressure: number; tankType: string }[] = [];

  entries.forEach((entry) => {
    ["low_cal", "mid_cal", "high_cal", "lts"].forEach((tankType) => {
      const tank = entry[tankType as keyof Entry] as TankInfo | null;
      if (tank && tank.id === latestTankByType[tankType]) {
        const pressure = extractNumericValue(tank.pressure);
        if (pressure !== null) {
          comparisonData.push({
            time: entry.time_in || "Unknown",
            pressure,
            tankType,
          });
        }
      }
    });
  });

  return comparisonData;
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

  const [tankData, setTankData] = useState<{ time: string; pressure: number; tankType: string }[]>([]);

  useEffect(() => {
    if (data) {
      setTankData(prepareComparisonData(data.entries));
    }
  }, [data]);

  const screenWidth = Dimensions.get("window").width;

  
    if (tankData.length === 0) {
      return <Text>No data available</Text>;
    }
  
    // Extract unique tank types
    const tankTypes = [...new Set(tankData.map((entry) => entry.tankType))];
  
    // Prepare data series
    const datasets = tankTypes.map((tankType, index) => ({
      data: tankData
        .filter((entry) => entry.tankType === tankType)
        .map((entry) => entry.pressure),
      color: (opacity = 1) => `rgba(${index * 60}, 100, 200, ${opacity})`, // Assign different colors
      strokeWidth: 2,
    }));
  
    const formatDate = (timestamp) => {
      const date = new Date(timestamp);
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;  // MM/DD/YYYY format
    };
    
    // Extract time labels
    const labels = tankData.map((entry, index) => index % 5 === 0 ? formatDate(entry.time) : ""
    );

    const CustomLegend = ({ data }) => {
      return (
        <View style={styles.legendContainer}>
          {data.map((tank, index) => (
            <View key={index} style={styles.legendItem}>
              <Svg height="12" width="12">
                <Circle cx="6" cy="6" r="6" fill={tank.color} />
              </Svg>
              <Text style={styles.legendText}>{`Tank ${tank.tankType}`}</Text>
            </View>
          ))}
        </View>
      );
    };
  

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
      <View>
        <LineChart
          data={{
            labels,
            datasets,
          }}
          width={screenWidth}
          height={300}
          yAxisLabel=""
          yAxisSuffix=" psi"
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            propsForDots: {
              r: "4",
              strokeWidth: "2",
              stroke: "#ffa726",
            },
          }}
          bezier
        />
      </View>
      <CustomLegend data={datasets} />
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
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginBottom: 4,
  },
  legendText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#333',
  },
});