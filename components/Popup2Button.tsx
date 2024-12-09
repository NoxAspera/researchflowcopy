import { Button, Card, Layout, Modal, Text } from '@ui-kitten/components';
import React from 'react'
import { StyleSheet, ColorValue } from "react-native"
import { Entry } from '../scripts/Parsers';

interface PUProp{
    popupText: string;
    popupColor: ColorValue;
    visible: boolean;
    sendData: () => Promise<void>;
    removePopup: (arg1: boolean) => void;
}

const PopupProp2Button: React.FC<PUProp> = ({ popupText, popupColor, visible, sendData, removePopup }) => {

    return (
        <Layout>
            <Modal
            visible={visible}
            backdropStyle={styles.backdrop}
            onBackdropPress={() => removePopup(false)}>
              <Card disabled={true} style={{backgroundColor: popupColor}}>
                <Text style={{flex: 1}}>{popupText}</Text>
                <Button onPress={() => sendData()}>
                  SUBMIT ANYWAYS
                </Button>
                <Button onPress={() => removePopup(false)}
                  style={{marginTop: 15}}>
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
