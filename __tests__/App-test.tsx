import Auth from '../components/Auth';
import React from 'react';
// import NavigationType from '../components/types'
import { render } from '@testing-library/react-native'
import { NaviProp, RootStackParamList } from '../components/types';
import { StackNavigationProp } from '@react-navigation/stack';

const rootStack: RootStackParamList = {
  SelectSite: {
    from: ''
  },
  AddNotes: {
    site: ''
  },
  ViewNotes: {
    site: ''
  },
  BadData: {
    site: ''
  },
  InstrumentMaintenance: {
    site: ''
  },
  TankTracker: {
    site: ''
  },
  Home: undefined
}

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
// const mockNaviProp: StackNavigationProp<RootStackParamList, 'SelectSite'> = {
//   // Mocked navigation methods
//   navigate: jest.fn(),
//   goBack: jest.fn(),
//   reset: jest.fn(),
//   setParams: jest.fn(),
//   dispatch: jest.fn(),
//   isFocused: jest.fn(() => true),
//   canGoBack: jest.fn(() => true),
//   getParent: jest.fn(),

//   // Stack-specific methods
//   push: jest.fn(),
//   replace: jest.fn(),
//   pop: jest.fn(),
//   popToTop: jest.fn(),

//   // Event listener methods
//   addListener: jest.fn(),
//   removeListener: jest.fn(),

//   // Optional methods
//   getState: jest.fn(),
//   // getCurrentRoute: jest.fn(),
//   // emit: jest.fn(),
  
//   navigateDeprecated: jest.fn(), // Not commonly used, but required for type
//   preload: jest.fn(), // Preload a route, rarely used
//   getId: jest.fn(), // Retrieve the ID of the current route
//   setStateForNextRouteNamesChange: jest.fn(), // Update state for route name changes
// };

describe('<App />', () => {
  test('app renders correctly', () => {
    const { getByText } = render(<Auth navigation={mockNavigation} />);
    getByText('Sign in using your GitHub credentials');
  });

})