/**
 * NoteInput.tsx
 * @author Blake Stambaugh, David Schiwal
 * 11/27/24
 * 
 * This property objectifies our note input. It will take in any text, and styling choices
 * for each input.
 */
import { Input, Text } from "@ui-kitten/components";
import React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { ThemeContext } from "./ThemeContext";

/**
 * NIProp
 * @author Blake Stambaugh, David Schiwal
 * used to give types to note input parameters
 */
interface NIProp{
    labelText?: string;
    labelValue: string;
    onTextChange: (arg0: string) => void;
    placeholder?: string; 
    multiplelines?: boolean;
    style?: ViewStyle;
    secureEntry?: boolean; // used for hiding passwords and other sensitive info
    status?: string;
}

const AddNotesNoteInput: React.FC<NIProp> = ({ labelText, labelValue, onTextChange, placeholder, multiplelines, style, secureEntry, status }) => {
    const themeContext = React.useContext(ThemeContext);
    const isDarkMode = themeContext.theme === 'dark';
    return (
      <Input
        label={evaProps => <Text {...evaProps} category="p2" style={{color: isDarkMode ? "white" : "black"}}>{labelText}</Text>}
        status={status || 'basic'}
        placeholder={placeholder}
        value={labelValue}
        multiline={multiplelines ? true : true}
        onChangeText={(arg0) => onTextChange(arg0)}
        style={style}
        secureTextEntry={secureEntry ? true : false}
        textStyle={styles.textInputStyle}
      />
    );
};

const styles = StyleSheet.create({
    textInputStyle: {
      maxHeight: 100,
      fontSize: 18
    }
  });

  export default AddNotesNoteInput;
