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
  visible: boolean; 
  lowTank: String;
  midTank: String;
  highTank: String;
  lowDays: number;
  midDays: number;
  highDays: number;
  removePopup: (arg1: boolean) => void;
  navigateHome: (arg0: boolean) => void;
  navigatePlanVisit: (arg0: boolean) => void;
}


// need to have both of these buttons navigate to different pages
const VisitPopupProp: React.FC<VisitPUProp> = ({ lowTank, lowDays, midTank, midDays, highTank, highDays, visible, removePopup, navigateHome, navigatePlanVisit }) => {
    return (
      <Layout>
        <Modal
          visible={visible}
          backdropStyle={styles.backdrop}
          // onBackdropPress={() => removePopup(false)}
        >
          <Card disabled={true} style={styles.card}>
            <Text style={{ flex: 1 }}>{`${(() => {
                let tanks = [lowTank, midTank, highTank].filter(tank => tank != "");
                if (tanks.length === 1)  { return `${tanks[0]}`}
                else if (tanks.length === 2)  { return `${tanks[0]} and ${tanks[1]}`}
                else if (tanks.length === 3)  { return `${tanks[0]}, ${tanks[1]}, and ${tanks[2]}`}
              })()} may be empty in ${(() => {
                let days = [lowDays, midDays, highDays].filter(val => val >= 0);
                if (days.length === 1)  { return `${days[0]}`}
                else if (days.length === 2)  { return `${days[0]} and ${days[1]}`}
                else if (days.length === 3)  { return `${days[0]}, ${days[1]}, and ${days[2]}`}
              })()} days respectivly. Do you want to plan a visit?`}</Text>
            <Button 
              onPress={() => {removePopup(false), navigatePlanVisit(true)}}
            >
                PLAN NEXT VISIT
            </Button>
            <Button
              onPress={() => removePopup(false)}
              style={{ marginTop: 15 }}
            >
              NO, GO HOME
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
