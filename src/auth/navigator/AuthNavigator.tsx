import {NavigationContainer, RouteProp} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React, {useEffect} from 'react';
import {Platform, StatusBar} from 'react-native';

import LoginWithCredentialsScreen from '../screens/LoginWithCredentialsScreen';
import RegisterScreen from '../screens/RegisterScreen';
import SplashScreen from 'react-native-splash-screen';
import PasswordRecoveryScreen from '../screens/PasswordRecoveryScreen';
import CodeVerificationScreen from '../screens/CodeVerificationScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import PasswordChangedScreen from '../screens/PasswordChangedScreen';
const LoginScreen =
  Platform.OS === 'ios'
    ? require('../screens/LoginScreenApple').default
    : require('../screens/LoginScreenAndroid').default;

// Define un tipo para las rutas
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  LoginWithCredentials: undefined;
  Main: undefined;
  PasswordRecovery: undefined;
  CodeVerification: {email: string};
  ChangePassword: {token: string};
  PasswordChanged: undefined;
};

export interface CodeVerificationScreenProps {
  route: RouteProp<RootStackParamList, 'CodeVerification'>;
  navigation: any;
}

export interface ChangePasswordScreenProps {
  route: RouteProp<RootStackParamList, 'ChangePassword'>;
  navigation: any;
}

// Crea el stack navigator
const Stack = createStackNavigator<RootStackParamList>();

function AuthNavigator() {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <NavigationContainer independent={true}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen
          name="LoginWithCredentials"
          component={LoginWithCredentialsScreen}
        />
        <Stack.Screen
          name="PasswordRecovery"
          component={PasswordRecoveryScreen}
        />
        <Stack.Screen name="CodeVerification">
          {({route, navigation}: CodeVerificationScreenProps) => (
            <CodeVerificationScreen route={route} navigation={navigation} />
          )}
        </Stack.Screen>
        <Stack.Screen name="ChangePassword">
          {({route, navigation}: ChangePasswordScreenProps) => (
            <ChangePasswordScreen route={route} navigation={navigation} />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="PasswordChanged"
          component={PasswordChangedScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AuthNavigator;
