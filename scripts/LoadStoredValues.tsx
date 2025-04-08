/**
 * Load Stored Values
 * @author David Schiwal
 * Updated: 4/5/25 - DS
 *
 * This code is made to load stored data on the phone 
 **/
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
/**
 * @author David Schiwal
 * This method loads the stored email and name from the phone, if there is one and returns them
 * otherwise returns array of two empty strings
 * @returns a string array with the email and name of the person who enabled notifications
 */
export async function loadStoredValues() {
    //console.log("in load stored values")
    //used for pulling stored email
    //const [email, setEmail] = useState('');
    var email = "";
    
    const loadEmail = async () => {
      //console.log("in load email")
        try {
          const savedEmail = await AsyncStorage.getItem('email');
          //console.log(savedEmail)
          if (savedEmail != null) {
            //console.log("setting name")
            email = savedEmail;
          }
        } catch (e) {
          console.error("Failed to retrieve the previous email: ", e);
        }
    }
    //used for pulling stored name
    //const [name, setName] = useState('');
    var name = "";
    const loadName = async () => {
      //console.log("in load name")
        try {
          const savedName = await AsyncStorage.getItem('name');
          //console.log(savedName)
          if (savedName != null) {
            //console.log("setting name")
            name = savedName;
          }
        } catch (e) {
          console.error("Failed to retrieve the previous name: ", e);
        }
    }
    //console.log("calling useEffect")
    //useEffect(() => {
        await loadName();
        await loadEmail();
      //}, []);
    console.log("returning email: " + email + " name: " + name + " from loadStored")
    return([email, name])
}

  