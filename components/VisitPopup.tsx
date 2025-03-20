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
import { customTheme } from './CustomTheme';

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
      <Layout style={{flex: 1}}>
        <Modal
          visible={visible}
          backdropStyle={styles.backdrop}
        >
          <Card disabled={true} style={styles.card} status='danger'>
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
              style={{ marginTop: 15, backgroundColor: customTheme["color-danger-500"] }}
            >
                YES, PLAN NEXT VISIT
            </Button>
            <Button
              onPress={() => removePopup(false)}
              style={{ marginTop: 15, backgroundColor: "#9c9c9c" }}
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
      margin: 15,
      backgroundColor: "#e3e3e3",
    }
    });

  export default VisitPopupProp;
