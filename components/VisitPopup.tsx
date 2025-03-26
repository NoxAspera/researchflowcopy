/**
 * Visit Popup
 * @author Blake Stambaugh
 * 2/23/25
 * 
 * This is the pop up that appears when the tank predictor thinks that the tank just viewed will
 * be empty soon, and a visit should be made
 */
import { Button, Card, Icon, Layout, Modal, Text } from '@ui-kitten/components';
import React from 'react'
import { StyleSheet, ColorValue } from "react-native"
import { NavigationType } from './types';
import { customTheme } from './CustomTheme';

interface VisitPUProp {
  visible: boolean; 
  lowTank: String;
  midTank: String;
  highTank: String;
  ltsTank: String;
  n2Tank: String;
  lowDays: number;
  midDays: number;
  highDays: number;
  ltsDays: number;
  n2Days: number;
  removePopup: (arg1: boolean) => void;
  navigateHome: (arg0: boolean) => void;
  navigatePlanVisit: (arg0: boolean) => void;
}


// need to have both of these buttons navigate to different pages
const VisitPopupProp: React.FC<VisitPUProp> = ({ 
  lowTank, 
  lowDays, 
  midTank, 
  midDays, 
  highTank, 
  highDays, 
  ltsTank,
  ltsDays,
  n2Tank,
  n2Days,
  visible, 
  removePopup,
  navigatePlanVisit }) => {
    return (
      <Layout>
        <Modal
          visible={visible}
          backdropStyle={styles.backdrop}
        >
          <Card disabled={true} style={styles.card} status='info'>
            <Layout style={styles.container}>
              <Icon name="trending-down-outline" style={styles.icon} fill={customTheme["color-info-500"]} />
              <Text style={{ textAlign: "center" }}>{`${(() => {
                  let tanks = [lowTank, midTank, highTank, ltsTank, n2Tank].filter(tank => tank != "");
                  if (tanks.length === 1)  { return `${tanks[0]}`}
                  else if (tanks.length === 2)  { return `${tanks[0]} and ${tanks[1]}`}
                  else if (tanks.length === 3)  { return `${tanks[0]}, ${tanks[1]}, and ${tanks[2]}`}
                  else if (tanks.length === 4)  { return `${tanks[0]}, ${tanks[1]}, ${tanks[2]}, and ${tanks[3]}`}
                  else if (tanks.length === 5)  { return `${tanks[0]}, ${tanks[1]}, ${tanks[2]}, ${tanks[3]}, and ${tanks[4]}`}
                })()} may be empty in ${(() => {
                  let days = [lowDays, midDays, highDays, ltsDays, n2Days].filter(val => val >= 0);
                  if (days.length === 1)  { return `${days[0]}`}
                  else if (days.length === 2)  { return `${days[0]} and ${days[1]}`}
                  else if (days.length === 3)  { return `${days[0]}, ${days[1]}, and ${days[2]}`}
                  else if (days.length === 4)  { return `${days[0]}, ${days[1]}, ${days[2]}, and ${days[3]}`}
                  else if (days.length === 5)  { return `${days[0]}, ${days[1]}, ${days[2]}, ${days[3]}, and ${days[4]}`}
                })()} days respectivly. Do you want to plan a visit?`}</Text>
              <Button 
                onPress={() => {removePopup(false), navigatePlanVisit(true)}}
                style={styles.primaryButton}
                status="info">
                  YES, PLAN NEXT VISIT
              </Button>
              <Button
                onPress={() => removePopup(false)}
                style={styles.secondaryButton}>
                  NO, GO HOME
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
    primaryButton: {
      marginTop: 15, 
      width: "90%",
    },
    secondaryButton: {
      marginTop: 15, 
      width: "90%",
      backgroundColor: "#9c9c9c",
      borderColor: "#9c9c9c",
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
    });

  export default VisitPopupProp;
