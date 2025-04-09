/**
 * Load Stored Values
 * @author David Schiwal
 * Updated: 4/8/25 - DS
 *
 * This code is made to load stored data on the phone 
 **/
import AsyncStorage from '@react-native-async-storage/async-storage';
/**
 * @author David Schiwal
 * This method loads the stored email and name from the phone, if there is one and returns them
 * otherwise returns array of two empty strings
 * @returns a string array with the email and name of the person who enabled notifications
 */
export async function loadStoredValues() {
    var email = "";    
    const loadEmail = async () => {
        try {
          const savedEmail = await AsyncStorage.getItem('email');
          if (savedEmail != null) {
            email = savedEmail;
          }
        } catch (e) {
          console.error("Failed to retrieve the previous email: ", e);
        }
    }
    //used for pulling stored name
    var name = "";
    const loadName = async () => {
        try {
          const savedName = await AsyncStorage.getItem('name');
          if (savedName != null) {
            name = savedName;
          }
        } catch (e) {
          console.error("Failed to retrieve the previous name: ", e);
        }
    }
    await loadName();
    await loadEmail();
    return([email, name])
}

  