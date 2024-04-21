import {CodeVerificationScreenProps} from '../navigator/AuthNavigator';
import React, {useEffect, useRef, useState} from 'react';
import {styles} from '../styles/LoginStyles';
import {
  View,
  Text,
  ImageBackground,
  TextInput,
  Image,
  Animated,
  TouchableOpacity,
} from 'react-native';
import background_monuments from '../../assets/images/backgrounds/background_monuments.png';
import logo_white from '../../assets/images/logos/logo_white.png';
import PrimaryButton from '../components/PrimaryButton';
import AuthServices from '../services/AuthServices';
import ErrorComponent from '../components/ErrorComponent';
import {useTranslation} from 'react-i18next';

export default function CodeVerificationScreen({
  navigation,
  route,
}: CodeVerificationScreenProps) {
  const {email} = route.params;
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const {t} = useTranslation();
  const [counter, setCounter] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const startCounter = () => {
    setCounter(60);
    setIsButtonDisabled(true);
  };

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    if (counter > 0) {
      intervalId = setInterval(() => {
        setCounter(prevCounter => prevCounter - 1);
      }, 1000);
    } else {
      setIsButtonDisabled(false);
    }

    return () => clearInterval(intervalId);
  }, [counter]);

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
            <View style={styles.passwordRecoveryTextContainer}>
              <Text style={styles.passwordRecoveryTitle}>
                {t('authScreens.verification') || ''}
              </Text>
              <Text style={styles.passwordRecoveryText}>
                {t('authScreens.emailSent') || ''}
                <Text
                  style={{
                    fontFamily: 'Montserrat-SemiBold',
                  }}>{` ${email}`}</Text>
                {`. ${t('authScreens.emailSentCheck') || ''}`}
              </Text>
            </View>
            <TextInput
              placeholder={
                t('authScreens.verificationCode') || 'Verification code'
              }
              placeholderTextColor="#FFFFFF"
              keyboardType="numeric"
              style={[
                styles.inputButton,
                {
                  borderColor: error ? 'rgb(208, 54, 60)' : 'white',
                },
              ]}
              value={code}
              onChangeText={text => {
                if (text.length <= 6) {
                  setCode(text);
                }
              }}
              maxLength={6}
            />
            <View style={styles.resendCodeButtonContainer}>
              <TouchableOpacity
                activeOpacity={0.2}
                disabled={isButtonDisabled}
                style={[
                  styles.resendButton,
                  {opacity: isButtonDisabled ? 0.5 : 1},
                ]}
                onPress={async () => {
                  startCounter();
                  try {
                    await AuthServices.resetPassword(email, true);
                  } catch (error: string | any) {
                    startShake();
                    setError(error instanceof Error ? error.message : 'RANDOM');
                  }
                }}>
                <Text style={styles.passwordRecoveryText}>
                  {isButtonDisabled
                    ? `${counter} s`
                    : t('authScreens.resendCode')}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.codeResentText}>
              {isButtonDisabled ? t('authScreens.codeResent') : ' '}
            </Text>

            <PrimaryButton
              text={t('authScreens.verify')}
              onPress={async () => {
                try {
                  const response = await AuthServices.verificateCode(
                    email,
                    code,
                  );
                  if (response) {
                    setError(null);
                    navigation.navigate('ChangePassword', {
                      email,
                      token: response,
                    });
                  }
                } catch (error: string | any) {
                  startShake();
                  setError(error instanceof Error ? error.message : 'RANDOM');
                }
              }}
            />
            {error && <ErrorComponent text={t(`errors.auth.${error}`)} />}
          </View>
        </Animated.View>
      </ImageBackground>
    </View>
  );
}
