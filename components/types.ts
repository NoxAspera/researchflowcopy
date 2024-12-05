/**
 * Types.ts
 * @author Blake Stambaugh
 * 12/5/24
 * 
 * Helper that will contain more complicated types, like those for navigation.
 */
import { StackNavigationProp } from '@react-navigation/stack';

// Define the type for the stack's navigation parameters
export type RootStackParamList = {
    SelectSite: { from: string }; // Example route with parameters
    SelectTank: undefined;
    SelectInstrument: undefined;
    AddNotes: undefined;
};

// Type for the navigation prop for the HomeScreen
export type NaviProp = StackNavigationProp<RootStackParamList, 'SelectSite'>;

// Props for the HomeScreen component
export interface HomeScreenProps {
  navigation: NaviProp;
}