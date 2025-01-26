import React, { useState } from 'react';
import { View } from 'react-native';
import { Button } from '@ui-kitten/components';
import SettingsPage from './SettingsPage';


export default function SettingsPageTest() {
    const [visible, setVisible] = useState(false);
    return (
      <View>
          <Button onPress={() => setVisible(true)}>
            Press to go to settings
          </Button>
          <SettingsPage visbility={visible} onPress={setVisible}/>
      </View>
    );
  }
