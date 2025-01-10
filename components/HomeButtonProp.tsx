/**
 * Home Button Property
 * @author Blake Stambaugh
 * 12/5/24
 * 
 * This property abstracts the buttons on the home page
 */
import { Layout, Text, Button } from '@ui-kitten/components';
import React from 'react'
import { StyleSheet, TouchableWithoutFeedback, Dimensions } from "react-native"
const { width, height } = Dimensions.get("window"); //this pulls in the screen width and height to use for scalars

interface HBProp{
    text: string;
    //style: StyleSheet;
    onPress: () => void; // may change depending on the function pass in
}
//might be able to pass in the style of the button from outside to enable different colors for the buttons
const HomeButtonProp: React.FC<HBProp> = ({ text, onPress }) => {
    return (
      <TouchableWithoutFeedback onPress={onPress}>
        <Layout level="2">
          <Button
            style={styles.tab}
            status='primary'
          >
            {evaProps => <Text {...evaProps} category="h5" style={{color: "white"}}>{text}</Text>}
          </Button>  
        </Layout>
      </TouchableWithoutFeedback>
      /*<TouchableWithoutFeedback onPress={onPress}>
        <Layout {...style} level="2">
          <Text category="h5">{text}</Text>  
        </Layout>
      </TouchableWithoutFeedback>*/
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
      //backgroundColor: "#061c9c" //changes color of all buttons
    }
  });

  export default HomeButtonProp;
