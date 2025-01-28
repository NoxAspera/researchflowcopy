/**
 * TextInput.tsx
 * @author Blake Stambaugh
 * 11/27/24
 * 
 * This property objectifies our text input. It will take in any text, and styling choices
 * for each input.
 */
import { Input, Text, useTheme } from "@ui-kitten/components";
import React from "react";
import { StyleSheet, ViewStyle } from "react-native";

/**
 * TIProp
 * @author Blake Stambaugh
 * used to give types to text input parameters
 */
interface TIProp{
    labelText?: string;
    labelValue: string;
    onTextChange: (arg0: string) => void;
    placeholder?: string; 
    multiplelines?: boolean;
    style?: ViewStyle;
    secureEntry?: boolean; // used for hiding passwords and other sensitive info
    status?: string;
    id?: string;
}

const AddNotesTextInput: React.FC<TIProp> = ({ labelText, labelValue, onTextChange, placeholder, multiplelines, style, secureEntry, status, id }) => {
  const theme = useTheme();
    return (
      <Input
        testID={id}
        label={evaProps => <Text {...evaProps} category="p2" style={{color: "white"}}>{labelText}</Text>}
        status={status || 'basic'}
        placeholder={placeholder}
        value={labelValue}
        multiline={multiplelines ? true : false}
        onChangeText={(arg0) => onTextChange(arg0)}
        style={style}
        secureTextEntry={secureEntry ? true : false}
        textStyle={styles.textInputStyle}
      />
    );
};

const styles = StyleSheet.create({
    textInputStyle: {
      maxHeight: 24,
      fontSize: 18
    }
  });

  export default AddNotesTextInput;
