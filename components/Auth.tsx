import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { ApplicationProvider, Button, IndexPath, Input, Layout, Select, SelectItem, Text } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import TextInput from './TextInput'
import { customTheme } from './CustomTheme'

export default function TankTracker({ navigation }) {
    const route = useRoute();
    // let site = route.params?.site;


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
                onPress={() => navigation.navigate('Home')}
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
    }
});