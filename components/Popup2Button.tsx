/**
 * Popup 2 buttons
 * @author David Schiwal and Blake Stambaugh
 * 12/5/24
 * 
 * This is another pop up property but has two buttons, both do different actions. 
 * As of writing this, it is used only for the 'missing data are you sure you want
 * to submit' pop up
 */
import { Button, Card, Layout, Modal, Text } from '@ui-kitten/components';
import React from 'react'
import { StyleSheet, ColorValue } from "react-native"

interface PUProp{
    popupText: string;
    popupColor: ColorValue;
    visible: boolean;
    sendData: () => Promise<void>;
    removePopup: (arg1: boolean) => void;
    testid?: string;
}

const PopupProp2Button: React.FC<PUProp> = ({ popupText, popupColor, visible, sendData, removePopup, testid = '' }) => {
    return (
      <Layout testID={testid}>
        <Modal
          visible={visible}
          backdropStyle={styles.backdrop}
          onBackdropPress={() => removePopup(false)}
        >
          <Card disabled={true} style={{ backgroundColor: popupColor }}>
            <Text style={{ flex: 1 }}>{popupText}</Text>
            <Button onPress={() => sendData()}>SUBMIT ANYWAYS</Button>
            <Button
              onPress={() => removePopup(false)}
              style={{ marginTop: 15 }}
            >
              EDIT INPUT
            </Button>
          </Card>
        </Modal>
      </Layout>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    });

  export default PopupProp2Button;
