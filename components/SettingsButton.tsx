/**
 * Settings Page Button
 * @author Blake Stambaugh
 *
 * This is the button on every page that opens the settings menu.
 */
import React, { useState } from "react";
import { View } from "react-native";
import { Button, Icon, IconElement } from "@ui-kitten/components";
import SettingsPage from "./SettingsPage";

// preload gear icon for button
const gearIcon = (props): IconElement => (
  <Icon {...props} name="settings-outline" />
);

export default function SettingsButton() {
  const [visible, setVisible] = useState(false);

  return (
    <View>
      <Button
        testID="settingsButton"
        onPress={() => setVisible(true)}
        appearance="ghost"
        accessoryLeft={gearIcon}
        size="large"
        style={{ marginHorizontal: -10 }}
      />
      <SettingsPage visibility={visible} onPress={setVisible} />
    </View>
  );
}
