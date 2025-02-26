/**
 * Loading Screen
 * By Blake Stambaugh
 * 2/18/2025
 * 
 * The loading screen component that appears when the user submits to github
 * Not a real screen, just a popup.
 */

import React from "react";
import { Layout, Modal, Spinner } from "@ui-kitten/components";
import { StyleSheet } from "react-native";

interface LoadingScreenProp {
    visible: boolean;
    // onPress: (arg0: boolean) => void;
}

const LoadingScreen: React.FC<LoadingScreenProp> = ({ visible }) => {
  return (
    <Layout>
      <Modal
        visible={visible}
        backdropStyle={styles.backdrop}
      >
        {/* onShow component for modal may be useful to make the spinner disappear */}
        <Spinner size="giant"/>
      </Modal>
    </Layout>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
});

export default LoadingScreen;