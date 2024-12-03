/**
 * TextInput.tsx
 * By Blake Stambaugh
 * 11/27/24
 * 
 * This property objectifies our text input. It will take in any text, and styling choices
 * for each input.
 */
import { Input } from "@ui-kitten/components";
import { stat } from "fs";
import { StyleSheet, ViewStyle } from "react-native";

interface TIProp{
    labelText?: string;
    labelValue: string;
    onTextChange: (arg0: string) => void;
    placeholder?: string; 
    multiplelines?: boolean;
    style?: ViewStyle;
    secureEntry?: boolean; // used for hiding passwords and other sensitive info
    status?: string;
}

const AddNotesTextInput: React.FC<TIProp> = ({ labelText, labelValue, onTextChange, placeholder, multiplelines, style, secureEntry, status }) => {
    return (
      <Input
        label={labelText}
        status={status || 'basic'}
        placeholder={placeholder}
        value={labelValue}
        multiline={multiplelines ? true : false}
        onChangeText={(arg0) => onTextChange(arg0)}
        style={style}
        secureTextEntry={secureEntry ? true : false}
      />
    );
};

const styles = StyleSheet.create({
    label: {
        margin: 15,
        fontSize: 24,
        alignItems: 'flex-start'
    }
  });

  export default AddNotesTextInput;