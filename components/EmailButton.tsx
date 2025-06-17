/**
 * Info Button
 * @author Callum O'Rourke
 * 
 * This button is to enable email notifications, it should be at the top-right of every screen
 */
import React from "react";
import { Button, Icon, IconElement } from "@ui-kitten/components";
import { NavigationType } from "./types";

// preload info icon for button
const emailIcon = (props): IconElement => (
  <Icon {...props} name="email-outline" />
);

const EmailButton: React.FC<any> = ({ navigation }: NavigationType) => {
  return (
    <Button testID='emailButton'
    onPress={() => navigation.navigate('EmailSetup')} 
    appearance="ghost"
    accessoryLeft={emailIcon} 
    size='large'
    style={{ marginHorizontal: -15 }}/>

  );
};

export default EmailButton;
