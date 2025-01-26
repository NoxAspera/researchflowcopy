/**
 * Home Button Property
 * @author Blake Stambaugh
 * 12/5/24
 * 
 * This property abstracts the buttons on the home page
 */
import { Layout, Text, Button, useTheme } from '@ui-kitten/components';
import React from 'react'
import { StyleSheet, TouchableWithoutFeedback, Dimensions, ColorValue } from "react-native"
const { width, height } = Dimensions.get("window"); //this pulls in the screen width and height to use for scalars

interface HBProp{
    text: string;
    color: ColorValue;
    onPress: () => void; // may change depending on the function pass in
}


const HomeButtonProp: React.FC<HBProp> = ({ text, color, onPress }) => {
    const theme = useTheme();
    return (
      <Layout level="2">
        <Button
        //makes a stylesheet with styles.tab stylesheet and the new thing you take in
          style={[styles.tab, { backgroundColor: color}]}
          status='primary'
          onPress={onPress}
        >
          {evaProps => <Text {...evaProps} category="h5" style={{color: "black"}}>{text}</Text>}
        </Button>  
      </Layout>
    );
};

const styles = StyleSheet.create({
    tab: {
      width: width * .9, // Card width to adjust appearance
      height: height/8.5,
      marginVertical: height/70,
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
