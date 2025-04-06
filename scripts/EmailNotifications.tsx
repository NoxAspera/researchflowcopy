/**
 * Email Notifications
 * @author David Schiwal
 * Updated: 4/5/25 - DS
 *
 * This code is made to send out notifications as needed to the person using the app,
 * assuming they have enabled them
 **/
import { useState } from 'react';
import { send, EmailJSResponseStatus } from '@emailjs/react-native'

/**
 * This function sends out email notifications to the person as necessary
 * @param emailAddress the email to send notifications to
 * @param name the name of the person in site notes/plan visits
 * @param sites 
 * @param dates 
 */
export async function sendEmailNotification(emailAddress: string, name: string, sites: string[], dates: string[]){
  //console.log('inEmailNotif');
  //console.log("sites length: " + sites.length);
  //const [email, setEmail] = useState<string>();
  //setEmail(emailAddress);
  //console.log('emailset');

  //need to pull visit data and add the visits to a list like in view notifications


  var messageString = "";
  for(var i = 0; i < sites.length; i++){
    messageString = messageString + sites[i] + " on: " + dates[i] + "\n"
  }
  //console.log('going to try');
  try {
    await send(
      'service_uv8moms',
      'template_wzdnmd1',
      {
        email: emailAddress,
        message: messageString,
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
  }
}


