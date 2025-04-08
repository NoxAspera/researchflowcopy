/**
 * Email Notifications
 * @author David Schiwal
 * Updated: 4/8/25 - DS
 *
 * This code is made to send out notifications as needed to the person using the app,
 * assuming they have enabled them
 * 
 * Note: CANT CALL ANYTHING WITH "use" in the name in this file or throws hook error
 **/
import { parseVisits } from '../scripts/Parsers';
import { getFileContents } from '../scripts/APIRequests';
import { send, EmailJSResponseStatus } from '@emailjs/react-native' //imports for sending email don't delete
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getDirectory } from '../scripts/APIRequests';
import { loadStoredValues } from '../scripts/LoadStoredValues';

/**
 * @author David Schiwal
 * This function sends out email notifications to the person as necessary
 * @param emailAddress the email to send notifications to
 * @param name the name of the person in site notes/plan visits
 */
export async function sendEmailNotification(emailAddress: string, name: string){
  if(emailAddress == "Auth" && name == "Load"){ 
    const loadedVals = await loadStoredValues();
    emailAddress = loadedVals[0]
    name = loadedVals[1] 
  }
  if(emailAddress == null || name == null){
    return
  }
  await checkAndRemoveOldDates(name);
  //Holds parsed data
  let data = null;
  // Get current visits
  async function fetchData() {
      if (data == null) {
          try {
              const parsedData = await processVisits();
              data = parsedData;
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
              var notifDate = new Date();
              //currently notifications set to when site visit is within two weeks(14 days)
              //to change when sent out change value being added to notifDate.getDate()
              notifDate.setDate(notifDate.getDate() + 14); //this is how you have to update the date to take care of incrementing months properly
              let notifyVisits = [];
              //checks for date being within notification range then for name match
              for(var i = 0; i < visitData.length; i++){
                if(new Date(visitData[i].visit.date) <= notifDate){
                  if(visitData[i].visit.name == name){
                    if(await loadSiteDate(visitData[i].visit.site, name) == null){
                      notifyVisits.push(visitData[i])
                    }                    
                  }                    
                }
              }
              //this adds the sites and dates to a string and formats it for the email
              var messageString = "";
              for(var i = 0; i < notifyVisits.length; i++){                
                messageString = messageString + notifyVisits[i].visit.site + " on: " + notifyVisits[i].visit.date + "\n"
                //save every site date that was notified
                saveSiteDate(notifyVisits[i].visit.site, notifyVisits[i].visit.date, name)
              }
              //send the email
              if(messageString != ""){
                try {
                  await send(
                    //if need to replace
                    //put service id here
                    'service_uv8moms',
                    //put template id here
                    'template_wzdnmd1',
                    {
                      email: emailAddress,
                      message: messageString,
                    },
                    {
                      publicKey: '0wkPKMrUY3hyX3Tsu',
                    },
                  );
                } catch (err) {
                  if (err instanceof EmailJSResponseStatus) {
                    console.log('EmailJS Request Failed...', err);
                  }
                  console.log('ERROR', err);
                }
              }
              
          } catch (error) {
              console.error("Error processing notes:", error);
          }
      }
  }
  await fetchData();
  return
}
/**
 * @author Megan Ostlie
 * a function that pulls the current note document for the specified site from GitHub 
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

/**
 * @author David Schiwal
 * This method saves the given site and date of the site visit to the device
 * @param site the site to save the visit notification date sent out for
 * @param date the date of the site visit
 * @param name the name of person being notified
 */
async function saveSiteDate(site: string, date: string, name: string) {
  try {
    await AsyncStorage.setItem(site + name, date);
  } catch (e) {
    console.error("Failed to save the current site: ", e);
  }
}

/**
 * @author David Schiwal
 * This method loads the given site and date of the site visit from the device
 * @param site the site to see if there is a saved date for
 * @param name the name of person being notified
 * @returns null if no saved visit notification date, otherwise date of site visit that was notified
 */
async function loadSiteDate(site: string, name: string){
  try {
    const savedDate = await AsyncStorage.getItem(site + name);
    return savedDate;
  } catch (e) {
    console.error("Failed to retrieve the previous siteDate: ", e);
  }
}

/**
 * fetches a list of all site names
 * @returns list of site names
 */
async function fetchSiteNames(): Promise<string[]>{
  try {
    let names;
    let mobile_names;
    names = await getDirectory("site_notes");
      mobile_names = await getDirectory("site_notes/mobile");
    if(names?.success)
    {
      if (mobile_names?.success) {
        names.data.push(...mobile_names.data.map(item => "mobile/" + item));
      }
      return(names.data);
    }
  }
  catch (error)
  {
    console.error("Error processing site names:", error);
  }
};

/**
 * @author David Schiwal
 * Checks old notified dates and clears them if date has passed
 * @param name the name of the person who was notified
 */
async function checkAndRemoveOldDates(name: string){
  const currDate = new Date();
  var siteList: string[] = await fetchSiteNames();
  //checks every site to see if it has a saved date  
  for(var i = 0; i < siteList.length; i++){
    var siteDateString: string = await loadSiteDate(siteList[i], name)
    if(siteDateString != null){
      //if it has a saved date check if todays date is after that date
      var siteDate: Date = new Date(siteDateString);
      if(siteDate < currDate){
        //if todays date is after saved date, reset saved date to null
        removeSiteDate(siteList[i], name)
      }
    }    
  }
}

/**
 * @author David Schiwal
 * This method removes the given site and date of the site visit to the device
 * @param site the site to save the visit notification date sent out for
 * @param name the name of person who was notified
 */
async function removeSiteDate(site: string, name: string) {
  try {
    await AsyncStorage.removeItem(site + name);
  } catch (e) {
    console.error("Failed to save the current site: ", e);
  }
}
