import SettingsButton from "../components/SettingsButton";
import { fireEvent, render } from "@testing-library/react-native";
import React, { useContext } from "react";
import { Text } from "react-native";
import SettingsPage from "../components/SettingsPage";
import { ThemeContext } from "../components/ThemeContext";
import { MockThemeProvider } from "../components/MockThemeProvider";

beforeEach(() => {
  jest.spyOn(console, 'error')
  // @ts-ignore jest.spyOn adds this functionallity
  console.error.mockImplementation(() => null);
});

afterEach(() => {
  // @ts-ignore jest.spyOn adds this functionallity
  console.error.mockRestore()
})

describe("Settings Page", () => {
  test("button renders correctly", () => {
    const { toJSON } = render(
      <MockThemeProvider>
        <SettingsButton />
      </MockThemeProvider>
    );
    expect(toJSON()).toMatchSnapshot();
  });

  test("settings button appears and renders setting page", () => {
    // render button
    const { getByTestId, queryByTestId } = render(
      <MockThemeProvider>
        <SettingsButton />
      </MockThemeProvider>
    );

    // make sure settings page is not loaded
    expect(queryByTestId("SettingsPage")).toBeNull();
    expect(queryByTestId("DarkModeToggle")).toBeNull();

    // simulate a button press
    const button = getByTestId("settingsButton");
    fireEvent.press(button);

    // check that settings page is loaded
    expect(queryByTestId("SettingsPage")).not.toBeNull();
    expect(queryByTestId("DarkModeToggle")).not.toBeNull();
  });

  // test component mocks the setting page
  const TestComponent: React.FC = () => {
    const { theme, toggleTheme } = useContext(ThemeContext); // Use context inside a React component

    return (
      <>
        <SettingsPage
          visibility={true}
          onPress={toggleTheme} // Pass toggleTheme to the SettingsPage
        />
        <Text testID="CurrentTheme">{theme}</Text>
      </>
    );
  };

  test("dark mode toggles theme", () => {
    // render settings page
    const { getByTestId } = render(
      <MockThemeProvider>
        <TestComponent />
      </MockThemeProvider>
    );

    // assert that theme is light mode
    const themeText = getByTestId("CurrentTheme");
    expect(themeText).toHaveTextContent("light");

    // toggle dark mode
    const toggle = getByTestId("DarkModeToggle");
    fireEvent.press(toggle);
    expect(themeText).toHaveTextContent("dark");

    // toggle light mode
    fireEvent.press(toggle);
    expect(themeText).toHaveTextContent("light");
  });
});
