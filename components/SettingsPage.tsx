/**
 * Settings Page
 * @author Blake Stambaugh
 *
 * The settings page that appears from the left side of the screen when hitting the cog in the top right corner
 */
import React from "react";
import { StyleSheet } from "react-native";
import { Modal, Text, Toggle, Card, Layout } from "@ui-kitten/components";
import { ThemeContext } from "./ThemeContext";

interface SettingsPageProp {
  visibility: boolean;
  onPress: (arg0: boolean) => void;
}

const SettingsPage: React.FC<SettingsPageProp> = ({ visibility, onPress }) => {
  // light / dark mode toggle
  const themeContext = React.useContext(ThemeContext);
  const isDarkMode = themeContext.theme === "dark";
  const onModeChange = (nextTheme): void => {
    themeContext.toggleTheme();
  };

  return (
      <Modal
        testID="SettingsPage"
        backdropStyle={styles.backdrop}
        style={styles.modal}
        visible={visibility}
        onBackdropPress={() => onPress(false)}
      >
        <Card style={styles.card}>
          <Text category="h1">Settings</Text>

          {/* toggle for light/dark mode */}
          <Toggle
            testID="DarkModeToggle"
            checked={isDarkMode}
            onChange={onModeChange}
          >
            Enable Dark Mode
          </Toggle>
        </Card>
      </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modal: {
    width: "70%",
    position: "absolute",
    left: "0%",
    height: "98%",
    top: "3%",
  },
  card: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
  },
});

export default SettingsPage;
