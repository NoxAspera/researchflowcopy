import { fireEvent, render, waitFor } from '@testing-library/react-native'
import { NaviProp } from '../components/types';
import React from 'react';
import { MockThemeProvider } from '../components/MockThemeProvider';
import AddNotes from '../components/AddNotes';



beforeEach(() => {
  jest.spyOn(console, 'error')
  // @ts-ignore jest.spyOn adds this functionallity
  console.error.mockImplementation(() => null);
});

afterEach(() => {
  // @ts-ignore jest.spyOn adds this functionallity
  console.error.mockRestore()
})


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
  
jest.mock('react-native-gesture-handler', () => {
    const { View } = require('react-native');
    return {
      Swipeable: View,
      DrawerLayout: View,
      State: {},
      ScrollView: View,
      Slider: View,
      Switch: View,
      TextInput: View,
      ToolbarAndroid: View,
      ViewPagerAndroid: View,
      WebView: View,
      NativeViewGestureHandler: View,
      TapGestureHandler: View,
      FlingGestureHandler: View,
      ForceTouchGestureHandler: View,
      LongPressGestureHandler: View,
      PanGestureHandler: View,
      PinchGestureHandler: View,
      RotationGestureHandler: View,
      /* Buttons */
      RawButton: View,
      BaseButton: View,
      RectButton: View,
      BorderlessButton: View,
      /* Others */
      FlatList: View,
      gestureHandlerRootHOC: jest.fn(),
      Directions: {},
    };
  });

describe('Add Notes', () => {
  test('renders correctly', () => {
    const { toJSON } = render(
    <MockThemeProvider>
      <AddNotes navigation={mockNavigation} />
    </MockThemeProvider>
  );
  expect(toJSON()).toMatchSnapshot();
  });

  test('wants user if there is any missing input', () => {
    const { getByText, getByTestId } = render(
    <MockThemeProvider>
      <AddNotes navigation={mockNavigation} />
    </MockThemeProvider>
    );

    // hit button
    const button = getByTestId("AddNotesButton");
    fireEvent.press(button);
    
    // check for warning
    const popup = getByText("Missing some input field(s)");
    expect(popup).toBeTruthy();
  })

  test('takes user input', async () => {
    const { findByTestId, queryByTestId } = render(
      <MockThemeProvider>
        <AddNotes navigation={mockNavigation} />
      </MockThemeProvider>
    );

    // get all text inputs
    const instrumentInput = findByTestId('instrumentInput');
    const nameInput = findByTestId('NameInput');
    const timeInput = findByTestId('TimeInput');
    const n2Input = findByTestId('N2Input');
    const ltsIDInput = findByTestId('LTSIDInput');
    const ltsValInput = findByTestId('LTSValueInput');
    const ltsPressInput = findByTestId('LTSPressureInput');
    const lowIDInput = findByTestId('LowIDInput');
    const lowValInput = findByTestId('LowValueInput');
    const lowPressInput = findByTestId('LowPressureInput');
    const midIDInput = findByTestId('MidIDInput');
    const midValInput = findByTestId('MidValueInput');
    const midPressInput = findByTestId('MidPressureInput');
    const highIDInput = findByTestId('HighIDInput');
    const highValInput = findByTestId('HighValueInput');
    const highPressInput = findByTestId('HighPressureInput');
    const notesInput = findByTestId('NotesInput');
    const submitButton = findByTestId('AddNotesButton');

    // add inputs
    fireEvent.changeText(instrumentInput, '1');
    fireEvent.changeText(nameInput, 'test');
    fireEvent.changeText(timeInput, '1:00');
    fireEvent.changeText(n2Input, '1');
    fireEvent.changeText(ltsIDInput, '1');
    fireEvent.changeText(ltsValInput, '1');
    fireEvent.changeText(ltsPressInput, '1');
    fireEvent.changeText(lowIDInput, '1');
    fireEvent.changeText(lowValInput, '1');
    fireEvent.changeText(lowPressInput, '1');
    fireEvent.changeText(midIDInput, '1');
    fireEvent.changeText(midValInput, '1');
    fireEvent.changeText(midPressInput, '1');
    fireEvent.changeText(highIDInput, '1');
    fireEvent.changeText(highValInput, '1');
    fireEvent.changeText(highPressInput, '1');
    fireEvent.changeText(notesInput, 'this is a test');

    // submit content and see if it sends
    fireEvent.press(submitButton);
    expect(findByTestId("SuccessFailurePopup")).toBeTruthy();
    
  })
});