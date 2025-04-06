/**
 * Email Notifications
 * @author David Schiwal
 * Updated: 4/5/25 - DS
 *
 * This code is made to send out notifications as needed to the person using the app,
 * assuming they have enabled them
 **/
import { useState, useEffect } from 'react';
import { send, EmailJSResponseStatus } from '@emailjs/react-native'
import { parseVisits, VisitList } from '../scripts/Parsers'
import { getFileContents } from '../scripts/APIRequests';
import { VisitInfo } from './Parsers';

/**
 * This function sends out email notifications to the person as necessary
 * @param emailAddress the email to send notifications to
 * @param name the name of the person in site notes/plan visits
 */
export async function sendEmailNotification(emailAddress: string, name: string){
  console.log("in send notifications")

  //need to pull visit data and add the visits to a list like in view notifications
  // State to hold parsed data
  //const [data, setData] = useState<VisitList>(null);
  let data = null;
  // Get current visits
  console.log("fetching visits")
  //const loadEmail = async () =>
  //useEffect(() => {
      async function fetchData() {
          if (data == null) {
              try {
                  const parsedData = await processVisits();
                  console.log("setting data")
                  data = parsedData;
                  //setData(parsedData); // Update state with the latest entry
                  // checks if visit is today or later and adds it to list to display if so
                  let visitData = [];
                  if(data){
                    console.log("Data.visits length: " + data.visits.length);
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
                              if(visitDate.getDate() >= day){
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
                  //now visitData has all the visits after today and sorted so find the ones within two weeks of now
                  console.log("checking if dates are within two weeks")
                  var notifDate = new Date();
                  console.log("visitData length: " + visitData.length);
                  notifDate.setDate(notifDate.getDate() + 14); //this is how you have to update the date to take care of incrementing months properly
                  let notifyVisits = [];
                  for(var i = 0; i < visitData.length; i++){
                    console.log("visitData[i].date: " + visitData[i].visit.date)
                    console.log("notifDate: " + notifDate)
                    if(new Date(visitData[i].visit.date) <= notifDate){
                      notifyVisits.push(visitData[i])
                    }
                  }
                  //NEED TO CHECK FOR NAME ABOVE AS WELL
                  
                  
                  //this adds the sites and dates to a string and formats it for the email
                  var messageString = "";
                  console.log("notifyVisists length: " + notifyVisits.length);
                  for(var i = 0; i < notifyVisits.length; i++){
                    messageString = messageString + notifyVisits[i].visit.site + " on: " + notifyVisits[i].visit.date + "\n"
                  }
                  console.log("printing message")
                  console.log("message: " + messageString);
                  /*try {
                    await send(
                      'service_uv8moms',
                      'template_wzdnmd1',
                      {
                        email: emailAddress,
                        //message: messageString,
                      },
                      {
                        publicKey: '0wkPKMrUY3hyX3Tsu',
                      },
                    );

                    console.log('SUCCESS!');
                  } catch (err) {
                    if (err instanceof EmailJSResponseStatus) {
                      console.log('EmailJS Request Failed...', err);
                    }

                    console.log('ERROR', err);
                  }*/
              } catch (error) {
                  console.error("Error processing notes:", error);
              }
          }
      }
      fetchData();
  //},[]);
  console.log("done fetching visits")

  
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

