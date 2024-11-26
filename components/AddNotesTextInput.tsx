import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

interface ANTIProp{
    inputText: string;
    inputTextVar?: string;
    inputTextStyle: ViewStyle;
    ViewStyle: ViewStyle; 
}

const AddNotesTextInput: React.FC<ANTIProp> = ({ inputText, inputTextStyle, ViewStyle, inputTextVar }) => {
    return (
        <View style = {ViewStyle}>
            <Text style = {styles.label}>{inputText}{inputTextVar}</Text>
            <SafeAreaProvider>
              <SafeAreaView>
                <TextInput
                  style = {inputTextStyle}>
                </TextInput>
              </SafeAreaView>
            </SafeAreaProvider>
          </View>
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