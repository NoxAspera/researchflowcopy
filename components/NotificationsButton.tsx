/**
 * Notifications Button
 * @author 
 * 
 * This button sits in the header of the pages and directs the user to the
 * in app notifications
 */
import React from "react";
import { Button, Icon, IconElement } from "@ui-kitten/components";
import { NavigationType } from "./types";

// preload bell icon for button
const bellIcon = (props): IconElement => <Icon {...props} name='bell-outline' />;

const NotificationsButton: React.FC<any> = ({ navigation }: NavigationType) => {
  return (
    <Button
      testID="notificationsButton"
      onPress={() => navigation.navigate("ViewNotifications")}
      appearance="ghost"
      accessoryLeft={bellIcon}
      size="large"
      style={{ marginHorizontal: -10 }}
    />
  );
};

export default NotificationsButton;
