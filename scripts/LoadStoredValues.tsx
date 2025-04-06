import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
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
const [nameValue, setName] = useState('');
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
}

  