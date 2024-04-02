import {View, StyleSheet, Image, Text} from 'react-native';
import success from '../../../assets/images/icons/success.png';
import {t} from 'i18next';

export default function QRSuccess() {
  return (
    <View style={styles.container}>
      <Image source={success} style={styles.icon} resizeMode="contain" />
      <Text
        style={{
          color: '#3F713B',
          fontSize: 20,
          marginTop: 20,
          fontFamily: 'Montserrat-SemiBold',
          textAlign: 'center',
        }}>
        {t('qrScannerScreen.success')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 50,
    height: 50,
  },
});
