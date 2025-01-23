/**
 * Types.ts
 * @author Blake Stambaugh
 * Updated: 1/14/25 - MO
 * 
 * Helper that will contain more complicated types, like those for navigation.
 */
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

// Define the type for the stack's navigation parameters
export type RootStackParamList = {
    // used for home screen
    SelectSite: { from: string }; 
    SelectInstrument: { from: string};

    // used for site select
    AddNotes: { site: string };
    ViewNotes: { site: string };
    BadData: { site: string };
    InstrumentMaintenance: { site: string };
    TankTracker: { site: string };

    // used for auth
    Home: undefined;
};

// Type for the navigation prop for the HomeScreen
export type NaviProp = StackNavigationProp<RootStackParamList, 'SelectSite'>;

// Props for the HomeScreen component
export interface NavigationType {
  navigation: NaviProp;
}

// type for routes
type RouteParams = {
  site: string; 
  info: string; 
  from: string;
};
export type routeProp = RouteProp<{params: RouteParams}, 'params'>;