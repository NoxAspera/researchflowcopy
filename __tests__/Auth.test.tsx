import Auth from '../components/Auth';
import { fireEvent, render } from '@testing-library/react-native'
import { NaviProp } from '../components/types';
import React from 'react';
import { MockThemeProvider } from '../components/MockThemeProvider';

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
  test('page renders correctly', () => {
    const { toJSON } = render(
    <MockThemeProvider>
      <Auth navigation={mockNavigation} />
    </MockThemeProvider>
  );
  expect(toJSON()).toMatchSnapshot();
  });

  test('can login and have the page change', () => {
    const { getByTestId, queryByPlaceholderText } = render(
      <MockThemeProvider>
        <Auth navigation={mockNavigation} />
      </MockThemeProvider>
    );

    // get inputs and button
    const email = queryByPlaceholderText('Email');
    const pass = queryByPlaceholderText('Password');
    const button = getByTestId('AuthButton');
    
    // give input
    fireEvent.changeText(email, 'admin');
    fireEvent.changeText(pass, '1234');

    // hit button to check for success
    fireEvent.press(button);
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Home');
  })

  test('does not redirect with bad login', () => {
    const { getByTestId, getByText } = render(
      <MockThemeProvider>
        <Auth navigation={mockNavigation} />
      </MockThemeProvider>
    );

    // get button
    const button = getByTestId('AuthButton');

    // hit button to check for failure
    fireEvent.press(button);
    const popup = getByText("Missing Login Credentials")
    expect(popup).toBeTruthy();
  })

})