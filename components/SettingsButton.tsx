import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Icon, IconElement } from '@ui-kitten/components';
import SettingsPage from './SettingsPage';

const gearIcon = (props): IconElement => <Icon {...props} name='settings-outline' />;


export default function SettingsPageTest() {
    const [visible, setVisible] = useState(false);
    return (
      <View>
          <Button onPress={() => setVisible(true)} 
          appearance="ghost"
          accessoryLeft={gearIcon} 
          size='large'/>
          <SettingsPage visbility={visible} onPress={setVisible}/>
      </View>
    );
  }
