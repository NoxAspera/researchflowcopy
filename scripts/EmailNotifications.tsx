import { useState } from 'react';
import { send, EmailJSResponseStatus } from '@emailjs/react-native'

/**
 * 
 * @param email the email the notifications are being sent to
 */
export async function sendEmailNotification(emailAddress: string, sites: string[], dates: string[]){
  console.log('inEmailNotif');
  console.log("sites length: " + sites.length);
  //const [email, setEmail] = useState<string>();
  //setEmail(emailAddress);
  //console.log('emailset');
  var messageString = "";
  for(var i = 0; i < sites.length; i++){
    messageString = messageString + sites[i] + " on: " + dates[i] + "\n"
  }
  console.log('going to try');
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


