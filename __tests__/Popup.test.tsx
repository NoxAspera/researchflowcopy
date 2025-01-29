import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { MockThemeProvider } from "../components/MockThemeProvider";
import PopupProp from "../components/Popup";

describe("Popup", () => {
  test("button works", () => {
    const action = jest.fn();
    const { getByTestId } = render(
      <MockThemeProvider>
        <PopupProp
          popupText="test"
          popupColor={"red"}
          visible={true}
          onPress={action}
        />
      </MockThemeProvider>
    );
    const button = getByTestId("PopupButton");

    // Simulate a click event
    fireEvent.press(button);

    // Check if the onClick function was called
    expect(action).toHaveBeenCalledTimes(1);
  });
});
