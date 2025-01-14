/**
 * Login Page
 * By Blake Stambaugh
 * 12/2/2024
 * 
 * This is the login page for the app. As of 12/2, it just has a text input
 * and does not check if the credentials are valid. This will be fixed in
 * a later update.
 */
import { StyleSheet, Linking } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { ApplicationProvider, Button, Layout, Text } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import TextInput from './TextInput'
import { customTheme } from './CustomTheme'
import PopupProp from './Popup';
import { setGithubToken } from '../scripts/APIRequests';
import * as WebBrowser from 'expo-web-browser'
import { NavigationType } from './types'
import * as auth from 'react-native-app-auth'


export default function Login({ navigation }: NavigationType) {
  const authData = await pb.collection('users').authWithOAuth2({
    provider: 'github',
    urlCallback: async () => {
        // open the Google sign-in url in the default browser
        await Linking.openURL("https://github.com/Mostlie/CS_4000_mock_docs/c");
    }
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