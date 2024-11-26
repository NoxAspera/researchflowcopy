import React from 'react'
import { StyleSheet, TouchableOpacity, Text } from "react-native"

interface HBProp{
    color: string;
    text: string;
    onPress: () => void; // may change depending on the function pass in
}

const HomeButtonProp: React.FC<HBProp> = ({ color, text, onPress }) => {
    return (
        <TouchableOpacity
            style={[styles.homeButton, {backgroundColor: color}]}
            onPress={() => onPress()} >
            <Text style={styles.homeButtonText}>{text}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    homeButton: {
      flex: 1,                      // has button fill space vertically
      borderRadius: 10,
      justifyContent: 'center',     // this and alignItems places text in center of button
      alignItems: "center",
      margin: 10
    },
    homeButtonText: {
      flex: 1,
      fontSize: 30
    }
  });

  export default HomeButtonProp;
