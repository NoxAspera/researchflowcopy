/**
 * Popup Property
 * @author Blake Stambaugh
 * 12/5/24
 *
 * This property represents the popup messages that appear on the screen for success and failures.
 */
import { Button, Card, Icon, IconElement, Layout, Modal, Text } from "@ui-kitten/components";
import React, { useContext } from "react";
import { StyleSheet} from "react-native";
import { customTheme } from "./CustomTheme";
import { ThemeContext } from "./ThemeContext";

interface PUProp {
  popupText: string;
  popupStatus: string;
  visible: boolean;
  returnHome: boolean;
  onPress: (arg0: boolean) => void;
  navigateHome: (arg0: boolean) => void;
}

const PopupProp: React.FC<PUProp> = ({ popupText, popupStatus, visible, returnHome, onPress, navigateHome }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  return (
    <Layout>
      <Modal
        visible={visible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => onPress(false)}
      >
        <Card disabled={true} style={isDark ? styles.cardDark : styles.cardLight} status={popupStatus}>
          <Layout style={isDark ? styles.containerDark : styles.containerLight}>
            {popupStatus === "success" ? (
              <Icon name="checkmark-circle-outline" style={styles.icon} fill={customTheme["color-success-500"]} />
            ) : (
              <Icon name="close-circle-outline" style={styles.icon} fill={customTheme["color-danger-500"]} />
            )}
            <Text>{popupText}</Text>
            <Button 
              testID="PopupButton" 
              onPress={() => {onPress(false), navigateHome(returnHome)}}
              status={popupStatus}
              style={{ margin: 15 }}>
                DISMISS
            </Button>
          </Layout>
        </Card>
      </Modal>
    </Layout>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  cardLight: {
    margin: 15,
    backgroundColor: "#e3e3e3",
  },
  cardDark: {
    margin: 15,
    backgroundColor: "#1C2760",
  },
  containerLight: {
    alignItems: "center", 
    justifyContent: "center",
    backgroundColor: "#e3e3e3",
  },
  containerDark: {
    alignItems: "center", 
    justifyContent: "center",
    backgroundColor: "#1C2760",
  },
  icon: {
    height: 128,
    width: 128,
  },
  container: {
    alignItems: "center", 
    justifyContent: "center",
    backgroundColor: "#e3e3e3",
  }
});

export default PopupProp;
