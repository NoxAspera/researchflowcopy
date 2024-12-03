/**
 * Login Page
 * By Blake Stambaugh
 * 12/2/2024
 * 
 * This is the login page for the app. As of 12/2, it just has a text input
 * and does not check if the credentials are valid. This will be fixed in
 * a later update.
 */
import { StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { ApplicationProvider, Button, Layout, Text } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import TextInput from './TextInput'
import { customTheme } from './CustomTheme'
import PopupProp from './Popup';

export default function TankTracker({ navigation }) {
    const route = useRoute();

    // will set the no email/password notification to visible
    const [visible, setVisible] = useState(false);

    // helper method that will make sure the user has entered credentials
    function checkTextEntry() {
        if (emailValue != "" && passwordValue != "") {
            navigation.navigate('Home')
        }
        else {
          setVisible(true)
        }
    }
    // used for setting and remembering the input values
    const [emailValue, setEmailValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");

    return (
      <ApplicationProvider {...eva} theme={customTheme}>
        <Layout style={styles.container} level='1'>
          {/* header */}
          <Layout style={styles.loginText}>
            <Text category='h1' style={{textAlign: 'center'}}>Hello</Text>
            <Text category='s1' style={{textAlign: 'center'}}>Sign in using your GitHub credentials</Text>
          </Layout>

          {/* popup if user has missing credentials */}
          <PopupProp popupText='Missing Login Credentials' 
            popupColor={customTheme['color-danger-700']} 
            onPress={setVisible} 
            visible={visible}/>

          <Layout style={styles.textInputContainer}>
            {/* text inputs */}
            {/* Email input */}
            <TextInput 
                labelValue={emailValue} 
                onTextChange={setEmailValue} 
                placeholder='Email' 
                style={styles.textInput}/>

            {/* Password input */}
            <TextInput 
                labelValue={passwordValue} 
                onTextChange={setPasswordValue} 
                placeholder='Password' 
                style={styles.textInput} 
                secureEntry={true}/>
            
            {/* Sign in button */}
            <Button
                onPress={checkTextEntry}
                appearance='filled'
                status='primary'
                style={{margin: 15}}>
                SIGN IN
            </Button>
          </Layout>
        </Layout>
      </ApplicationProvider>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'stretch',        // has button fill space horizontally
      justifyContent: 'space-evenly',
    },
    loginText: {
        flex: 1,
        alignItems: 'stretch',        // has button fill space horizontally
        justifyContent: 'center',
        backgroundColor: customTheme['color-primary-700']
    },
    textInputContainer: {
        flex: 3,
        justifyContent: 'flex-end'
    },
    textInput: {
      margin: 15
    },
});