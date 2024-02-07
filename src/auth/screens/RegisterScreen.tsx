// import axios from 'axios';
import {t} from 'i18next';
import React, {useRef, useState} from 'react';
import {
  View,
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
import {styles} from '../styles/LoginStyles';
import PrimaryButton from '../components/PrimaryButton';
import AuthServices from '../services/AuthServices';
import {Text} from 'react-native';
import {setAuthToken, setUser} from '../../redux/states/user';
import {useDispatch} from 'react-redux';
import ErrorComponent from '../components/ErrorComponent';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmedPasswordVisibility = () => {
    setShowConfirmedPassword(!showConfirmedPassword);
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

  const dispatch = useDispatch();
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
              placeholder={t('authScreens.email') || 'Email '}
              placeholderTextColor="#FFFFFF"
              style={[
                styles.inputButton,
                {
                  borderColor:
                    error === 'userAlreadyExists'
                      ? 'rgb(208, 54, 60)'
                      : 'white',
                },
              ]}
              value={email}
              onChangeText={setEmail}
            />
            <View style={styles.passwordContainer}>
              <TextInput
                placeholder={t('authScreens.password') || 'Password'}
                placeholderTextColor="#FFFFFF"
                style={[
                  styles.inputButton,
                  {
                    borderColor:
                      error === 'passwordNotStrong'
                        ? 'rgb(208, 54, 60)'
                        : 'white',
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
            <View style={styles.passwordContainer}>
              <TextInput
                placeholder={
                  t('authScreens.confirmedPassword') || 'Confirm password'
                }
                placeholderTextColor="#FFFFFF"
                style={[
                  styles.inputButton,
                  {
                    borderColor:
                      error === 'passwordNotStrong'
                        ? 'rgb(208, 54, 60)'
                        : 'white',
                  },
                ]}
                secureTextEntry={!showConfirmedPassword} // Mostrar o ocultar la contraseña según el estado
                value={confirmedPassword}
                onChangeText={setConfirmedPassword}
              />
              <TouchableOpacity
                style={styles.hidePasswordButton}
                onPress={toggleConfirmedPasswordVisibility}>
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
            <PrimaryButton
              disabled={password !== confirmedPassword}
              text={t('authScreens.signup')}
              onPress={async () => {
                try {
                  const response = await AuthServices.signup(email, password);
                  if (response) {
                    dispatch(setAuthToken(response.token || ''));
                    dispatch(setUser(response || {}));
                  }
                } catch (error: string | any) {
                  startShake();
                  setError(error instanceof Error ? error.message : 'random');
                }
              }}
            />
            {error && <ErrorComponent text={t(`errors.auth.${error}`)} />}
          </View>
          <View style={styles.bottomContainer}>
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
