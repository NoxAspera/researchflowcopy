/**
 * Diagnostics
 * @author Megan Ostlie
 * 3/30/25
 *
 * This page is used for plotting up tank values and connecting to air.utah.edu diagnostics
 */
import { StyleSheet, KeyboardAvoidingView, Linking, Dimensions, View} from "react-native";
import React, { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import { Button, Text } from "@ui-kitten/components";
import { NavigationType, routeProp } from "../components/types";
import { ScrollView } from "react-native-gesture-handler";
import { processNotes, ParsedData, Entry, TankInfo } from "../scripts/Parsers";
import { LineChart, XAxis, YAxis } from 'react-native-svg-charts';
import { Svg, Line, Rect } from 'react-native-svg';
import * as scale from 'd3-scale';

const extractNumericValue = (pressure: string | null): number | null => {
  if (!pressure) return null; // Handle null or undefined
  const match = pressure.match(/\d+(\.\d+)?/); // Match integer or decimal numbers
  if (match) {
    const number = parseFloat(match[0]); // Use parseFloat to handle decimals properly
    return isNaN(number) ? null : number; // Return null if it's NaN
  }
  return null;
};

const groupTankData = (entries: Entry[]) => {
  const latestTankByType: Record<string, string> = {}; // Stores latest tank ID per type
  const tankTimestamps: Record<string, string> = {}; // Stores the latest timestamp per tank type
  const tankMap: Record<string, { time: string; pressure: number }[]> = {}; // Stores all pressures for latest tank ID
  let oneYearAgo = new Date();
  oneYearAgo.setDate(oneYearAgo.getDate() - 365);

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
    ["low_cal", "mid_cal", "high_cal", "lts", "n2_pressure"].forEach((tankType) => {
      if (tankType === "n2_pressure") {
        const tank = entry[tankType as keyof Entry] as string | null;
        if (tank) {
          const pressure = extractNumericValue(tank);
          if (pressure !== null && !isNaN(pressure) && (new Date(entry.time_in) > oneYearAgo)) {
            if (!tankMap["N2"]) {
              tankMap["N2"] = [];
            }
            tankMap["N2"].unshift({ time: entry.time_in || "Unknown", pressure });
          }
        }
      } else {
        const tank = entry[tankType as keyof Entry] as TankInfo | null;
        if (tank && tank.id === latestTankByType[tankType]) {
          const pressure = extractNumericValue(tank.pressure);
          if (pressure !== null && !isNaN(pressure)) {
            if (!tankMap[latestTankByType[tankType]]) {
              tankMap[latestTankByType[tankType]] = [];
            }
            tankMap[latestTankByType[tankType]].unshift({ time: entry.time_in || "Unknown", pressure });
          }
        }
      }
    });
  });

  return tankMap;
};

