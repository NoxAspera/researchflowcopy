/**
 * Missing Input Popup
 * @author David Schiwal and Blake Stambaugh
 * 12/5/24
 *
 * This popup is used exclusively for notifying the user that they are missing inputs
 * and allows them to fill them in before sending their notes.
 */
import { Button, Card, Icon, Layout, Modal, Text } from "@ui-kitten/components";
import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import { ThemeContext } from "./ThemeContext";

interface MIPopup {
  visible: boolean;
  sendData: () => Promise<void>;
  removePopup: (arg1: boolean) => void;
}

const MissingInputPopup: React.FC<MIPopup> = ({ visible, sendData, removePopup }) => {

  // used to change background color of card based on light / dark mode
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  return (
    <Layout>
      <Modal
        visible={visible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => removePopup(false)}
      >
        <Card
          disabled={true}
          style={isDark ? styles.cardDark : styles.cardLight}
          status="warning"
        >
          <Layout style={isDark ? styles.containerDark : styles.containerLight}>

            {/* icon on popup */}
            <Icon
              name="alert-triangle-outline"
              style={styles.icon}
              fill={"#fcba00"}
            />

            {/* popup text */}
            <Text style={{ textAlign: "center" }}>
              You are missing some input field(s), would you like to add them?
            </Text>

            {/* primary button */}
            <Button
              onPress={() => removePopup(false)}
              style={styles.primaryButton}
            >
              YES, EDIT INPUT
            </Button>

            {/* secondary button */}
            <Button
              onPress={() => {
                removePopup(false), sendData();
              }}
              style={styles.secondaryButton}
            >
              NO, SUBMIT ANYWAYS
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
  icon: {
    height: 128,
    width: 128,
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
  primaryButton: {
    marginTop: 15,
    width: "90%",
    backgroundColor: "#fcba00",
    borderColor: "#fcba00",
  },
  secondaryButton: {
    marginTop: 15,
    width: "90%",
    backgroundColor: "#9c9c9c",
    borderColor: "#9c9c9c",
  },
});

export default MissingInputPopup;
