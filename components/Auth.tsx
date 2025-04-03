import { useEffect, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as config from "../config"
import { makeRedirectUri, useAuthRequest, AuthSessionResult} from 'expo-auth-session';
import { generateGithubToken, readUpdates, setGithubToken, tankTrackerOffline, tankTrackerSpinUp, updateDirectories } from '../scripts/APIRequests';
import { StyleSheet, ScrollView} from 'react-native';
import { NavigationType} from './types'
import React from 'react';
import {Layout} from '@ui-kitten/components'
import HomeButtonProp from './HomeButtonProp';
import * as Network from 'expo-network'
import LoadingScreen from './LoadingScreen';


WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint: 'https://github.com/settings/connections/applications/Iv23liZ9ogrXCPdG093f',
};


async function isConnected()
{
  let check = (await Network.getNetworkStateAsync()).isConnected
  return check
}

export default function App({navigation}: NavigationType) {
  const [networkStatus, setNetworkStatus] = useState(true)
  const [loadingValue, setLoadingValue] = useState(false);

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

  async function handleResponse(response: AuthSessionResult | null)
  {
    if (response?.type === 'success') {
      setLoadingValue(true)
      console.log(response)
        const { code } = response.params;
        
        const {token_type, scopes, access_token} = (await generateGithubToken(code)).data
        setGithubToken(access_token);
        await tankTrackerSpinUp();
        await readUpdates()
        await updateDirectories()
        setLoadingValue(false)
    }
  }

  useEffect(() => {
    handleResponse(response)
  }, [response]);

async function handlePress()
{
  setNetworkStatus(await isConnected())
  console.log(networkStatus)
  if(networkStatus)
  {
    await promptAsync();
  }
  else
  {
    setLoadingValue(true)
    await tankTrackerOffline()
    setLoadingValue(false)
  }
  navigation.navigate("Home")
}

  return (
    <Layout style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
      <LoadingScreen visible={loadingValue} />
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
