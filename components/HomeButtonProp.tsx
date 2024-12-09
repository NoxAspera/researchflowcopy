/**
 * Home Button Property
 * @author Blake Stambaugh
 * 12/5/24
 * 
 * This property abstracts the buttons on the home page
 */
import { Layout, Text } from '@ui-kitten/components';
import React from 'react'
import { StyleSheet, TouchableWithoutFeedback } from "react-native"

interface HBProp{
    text: string;
    onPress: () => void; // may change depending on the function pass in
}

const HomeButtonProp: React.FC<HBProp> = ({ text, onPress }) => {
    return (
      <TouchableWithoutFeedback onPress={onPress}>
        <Layout style={styles.tab} level="2">
          <Text category="h5">{text}</Text>
        </Layout>
      </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    tab: {
      width: '90%', // Card width to adjust appearance
      height: 200,
      marginVertical: 10,
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      elevation: 4, // For shadow on Android
      shadowColor: '#000', // For shadow on iOS
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    }
  });

  export default HomeButtonProp;
