import React from 'react';
import { StyleSheet } from 'react-native';
import { Modal, Text, Toggle, Card, Layout } from '@ui-kitten/components';
import { ThemeContext } from './theme-context';

interface SettingsPageProp {
  visbility: boolean;
  onPress: (arg0: boolean) => void;
}

const SettingsPage: React.FC<SettingsPageProp> = ({ visbility, onPress }) => {
    // light / dark mode toggle
    const themeContext = React.useContext(ThemeContext);
    const isDarkMode = themeContext.theme === 'dark';

    const onModeChange = (nextTheme): void => {
      themeContext.toggleTheme();
    };

    return (
      <Layout>
          <Modal
              backdropStyle={styles.backdrop}
              style={styles.modal}
              visible={visbility}
              onBackdropPress={() => onPress(false)}
          >
              <Card style={styles.card}>
                  <Text category='h1'>Settings</Text>
                  <Toggle
                      checked={isDarkMode}
                      onChange={onModeChange}
                      >
                      Enable Dark Mode
                  </Toggle>
              </Card>
          </Modal>
      </Layout>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    backdrop: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modal: {
      width: '70%',
      position: 'absolute',
      left: '0%',
      height: '98%',
      top: '3%',
    },
    card: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-start',
      // paddingTop: '5%'
    }
  });


  export default SettingsPage;