function getTimeBetweenDates(date1, date2) {
  const timeDiffMs = Math.abs(date2.getTime() - date1.getTime());
  const seconds = Math.floor(timeDiffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  return {
    days,
    hours: hours % 24,
    minutes: minutes % 60,
    seconds: seconds % 60,
    milliseconds: timeDiffMs % 1000
  };
}

function daysUntilEmpty(prevPress, prevDate, currPress, currDate) {
  // get change of pressure over time, assume it is linear
  let changeOfPress = currPress - prevPress;

  // if change of pressure is positive, then it got replaced, no need to check date
  // if change of pressure is 0, then there is no need to check date bc nothing has changed
  if (changeOfPress >= 0) {
    return 365;
  }

  // get date difference
  let currTime = new Date(currDate);
  let prevTime = new Date(prevDate);
  let changeOfDate = getTimeBetweenDates(prevTime, currTime).days; // get the difference of time in days

  // if changeOfDate is 0, then the previous entry was also made today
  if (changeOfDate == 0) {
    return 365;
  }
  
  let rateOfDecay = changeOfPress / changeOfDate; // measured in psi lost per day

  // solve for when the tank should be under 500 psi
  let days = Math.trunc((-prevPress / rateOfDecay) - changeOfDate);
  return days;
}

export default function Diagnostics({ navigation }: NavigationType) {
  const route = useRoute<routeProp>();
  let site = route.params?.site;
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

  const formatDate = (timestamp: string): string => {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear().toString().substring(2,4)}`;
  };

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
        {evaProps => <Text {...evaProps} category="h6" style={{color: "black"}}>Go to Data Diagnostics</Text>}
        </Button>

        <Text style={{ textAlign: "center", fontSize: 18, fontWeight: "bold", margin: 10 }}>
          {"Tank Pressure Over Time"}
        </Text>
        {Object.keys(tankData).length === 0 && (
          <Text style={{ textAlign: "center", fontSize: 16, fontWeight: "bold", margin: 10, color: 'red' }}>
            {"No  recent tank data available for this site."}
          </Text>
        )}
        {Object.entries(tankData).map(([tankId, data]) => {
          const validData = data.filter(d => !isNaN(new Date(d.time).getTime()));
          const timestamps = validData.map(d => new Date(d.time).getTime());
          const minTimestamp = Math.min(...timestamps); // Find the earliest timestamp for normalization
          let normalizedX = timestamps.map(ts => ts - minTimestamp); // Normalize timestamps so that the first point is at `0`
          let pressures = validData.map(d => d.pressure); // Y values (pressures)
          let lastX = normalizedX[normalizedX.length - 1];

          // Compute the x-position for the predicted zero-pressure date
          let daysUntilZero;
          if (validData.length >= 2) {
            daysUntilZero = daysUntilEmpty(pressures[pressures.length - 2], timestamps[timestamps.length - 2], pressures[pressures.length - 1], timestamps[timestamps.length - 1]);
          } else {
            daysUntilZero = 365;
          }
          let predictedZeroDate = new Date(validData[validData.length - 1].time)
          predictedZeroDate.setDate(predictedZeroDate.getDate() + daysUntilZero);
          const predictedTimestamp = predictedZeroDate.getTime();
          const predictedX = predictedTimestamp - minTimestamp;

          // Append this new point to the dataset
          const extendedData = [
            ...pressures.map((y, i) => ({ x: normalizedX[i], y })),
          { x: predictedX, y: 0 }, // New predicted zero-pressure point
          ];
          pressures.push(0);
          normalizedX.push(predictedX);
          const xScale = scale.scaleLinear()
            .domain([0, predictedX])
            .range([0, screenWidth-80]);

          //If there is only one data point for the tank, adjust lastX so dotted line is visible at beginning of graph
          if (lastX == 0) {
            lastX = predictedX * 0.01;
          }

          return (
            <View key={tankId} style={{ marginVertical: 10, }}>
              <Text style={{ textAlign: "center", fontSize: 16, fontWeight: "bold" }}>
                {`Tank ID: ${tankId}`}
              </Text>
              <Text style={{ textAlign: "center", fontSize: 14, fontWeight: "bold" }}>
                {`Predicted empty date: ${formatDate(predictedZeroDate.toISOString())}`}
              </Text>
      
              <View style={{ flexDirection: 'row', height: 250, padding: 20 }}>
                {/* Y Axis */}
                <YAxis
                  data={pressures}
                  contentInset={{ top: 10, bottom: 15 }}
                  svg={{ fontSize: 12, fill: 'black' }}
                  numberOfTicks={5}
                  scale={scale.scaleLinear}
                  formatLabel={(value) => `${value}`}
                />

                {/* Line Chart with proper x-axis spacing */}
                <View style={{ flex: 1, marginLeft: 10, height:225 }}>
                  <LineChart
                    style={{ flex: 1 }}
                    data={extendedData}
                    svg={{ stroke: 'blue', strokeWidth: 1.5 }}
                    contentInset={{ top: 10, bottom: 10 }}
                    xAccessor={({ item }) => item.x} // Ensure x-values are used correctly
                    yAccessor={({ item }) => item.y}
                  >
                    <Line
                      x1={xScale(lastX)}
                      y1={"0"}
                      x2={xScale(lastX)}
                      y2={"100%"}
                      stroke="red"
                      strokeWidth={2}
                      strokeDasharray={[5, 5]} // Dashed line
                    />
                  </LineChart>
      
                  {/* Custom Axis Lines */}
                  <Svg height="225" width="100%" style={{ position: 'absolute', left: 0, top: 0 }}>
                    {/* X Axis Line */}
                    <Line x1="0" y1="200" x2="100%" y2="200" stroke="black" strokeWidth="2" />

                    {/* Y Axis Line */}
                    <Line x1="0" y1="0" x2="0" y2="200" stroke="black" strokeWidth="2" />

                    {/* Background colors for chart */}
                    <Rect x="0" y="0" width="100%" height="30%" fill="green" opacity={0.2} />
                    <Rect x="0" y="67" width="100%" height="30%" fill="yellow" opacity={0.2} />
                    <Rect x="0" y="134" width="100%" height="30%" fill="red" opacity={0.2} />
                  </Svg>
          
                  {/* X Axis with correctly spaced labels */}
                  <XAxis
                    style={{ marginTop: 10, height: 20 }} // Adjust height
                    data={normalizedX}
                    scale={scale.scaleTime}
                    xAccessor={({ item }) => item}
                    formatLabel={(value, index) => {
                      const totalLabels = validData.length;
                      // Always show first label
                      if (index === 0) {
                        return formatDate(validData[index].time);
                      }
                      // If first and last labels are not too close together compared to predicted zero date, show last recorded date
                      if ((index === totalLabels - 1) && ((normalizedX[index] - normalizedX[0]) > (predictedX * 0.3))) {
                        return formatDate(validData[index].time);
                      }
                      // Add label for predicted zero date
                      if (index === totalLabels) {
                        return formatDate(predictedZeroDate.toISOString());
                      }
                      return ""; // Hide other labels
                    }}
                    contentInset={{ left: 25, right: 25 }}
                    svg={{ fontSize: 12, fill: 'black' }}
                  />
                </View>
              </View>
              <Text style={{ textAlign: "center", fontSize: 12, fontWeight: "bold" }}>
                {"*Data after the red dotted line is projected data"}
              </Text>
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
