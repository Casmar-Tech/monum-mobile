import {styles} from '../styles/LoginStyles';
import {View, Text, ImageBackground, Image} from 'react-native';
import background_monuments from '../../assets/images/backgrounds/background_monuments.png';
import logo_white from '../../assets/images/logos/logo_white.png';
import {RootStackParamList} from '../navigator/AuthNavigator';
import {StackNavigationProp} from '@react-navigation/stack';
import PrimaryButton from '../components/PrimaryButton';
import {useTranslation} from 'react-i18next';

type PasswordChangedScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'PasswordChanged'
>;

type Props = {
  navigation: PasswordChangedScreenNavigationProp;
};

export default function PasswordChanged({navigation}: Props) {
  const {t} = useTranslation();
  return (
    <View style={styles.backgroundContainer}>
      <View style={styles.backgroundColor} />
      <ImageBackground source={background_monuments} style={styles.background}>
        <View style={[styles.container]}>
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
                {t('authScreens.passwordChangedTitle')}
              </Text>
              <Text style={styles.passwordRecoveryText}>
                {t('authScreens.passwordChangedMessage')}
              </Text>
              <PrimaryButton
                text={t('authScreens.passwordChangedButton')}
                onPress={() => navigation.navigate('LoginWithCredentials')}
              />
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}
