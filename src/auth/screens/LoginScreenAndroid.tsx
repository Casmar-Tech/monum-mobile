// import axios from 'axios';
import {StackNavigationProp} from '@react-navigation/stack';
import {changeLanguage} from 'i18next';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Linking,
} from 'react-native';

import background_monuments from '../../assets/images/backgrounds/background_monuments.png';
import google_sign_in_logo from '../../assets/images/logos/google_sign_in_logo.png';
import BouncyLogo from '../components/BouncyLogo';
import SecondaryButton from '../components/SecondaryButton';
import SeparatorComponent from '../components/SeparatorComponent';
import {RootStackParamList} from '../navigator/AuthNavigator';
import {styles} from '../styles/LoginStyles';
import {useUserStore} from '../../zustand/UserStore';
import AuthServices from '../services/AuthServices';
import {useTranslation} from 'react-i18next';
import ButtonWithLogo from '../components/ButtonWithLogo';

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

export default function LoginScreenAndroid({navigation}: Props) {
  const setAuthToken = useUserStore(state => state.setAuthToken);
  const setUser = useUserStore(state => state.setUser);
  const setIsAuthenticated = useUserStore(state => state.setIsAuthenticated);
  const {t} = useTranslation();
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
              text={t('authScreens.loginWithCredentials')}
              onPress={() => {
                navigation.navigate('LoginWithCredentials');
              }}
            />
            <SecondaryButton
              text={t('authScreens.loginAsGuest')}
              onPress={async () => {
                try {
                  const user = await AuthServices.loginAsGuest();
                  if (user) {
                    await setAuthToken(user.token || '');
                    setUser(user);
                    setIsAuthenticated(true);
                    await changeLanguage(user.language || 'en_US');
                  } else {
                    console.error('ERROR WHEN LOGGING AS GUEST');
                  }
                } catch (error) {
                  console.error('ERROR WHEN LOGGING AS GUEST', error);
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
            <View style={styles.privacyContainer}>
              <Text style={styles.privacyText}>
                {t('authScreens.pressToObtainInfoAbout')}{' '}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL('https://www.monum.es/privacy');
                }}>
                <Text style={styles.privacyButtonText}>
                  {t('authScreens.privacyPolicy')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}
