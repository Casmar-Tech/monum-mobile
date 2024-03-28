// import axios from 'axios';
import {StackNavigationProp} from '@react-navigation/stack';
import {changeLanguage, t} from 'i18next';
import React from 'react';
import {View, Text, TouchableOpacity, ImageBackground} from 'react-native';

import background_monuments from '../../assets/images/backgrounds/background_monuments.png';
import google_sign_in_logo from '../../assets/images/logos/google_sign_in_logo.png';
import BouncyLogo from '../components/BouncyLogo';
import SecondaryButton from '../components/SecondaryButton';
import SeparatorComponent from '../components/SeparatorComponent';
import {RootStackParamList} from '../navigator/AuthNavigator';
import GoogleAuthService from '../services/GoogleAuthService';
import {styles} from '../styles/LoginStyles';
import {useUserStore} from '../../zustand/UserStore';
import AuthServices from '../services/AuthServices';

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

export default function LoginScreen({navigation}: Props) {
  const setAuthToken = useUserStore(state => state.setAuthToken);
  const setUser = useUserStore(state => state.setUser);
  const setIsAuthenticated = useUserStore(state => state.setIsAuthenticated);
  return (
    <View style={styles.backgroundContainer}>
      <View style={styles.backgroundColor} />
      <ImageBackground source={background_monuments} style={styles.background}>
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <BouncyLogo />
          </View>
          <View style={styles.buttonContainer}>
            <SecondaryButton
              imageSource={google_sign_in_logo}
              text={t('authScreens.loginWithGoogle')}
              onPress={async () => {
                const user = await GoogleAuthService.signInWithGoogle();
                if (user) {
                  await setAuthToken(user.token || '');
                  setUser(user);
                  setIsAuthenticated(true);
                  await changeLanguage(user.language || 'en_US');
                } else {
                  console.error('ERROR WHEN LOGGING IN WITH GOOGLE');
                }
              }}
            />
            <SeparatorComponent />
            <SecondaryButton
              text={t('authScreens.loginWithCredentials')}
              onPress={() => {
                navigation.navigate('LoginWithCredentials');
              }}
            />
            <SecondaryButton
              text={t('authScreens.loginAsGuest')}
              onPress={async () => {
                const user = await AuthServices.loginAsGuest();
                console.log('user', user);
                if (user) {
                  await setAuthToken(user.token || '');
                  setUser(user);
                  setIsAuthenticated(true);
                  await changeLanguage(user.language || 'en_US');
                } else {
                  console.error('ERROR WHEN LOGGING AS GUEST');
                }
              }}
              style={{marginTop: 30}}
            />
          </View>
          <View style={styles.bottomContainer}>
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>
                {t('authScreens.notRegistered')}{' '}
              </Text>
              <TouchableOpacity
                activeOpacity={0.2}
                onPress={() => {
                  navigation.navigate('Register');
                }}>
                <Text style={styles.registerButtonText}>
                  {t('authScreens.register')}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.companyContainer}>
              <Text style={styles.companyText}>
                {t('authScreens.footerText')}
              </Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}
