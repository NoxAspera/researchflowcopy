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
export function loadStoredValues() {
    //used for pulling stored email
    const [email, setEmail] = useState('');
    const loadEmail = async () => {
        try {
          const savedEmail = await AsyncStorage.getItem('email');
          console.log(savedEmail)
          if (savedEmail != null) {
            setEmail(savedEmail);
          }
        } catch (e) {
          console.error("Failed to retrieve the previous email: ", e);
        }
    }
    //used for pulling stored name
    const [name, setName] = useState('');
    const loadName = async () => {
        try {
          const savedName = await AsyncStorage.getItem('name');
          console.log(savedName)
          if (savedName != null) {
            setName(savedName);
          }
        } catch (e) {
          console.error("Failed to retrieve the previous name: ", e);
        }
    }
    useEffect(() => {
        loadName();
        loadEmail();
      }, []);

    return([email, name])
}

  