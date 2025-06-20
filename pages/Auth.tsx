import { useEffect, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, AuthSessionResult} from 'expo-auth-session';
import { generateGithubToken, readUpdates, setGithubToken, tankTrackerOffline, tankTrackerSpinUp, updateDirectories } from '../scripts/APIRequests';
import { StyleSheet, ScrollView} from 'react-native';
import { NavigationType} from '../components/types'
import React from 'react';
import {Layout} from '@ui-kitten/components'
import HomeButtonProp from '../components/HomeButtonProp';
import { ThemeContext } from '../components/ThemeContext';
import { isConnected } from '../scripts/Helpers';
import LoadingScreen from '../components/LoadingScreen';

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint: `https://github.com/settings/connections/applications/${process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID}`,
};

export default function Auth({navigation}: NavigationType) {
    
  const themeContext = React.useContext(ThemeContext);
  const isDarkMode = themeContext.theme === 'dark';
  const [networkStatus, setNetworkStatus] = useState(true)
  const [loadingValue, setLoadingValue] = useState(false);

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID,
      scopes: ['repo'],
      redirectUri: makeRedirectUri({
        scheme: 'researchflowuofu'
      }),
    },
    discovery
  );

  async function handleResponse(response: AuthSessionResult | null)
  {
    if (response?.type === 'success') {
      setLoadingValue(true)
        const { code } = response.params;
        const {token_type, scopes, access_token} = (await generateGithubToken(code)).data
        setGithubToken(access_token);
        setLoadingText("Registering Tanks")
        await tankTrackerSpinUp();
        setLoadingText("Updating from Offline")
        await readUpdates()
        setLoadingText("Preparing Offline Mode")
        await updateDirectories()
        setLoadingValue(false)
        navigation.navigate("Home")
    }
  }

  useEffect(() => {
    handleResponse(response)
  }, [response]);

async function handlePress()
{
  setNetworkStatus(await isConnected())
  if(networkStatus)
  {
    await promptAsync();
  }
  else
  {
    setLoadingValue(true)
    setLoadingText("Registering Tanks")
    await tankTrackerOffline()
    setLoadingValue(false)
    navigation.navigate("Home")
  }
  
}
const [loadingText, setLoadingText] = useState("")
  return (
    <Layout style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
      <LoadingScreen visible={loadingValue} loadingText={loadingText}/>
        <HomeButtonProp
          text="Login With Github"
          color= "#FFFFFF"
          onPress={() => {
            handlePress()
          }}
        />
        </ScrollView>
    </Layout>
      
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
