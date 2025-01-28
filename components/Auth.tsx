import { useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as config from "../config"
import { makeRedirectUri, useAuthRequest, AuthSessionResult} from 'expo-auth-session';
import { generateGithubToken, setGithubToken } from '../scripts/APIRequests';
import { StyleSheet, View, TouchableOpacity, ScrollView, TouchableWithoutFeedback, ImageBackground, Image } from 'react-native';
import { NavigationType} from './types'
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

async function handleResponse(response: AuthSessionResult | null)
{
  if (response?.type === 'success') {
    console.log(response)
      const { code } = response.params;
      const {token_type, scopes, access_token} = (await generateGithubToken(code)).data
      console.log(scopes)
      console.log(token_type)
      setGithubToken(access_token);
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
