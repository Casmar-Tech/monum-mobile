import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigator/AuthNavigator';
import {useRef, useState} from 'react';
import {styles} from '../styles/LoginStyles';
import {
  View,
  Text,
  ImageBackground,
  TextInput,
  Image,
  Animated,
} from 'react-native';
import background_monuments from '../../assets/images/backgrounds/background_monuments.png';
import logo_white from '../../assets/images/logos/logo_white.png';
import PrimaryButton from '../components/PrimaryButton';
import AuthServices from '../services/AuthServices';
import ErrorComponent from '../components/ErrorComponent';
import {useTranslation} from 'react-i18next';

type PasswordRecoveryScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'PasswordRecovery'
>;

type Props = {
  navigation: PasswordRecoveryScreenNavigationProp;
};

export default function PasswordRecoveryScreen({navigation}: Props) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const {t} = useTranslation();

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
                {t('authScreens.passwordRecoveryTitle') || ''}
              </Text>
              <Text style={styles.passwordRecoveryText}>
                {t('authScreens.passwordRecoveryText') || ''}
              </Text>
            </View>
            <TextInput
              placeholder={t('authScreens.email') || 'Email'}
              placeholderTextColor="#FFFFFF"
              style={[
                styles.inputButton,
                {
                  borderColor: error ? 'rgb(208, 54, 60)' : 'white',
                },
              ]}
              value={email}
              onChangeText={setEmail}
            />
            <PrimaryButton
              text={t('authScreens.resetPassword')}
              disabled={!email || !AuthServices.validateEmail(email)}
              onPress={async () => {
                try {
                  const emailToLower = email.toLowerCase();
                  const response =
                    await AuthServices.resetPassword(emailToLower);
                  if (response) {
                    setError(null);
                    navigation.navigate('CodeVerification', {
                      email: emailToLower,
                    });
                  }
                } catch (error: string | any) {
                  console.log('error', error);
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
