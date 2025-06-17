/**
 * Info Button
 * @author Blake Stambaugh
 * 
 * This button sits in the header of every screen and directs the user to important
 * contact info for LAIR lab employees like admin contact info and hospital locations.
 */
import React from "react";
import { Button, Icon, IconElement } from "@ui-kitten/components";
import { NavigationType } from "./types";

// preload info icon for button
const infoIcon = (props): IconElement => (
  <Icon {...props} name="info-outline" />
);

const InfoButton: React.FC<any> = ({ navigation }: NavigationType) => {
  return (
    <Button
      testID="infoButton"
      onPress={() => navigation.navigate("ContactInfo")}
      appearance="ghost"
      accessoryLeft={infoIcon}
      size="large"
      style={{ marginHorizontal: -10 }}
    />
  );
};

export default InfoButton;
