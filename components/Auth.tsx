import { useEffect } from 'react';
import * as crypto from 'react-native-crypto';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import { setGithubToken } from '../scripts/APIRequests';
import { Button } from 'react-native';
import React from 'react';

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint: 'https://github.com/settings/connections/applications/Iv23liZ9ogrXCPdG093f',
};



export default function App() {
  const state:string  =  crypto.randomBytes(20).toString("utf-8");
  const newState = state
  const [request, response, promptAsync] = useAuthRequest(
    {
      state: state,
      clientId: 'Iv23liZ9ogrXCPdG093f',
      scopes: ['identity', 'repo'],
      redirectUri: makeRedirectUri({
        scheme: 'researchflowuofu'
      }),
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      console.log(response)
      console.log(newState)
      console.log(response.params.state)
      if(response.params.state === state)
      {
        const { code } = response.params;
        console.log(code)
      }
    }
  }, [response]);

  return (
    <Button
      disabled={!request}
      title="Login"
      onPress={() => {
        promptAsync();
      }}
    />
  );
}
