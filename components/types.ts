/**
 * Types.ts
 * @author Blake Stambaugh
 * Updated: 1/14/25 - MO
 * 
 * Helper that will contain more complicated types, like those for navigation.
 */
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { visit } from '../scripts/APIRequests';

// Define the type for the stack's navigation parameters
export type RootStackParamList = {
    // used for home screen
    SelectSite: { from: string }; 
    SelectInstrument: { from: string , notes: boolean};
    SelectTank: { from: string, onSelect?: (selectedTank: string) => void };
    SelectNotes: { from: string }; 

    // used for site select
    AddNotes: { site: string };
    AddNotesMobile: { site: string };
    ViewNotes: { site: string, from: string, visits: visit[] };
    BadData: { site: string };
    InstrumentMaintenance: { site: string };
    TankTracker: { site: string };
    PlanVisit: {site: string};
    Diagnostics: {site: string};
    ContactInfo: {site: string};

    // used for auth
    Home: undefined;
    ViewNotifications: undefined;
    NotificationsButton: undefined;
    Calendar: undefined;
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
  notes: string;
  onSelect?: (selectedTank: string ) => void;
  visits: visit[];
};
export type routeProp = RouteProp<{params: RouteParams}, 'params'>;