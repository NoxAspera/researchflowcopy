import { Input } from "@ui-kitten/components";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { customTheme } from './CustomTheme'

interface TIProp{
    labelText: string;
    labelValue: string;
    onTextChange: (arg0: string) => void;
    placeholder?: string; 
    multiplelines?: boolean;
    style?: ViewStyle;
}

const AddNotesTextInput: React.FC<TIProp> = ({ labelText, labelValue, onTextChange, placeholder, multiplelines, style }) => {
    return (
      <Input
        label={labelText}
        placeholder={placeholder}
        value={labelValue}
        multiline={multiplelines ? true : false}
        onChangeText={(arg0) => onTextChange(arg0)}
        style={style}
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