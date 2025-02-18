import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Icon, IconElement } from '@ui-kitten/components';
import { NavigationType, routeProp } from './types'

const bellIcon = (props): IconElement => <Icon {...props} name='bell-outline' />;


export default function NotificationsButton({ navigation }: NavigationType) {
    return (
      <View>
          <Button testID='notificationsButton'
          onPress={() => navigation.navigate("ViewNotifications")} 
          appearance="ghost"
          accessoryLeft={bellIcon} 
          size='large'/>
      </View>
    );
  }
