/**
 * Popup 2 buttons
 * @author David Schiwal and Blake Stambaugh
 * 12/5/24
 * 
 * This is another pop up property but has two buttons, both do different actions. 
 * As of writing this, it is used only for the 'missing data are you sure you want
 * to submit' pop up
 */
import { Button, Card, Icon, Layout, Modal, Text } from '@ui-kitten/components';
import React from 'react'
import { StyleSheet, ColorValue } from "react-native"
import { customTheme } from './CustomTheme';

interface PUProp{
    visible: boolean;
    sendData: () => Promise<void>;
    removePopup: (arg1: boolean) => void;
}

const PopupProp2Button: React.FC<PUProp> = ({ visible, sendData, removePopup }) => {
    return (
      <Layout>
        <Modal
          visible={visible}
          backdropStyle={styles.backdrop}
          onBackdropPress={() => removePopup(false)}
        >
          <Card disabled={true} style={styles.card} status='warning'>
            <Layout style={styles.container}>
              <Icon name="alert-triangle-outline" style={styles.icon} fill={"#fcba00"} />
                <Text style={{ textAlign: "center" }}>You are missing some input field(s), would you like to add them?</Text>
              <Button
                onPress={() => removePopup(false)}
                style={styles.primaryButton}>
                  YES, EDIT INPUT
              </Button>
              <Button 
                onPress={() => {removePopup(false), sendData()}}
                style={styles.secondaryButton}>
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
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    card: {
      margin: 15,
      backgroundColor: "#e3e3e3",
    },
    icon: {
      height: 128,
      width: 128,
    },
    container: {
      alignItems: "center", 
      justifyContent: "center",
      backgroundColor: "#e3e3e3",
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
    }
    });

  export default PopupProp2Button;
