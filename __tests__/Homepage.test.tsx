import { fireEvent, render } from '@testing-library/react-native'
import { NaviProp } from '../components/types';
import React from 'react';
import { MockThemeProvider } from '../components/MockThemeProvider';
import HomeScreen from '../components/HomeScreen';

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


describe('Home page', () => {
  test('renders correctly', () => {
    const { toJSON } = render(
    <MockThemeProvider>
      <HomeScreen navigation={mockNavigation} />
    </MockThemeProvider>
  );
  expect(toJSON()).toMatchSnapshot();
  });

  test('redirects to add notes', () => {
    const { queryByText } = render(
      <MockThemeProvider>
        <HomeScreen navigation={mockNavigation} />
      </MockThemeProvider>
    );

    // get buttons
    const addNotes = queryByText('ADD NOTES');
    
    // hit button to check for success
    fireEvent.press(addNotes);
    expect(mockNavigation.navigate).toHaveBeenCalledWith("SelectSite", { from: "AddNotes" });
  })

  test('redirects to view notes', () => {
    const { queryByText } = render(
      <MockThemeProvider>
        <HomeScreen navigation={mockNavigation} />
      </MockThemeProvider>
    );

    // get buttons
    const viewNotes = queryByText('VIEW NOTES');
    
    // hit button to check for success
    fireEvent.press(viewNotes);
    expect(mockNavigation.navigate).toHaveBeenCalledWith("SelectNotes", { from: "ViewNotes" });
  })

  test('redirects to instrument maintenence', () => {
    const { queryByText } = render(
      <MockThemeProvider>
        <HomeScreen navigation={mockNavigation} />
      </MockThemeProvider>
    );

    // get buttons
    const instMain = queryByText('INSTRUMENT MAINTENENCE');
    
    // hit button to check for success
    fireEvent.press(instMain);
    expect(mockNavigation.navigate).toHaveBeenCalledWith("SelectSite", { from: "InstrumentMaintenance" });
  })

  test('redirects to tank tracker', () => {
    const { queryByText } = render(
      <MockThemeProvider>
        <HomeScreen navigation={mockNavigation} />
      </MockThemeProvider>
    );

    // get buttons
    const tankTracker = queryByText('TANK TRACKER');
    
    // hit button to check for success
    fireEvent.press(tankTracker);
    expect(mockNavigation.navigate).toHaveBeenCalledWith("SelectTank", { from: "TankTracker" });
  })

  test('redirects to plan a visit', () => {
    const { queryByText } = render(
      <MockThemeProvider>
        <HomeScreen navigation={mockNavigation} />
      </MockThemeProvider>
    );

    // get buttons
    const plan = queryByText('PLAN A VISIT');
    
    // hit button to check for success
    fireEvent.press(plan);
    expect(mockNavigation.navigate).toHaveBeenCalledWith("SelectSite", { from: "PlanVisit" });
  })
});