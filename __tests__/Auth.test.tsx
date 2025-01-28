import Auth from '../components/Auth';
import { render } from '@testing-library/react-native'
import { NaviProp, RootStackParamList } from '../components/types';
import React, { useState } from 'react';
import * as eva from '@eva-design/eva';
import customColors from '../custom-theme.json'
import { ApplicationProvider } from '@ui-kitten/components';
import { MockThemeProvider } from '../components/MockThemeProvider';


// const rootStack: RootStackParamList = {
//   SelectSite: {
//     from: ''
//   },
//   AddNotes: {
//     site: ''
//   },
//   ViewNotes: {
//     site: ''
//   },
//   BadData: {
//     site: ''
//   },
//   InstrumentMaintenance: {
//     site: ''
//   },
//   TankTracker: {
//     site: ''
//   },
//   SelectInstrument:{
//     from: ''
//   },
//   Home: undefined
// }

const mockNavigation: NaviProp = {
  dispatch: jest.fn(),
  navigate: jest.fn(),
  navigateDeprecated: jest.fn(),
  preload: jest.fn(),
  reset: jest.fn(),
  goBack: jest.fn(),
  isFocused: jest.fn(),
  canGoBack: jest.fn(),
  getId: jest.fn(),
  getState: jest.fn(),
  setStateForNextRouteNamesChange: jest.fn(),
  getParent: jest.fn(),
  setParams: jest.fn(),
  setOptions: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
  replace: jest.fn(), 
  push: jest.fn(), 
  pop: jest.fn(), 
  popToTop: jest.fn(), 
  popTo: jest.fn()
}

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
}));


describe('Login page', () => {
  // // used for swapping between light and dark mode
  // // Initialize state with a type
  // type ThemeType = 'light' | 'dark';
  // const [theme, setTheme] = useState<ThemeType>('light');
  
  // // Merge custom theme with Eva's base theme
  // const currentTheme = { ...eva[theme], ...customColors };
  
  test('app renders correctly', () => {
    const { getByText } = render(
    <MockThemeProvider>
      <Auth navigation={mockNavigation} />
    </MockThemeProvider>
  );
    const text = getByText('Sign in using your GitHub credentials');
    expect(text);
  });

})