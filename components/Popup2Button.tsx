import { Button, Card, Layout, Modal } from '@ui-kitten/components';
import React from 'react'
import { StyleSheet, Text, ColorValue } from "react-native"

interface PUProp{
    popupText: string;
    popupColor: ColorValue;
    visible: boolean;
    onPress: (arg0: boolean) => void;
}

const PopupProp2Button: React.FC<PUProp> = ({ popupText, popupColor, visible, onPress, onPress2 }) => {

    return (
        <Layout>
            <Modal
            visible={visible}
            backdropStyle={styles.backdrop}
            onBackdropPress={() => onPress(false)}>
              <Card disabled={true} style={{backgroundColor: popupColor}}>
                <Text>{popupText}</Text>
                <Button onPress={() => onPress(false)}>
                  SUBMIT ANYWAYS
                </Button>
                <Button onPress2={() => onPress(false)}>
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
