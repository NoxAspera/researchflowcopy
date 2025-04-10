/**
 * View Notes
 * @author David Schiwal, Megan Ostlie
 * Updated: 3/23/25 - DS
 * 
 * View notifications page. Will pull in data from the github repo and display it for the user in cards.
 */
import { useRoute } from '@react-navigation/native';
import { Card, Layout, Text } from '@ui-kitten/components';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { getFileContents} from '../scripts/APIRequests';
import { Entry } from '../scripts/Parsers';
import { ScrollView } from 'react-native-gesture-handler';
import { NavigationType, routeProp } from './types'
import { parseVisits, VisitList } from '../scripts/Parsers'

/**
 * @author David Schiwal
 * @returns The view notifications page in our app
 */
export default function ViewNotifications({ navigation }: NavigationType) {
  const route = useRoute<routeProp>();
  let site = route.params?.site;
  let notes: Entry[] = [];

  // State to hold parsed data
  const [data, setData] = useState<VisitList>(null);
  // Get current visits
  useEffect(() => {
      async function fetchData() {
          if (data == null) {
              try {
                  const parsedData = await processVisits();
                  setData(parsedData); // Update state with the latest entry
              } catch (error) {
                  console.error("Error processing notes:", error);
              }
          }
      }
      fetchData();
  },[]);

  // checks if visit is today or later and adds it to list to display if so
  let visitData = [];
  if(data){
    if(data.visits){
      for(let i = 0; i < data.visits.length; i++){
        if(data.visits[i]){        
          const visit = data.visits[i]
          const visitDate = new Date(visit.date)
          const now = new Date();
          //apparently getDate only gets the day of the month not the whole date so you have to check things individually
          const day = now.getDate();
          const month = now.getMonth() + 1;
          const year = now.getFullYear();
          //if year greater add visit            
          if(visitDate.getFullYear() > year){
            visitData.push({visit: visit})
          }
          else if(visitDate.getFullYear() == year){
            //if year equal but month greater add visit
            if((visitDate.getMonth() + 1) > month){
              visitData.push({visit: visit})
            }
            else if((visitDate.getMonth() + 1) == month){
              //if year and month equal but day equal or greater add visit
              if(visitDate.getDate() >= now.getDate()){
                visitData.push({visit: visit})
              }
            }
          }
        }
      }
    }
  }
  //sort visitData by date
  visitData = visitData.sort((a, b) => {
    if(a.visit.date){
      const dateA = new Date(a.visit.date);
      if(b.visit.date){
        const dateB = new Date(b.visit.date);
        return dateA.getTime() - dateB.getTime();
      }
    }
  })

  return (
    <ScrollView style={styles.scrollContainer}>
      <Layout style={styles.container} level="1">
        {visitData.map((visit) => (
            <Card>
                <Text category="h5">{"Upcoming visit: " + visit.visit.date}</Text>
                <Text category="p1">{"Person: " + visit.visit.name}</Text>
                <Text category="p1">{"Site: " + visit.visit.site}</Text>
                <Text category="p1">{"Equipment: " + visit.visit.equipment}</Text>
                <Text category="p1">{"Notes: " + visit.visit.notes}</Text>
            </Card>
        ))}
      </Layout>
    </ScrollView>
  );
}

/**
 * @author Megan Ostlie
 *  a function that pulls the current note document for the specified site from GitHub
 *  @param siteName the name of the site
 * 
 * @returns a VisitsList object that contains the information of the given document
 */
async function processVisits() {
    const fileContents = await getFileContents(`researchflow_data/visits`);
    if(fileContents.data){
      return parseVisits(fileContents.data)
    }
    else
    {
      return null
    }
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