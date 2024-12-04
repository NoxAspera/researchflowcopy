import * as eva from '@eva-design/eva';
import { useRoute } from '@react-navigation/native';
import { ApplicationProvider, Card, Layout, Text } from '@ui-kitten/components';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { getFileContents } from '../scripts/APIRequests';
import { Entry, buildNotes, parseNotes, ParsedData } from '../scripts/Parsers';
import { customTheme } from './CustomTheme';
import { NaviProp } from './types';
import { ScrollView } from 'react-native-gesture-handler';
import PopupProp from './Popup';



/**
 * @author Blake Stambaugh, August O'Rourke
 * @returns The add Notes page in our app
 */
export default function ViewNotes({ navigation }: NaviProp) {

    const [visible, setVisible] = useState(false);
    const [messageColor, setMessageColor] = useState("");
    const [message, setMessage] = useState("");
    const route = useRoute();
    let site = route.params?.site;
    let notes: Entry[] = []

    const [data, setData] = useState<string[] | null>(null);

    // Get current notes for the site
    useEffect(() => {
        async function fetchData() {
            if (site && !data) {
                try {
                    const parsedData = await getFileContents(site);
                    if(parsedData.success)
                    {
                      setData(parsedData.data.substring(parsedData.data.indexOf("\n")).split(new RegExp("(___|---)")))
                    }
                    else
                    {
                      setMessage(`Error: ${parsedData.error}`);
                      setMessageColor(customTheme['color-danger-700']);
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
      
      <ApplicationProvider {...eva} theme={customTheme}>
        <ScrollView style = {styles.scrollContainer}>
          <Layout style={styles.container} level='1'>
            {/* header */}
            <Text category='h1'
              style={{textAlign: 'center'}}>{site}</Text>

          <PopupProp popupText={message} 
            popupColor={messageColor} 
            onPress={setVisible} 
            visible={visible}/>

          {data?.map((entry) =>
            {
              const dateMatch = /(\d+)-(\d+)-(\d+)/
              const date = entry.match(dateMatch)
              // not sure why but split leaves a new line sometimes
              if (entry !== "___" && entry !== "---" && entry !== "\n"){
                return (
                <Card>
                  <Text category='h3'>
                    {date?.at(0)}
                  </Text>
                  <Text>
                    {entry}
                  </Text>
                </Card>)    
              } 
            }
         )}
          </Layout>
        </ScrollView>
      </ApplicationProvider>
      
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
    /*picker: {
      height: 65,
      alignItems: 'flex-start',
      width: '50%',
      marginBottom: 25
    },*/
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