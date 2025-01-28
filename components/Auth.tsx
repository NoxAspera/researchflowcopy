<<<<<<< HEAD
import { useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as config from "../config"
import { makeRedirectUri, useAuthRequest, AuthSessionResult} from 'expo-auth-session';
import { generateGithubToken, setGithubToken } from '../scripts/APIRequests';
import { StyleSheet, View, TouchableOpacity, ScrollView, TouchableWithoutFeedback, ImageBackground, Image } from 'react-native';
import { NavigationType} from './types'
=======
/**
 * Login Page
 * By Blake Stambaugh
 * 12/2/2024
 * 
 * This is the login page for the app. As of 12/2, it just has a text input
 * and does not check if the credentials are valid. This will be fixed in
 * a later update.
 */
import { StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { ApplicationProvider, Button, Layout, Text } from '@ui-kitten/components';
>>>>>>> main
import * as eva from '@eva-design/eva';
import { customTheme } from './CustomTheme'
import React from 'react';
import { ApplicationProvider, Layout, Text } from '@ui-kitten/components'
import HomeButtonProp from './HomeButtonProp';


WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint: 'https://github.com/settings/connections/applications/Iv23liZ9ogrXCPdG093f',
};

<<<<<<< HEAD
async function handleResponse(response: AuthSessionResult | null)
{
  if (response?.type === 'success') {
    console.log(response)
      const { code } = response.params;
      const {token_type, scopes, access_token} = (await generateGithubToken(code)).data
      console.log(scopes)
      console.log(token_type)
      setGithubToken(access_token);
=======
    // used for setting and remembering the input values
    const [emailValue, setEmailValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");

    return (
      <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
        <ApplicationProvider {...eva} theme={customTheme}>
          <Layout style={styles.container} level='1'>

            {/* header */}
            <Layout style={styles.loginText}>
              <Text category='h1' style={{textAlign: 'center'}}>Hello</Text>
              <Text category='h6' style={{textAlign: 'center'}}>Sign in using your GitHub credentials</Text>
            </Layout>

            {/* popup if user has missing credentials */}
            <PopupProp popupText='Missing Login Credentials' 
              popupColor={customTheme['color-danger-700']} 
              onPress={setVisible} 
              visible={visible}/>

            {/* text inputs */}
            <Layout style={styles.textInputContainer}>
              
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
                  style={{margin: 15, backgroundColor: "#06b4e0"}}>
                  {evaProps => <Text {...evaProps} category="h5" style={{color: "black"}}>SIGN IN</Text>}
              </Button>
            </Layout>
          </Layout>
        </ApplicationProvider>
      </KeyboardAvoidingView>
    );
>>>>>>> main
  }
}


export default function App({navigation}: NavigationType) {
  console.log(makeRedirectUri({scheme: 'researchflowuofu'}))
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: config.GITHUB_CLIENT_ID,
      scopes: ['repo'],
      redirectUri: makeRedirectUri({
        scheme: 'researchflowuofu'
      }),
    },
    discovery
  );

  useEffect(() => {
    handleResponse(response)
  }, [response]);

  return (
    <ApplicationProvider {...eva} theme={customTheme}>
      <Layout style={styles.container}>
        <HomeButtonProp
          text="Login With Github"
          onPress={() => {
            promptAsync();
            navigation.navigate("Home");
          }}
        />
      </Layout>
    </ApplicationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',        // has button fill space horizontally
    justifyContent: 'space-evenly',
  },
  scrollContainer: {
    paddingVertical: 16,
    alignItems: 'center', // Center cards horizontally
  },
});
