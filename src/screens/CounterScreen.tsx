import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Fab} from '../components/Fab';
import SplashScreen from 'react-native-splash-screen';
import Config from 'react-native-config';

export const CounterScreen = () => {
  const [counter, setCounter] = useState(10);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Counter: {counter}</Text>
      <Text style={styles.title}>ENV: {Config.ENV_PAU_TEST}</Text>
      <Fab title="+1" onPress={() => setCounter(counter + 1)} />
      <Fab title="-1" location="bl" onPress={() => setCounter(counter - 1)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 45,
    top: -15,
  },
});
