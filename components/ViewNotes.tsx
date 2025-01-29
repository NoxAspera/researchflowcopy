/**
 * View Notes
 * @author Blake Stambaugh, August O'Rourke
 * 12/5/24
 * 
 * View notes page. Will pull in data from the github repo and display it for the user in cards.
 */
import { useRoute } from '@react-navigation/native';
import { Card, Layout, Text } from '@ui-kitten/components';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { getFileContents } from '../scripts/APIRequests';
import { Entry } from '../scripts/Parsers';
import { customTheme } from './CustomTheme';
import { ScrollView } from 'react-native-gesture-handler';
import PopupProp from './Popup';
import { NavigationType, routeProp } from './types'



/**
 * @author Blake Stambaugh, August O'Rourke
 * @returns The add Notes page in our app
 */
export default function ViewNotes({ navigation }: NavigationType) {
  const route = useRoute<routeProp>();
  let site = route.params?.site;
  let notes: Entry[] = [];

  const [visible, setVisible] = useState(false);
  const [messageColor, setMessageColor] = useState("");
  const [message, setMessage] = useState("");

  const [data, setData] = useState<string[] | null>(null);

  // Get current notes for the site
  useEffect(() => {
    async function fetchData() {
      if (site && !data) {
        try {
          const parsedData = await getFileContents(`site_notes/${site}`);
          if (parsedData.success) {
            setData(
              parsedData.data
                .substring(parsedData.data.indexOf("\n"))
                .split(new RegExp("(___|---)"))
            );
          } else {
            setMessage(`Error: ${parsedData.error}`);
            setMessageColor(customTheme["color-danger-700"]);
            setVisible(true);
          }
        } catch (error) {
          console.error("Error retreiveing  notes:", error);
        }
      }
    }
    fetchData();
  }, [site]);
  return (
    <ScrollView style={styles.scrollContainer}>
      <Layout style={styles.container} level="1">
        {/* header */}
        <Text category="h1" style={{ textAlign: "center" }}>
          {site}
        </Text>

        <PopupProp
          popupText={message}
          popupColor={messageColor}
          onPress={setVisible}
          visible={visible}
        />

        {data?.map((entry) => {
          const dateMatch = /(\d+)-(\d+)-(\d+)/;
          const date = entry.match(dateMatch);
          // not sure why but split leaves a new line sometimes
          if (entry !== "___" && entry !== "---" && entry !== "\n") {
            return (
              <Card>
                <Text category="h3">{date?.at(0)}</Text>
                <Text category="p1">{entry}</Text>
              </Card>
            );
          }
        })}
      </Layout>
    </ScrollView>
  );
}

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'stretch',        // has button fill space horizontally
      justifyContent: 'space-evenly',
    },
    scrollContainer: {
      backgroundColor: '#1C2760'
    },

    label: {
        margin: 15,
        fontSize: 24,
        alignItems: 'flex-start'
      },
  normal: {
          margin: 15,
          fontSize: 16,
          alignItems: 'flex-start'
        },
    dropdownContainer: {
      marginTop: 50,
      alignItems: 'flex-start',
    },
    timeInput: {
      height: 40,
      margin: 15,
      width: 200,
      borderWidth: 1,
      padding: 10,
    },
    areaInput: {
      height: 200,
      margin: 15,
      width: 350,
      borderWidth: 1,
      padding: 10,
    },

    rowContainer:
    {
      flex: 1,
      backgroundColor: '#fff',
      flexDirection: 'row',
      alignItems: 'flex-start',        // has button fill space horizontally
      justifyContent: 'space-evenly',
    },
    homeButton: {
      flex: 1,                      // has button fill space vertically
      borderRadius: 10,
      justifyContent: 'center',     // this and alignItems places text in center of button
      alignItems: "center",
      margin: 10
    },
    homeButtonText: {
      flex: 1,
      fontSize: 30
    },
    header: {
      margin: 10,
      width: '100%', // Ensure the header takes full width
      alignItems: 'flex-start', // Center the text on the left
      marginBottom: 20, // Add space between the header and the buttons
    },
    headerText: {
      fontSize: 48,
      marginTop: 30,
    }
});