/**
 * Visit Popup
 * @author Blake Stambaugh
 * 2/23/25
 * 
 * This is the pop up that appears when the tank predictor thinks that the tank just viewed will
 * be empty soon, and a visit should be made
 */
import { Button, Card, Layout, Modal, Text } from '@ui-kitten/components';
import React from 'react'
import { StyleSheet, ColorValue } from "react-native"
import { NavigationType } from './types';

interface VisitPUProp {
    // navigation: NavigationType; 
    daysRemaining: String;
    // popupColor: ColorValue;
    visible: boolean;
    // sendData: () => Promise<void>;
    removePopup: (arg1: boolean) => void;
    navigateHome: (arg0: boolean) => void;
    navigatePlanVisit: (arg0: boolean) => void;
}


// need to have both of these buttons navigate to different pages
const VisitPopupProp: React.FC<VisitPUProp> = ({ daysRemaining, visible, removePopup, navigateHome, navigatePlanVisit }) => {
    const days = daysRemaining;
    return (
      <Layout>
        <Modal
          visible={visible}
          backdropStyle={styles.backdrop}
          onBackdropPress={() => removePopup(false)}
        >
          <Card disabled={true} style={styles.card}>
            <Text style={{ flex: 1 }}>{`This tank will be empty in ${daysRemaining} days. Do you want to plan a visit for this tank?`}</Text>
            <Button 
              onPress={() => {removePopup(false), navigatePlanVisit(true)}}
            >
                PLAN NEXT VISIT
            </Button>
            <Button
              onPress={() => {removePopup(false), navigateHome(true)}}
              style={{ marginTop: 15 }}
            >
              GO HOME
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
    card: {
      backgroundColor: 'blue',
    }
    });

  export default VisitPopupProp;
