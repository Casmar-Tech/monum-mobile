// import axios from 'axios';
import {StackNavigationProp} from '@react-navigation/stack';
import {changeLanguage, t} from 'i18next';
import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  Animated,
} from 'react-native';
import background_monuments from '../../assets/images/backgrounds/background_monuments.png';
import password_eye from '../../assets/images/icons/password_eye.png';
import password_eye_crossed from '../../assets/images/icons/password_eye_crossed.png';
import logo_white from '../../assets/images/logos/logo_white.png';
import PrimaryButton from '../components/PrimaryButton';
import {RootStackParamList} from '../navigator/AuthNavigator';
import {styles} from '../styles/LoginStyles';
import AuthServices from '../services/AuthServices';
import {useUserStore} from '../../zustand/UserStore';
import ErrorComponent from '../components/ErrorComponent';
import {useMainStore} from '../../zustand/MainStore';
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
  const setLanguage = useMainStore(state => state.setLanguage);
  const setIsAuthenticated = useUserStore(state => state.setIsAuthenticated);
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const shakeAnimation = useRef(new Animated.Value(0)).current;

  const startShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.backgroundContainer}>
      <View style={styles.backgroundColor} />
      <ImageBackground source={background_monuments} style={styles.background}>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{translateX: shakeAnimation}],
            },
          ]}>
          <View style={styles.logoContainer}>
            <Image
              source={logo_white}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <View style={styles.buttonContainer}>
            <TextInput
              placeholder={
                t('authScreens.emailOrUsername') || 'Email or username'
              }
              placeholderTextColor="#FFFFFF"
              style={[
                styles.inputButton,
                {
                  borderColor: error ? 'rgb(208, 54, 60)' : 'white',
                },
              ]}
              value={emailOrUsername}
              onChangeText={setEmailOrUsername}
              autoCapitalize="none"
            />
            <View style={styles.passwordContainer}>
              <TextInput
                placeholder={t('authScreens.password') || 'Password'}
                placeholderTextColor="#FFFFFF"
                style={[
                  styles.inputButton,
                  {
                    borderColor: error ? 'rgb(208, 54, 60)' : 'white',
                  },
                ]}
                secureTextEntry={!showPassword} // Mostrar o ocultar la contraseña según el estado
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.hidePasswordButton}
                onPress={togglePasswordVisibility}>
                {showPassword ? (
                  <Image
                    source={password_eye}
                    style={styles.hidePasswordButtonIcon}
                    resizeMode="contain"
                  />
                ) : (
                  <Image
                    source={password_eye_crossed}
                    style={styles.hidePasswordButtonIcon}
                    resizeMode="contain"
                  />
                )}
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('PasswordRecovery');
              }}
              style={styles.forgotPasswordButton}>
              <Text style={styles.forgotPasswordText}>
                {t('authScreens.forgotPassword') || 'Forgot password?'}
              </Text>
            </TouchableOpacity>
            <PrimaryButton
              text={t('authScreens.access')}
              onPress={async () => {
                try {
                  const user = await AuthServices.login(
                    emailOrUsername,
                    password,
                  );
                  if (user) {
                    setAuthToken(user.token || '');
                    setUser(user);
                    setLanguage(user.language || 'en_US');
                    setIsAuthenticated(true);
                    await changeLanguage(user.language || 'en_US');
                  }
                } catch (error: string | any) {
                  startShake();
                  setError(error instanceof Error ? error.message : 'RANDOM');
                }
              }}
            />
            {error && <ErrorComponent text={t(`errors.auth.${error}`)} />}
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
        </Animated.View>
      </ImageBackground>
    </View>
  );
}
