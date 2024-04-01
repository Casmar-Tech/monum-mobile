import {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
  View,
  TextInput,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {t} from 'i18next';
import {useTabMapStore} from '../../../zustand/TabMapStore';
import MapServices from '../services/MapServices';
import {useMainStore} from '../../../zustand/MainStore';
import LoadingSpinner from '../../../shared/components/LoadingSpinner';

export default function ScanScreen({navigation}: any) {
  const setMarkerSelected = useTabMapStore(state => state.setMarkerSelected);
  const setPlace = useTabMapStore(state => state.setPlace);
  const setShowPlaceDetailExpanded = useTabMapStore(
    state => state.setShowPlaceDetailExpanded,
  );
  const setMediasOfPlace = useTabMapStore(state => state.setMediasOfPlace);
  const setForceUpdateMapCamera = useTabMapStore(
    state => state.setForceUpdateMapCamera,
  );
  const cameraRef = useMainStore(state => state.main.cameraRef);

  const device = useCameraDevice('back');
  const [manualCode, setManualCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    console.log('manualCode:', manualCode);
  }, [manualCode]);

  useEffect(() => {
    async function requestPermission() {
      const status = await Camera.requestCameraPermission();
      console.log('Camera permission status:', status);
      if (status === 'denied') {
        Linking.openSettings();
      }
    }
    requestPermission();
  }, []);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: async (codes: any[]) => {
      setIsLoading(true);
      setIsSuccess(false);
      setIsError(false);
      setErrorMessage('');
      const [, placeId] = codes[0]?.value?.match(/place\/([^?]+)/) || [];
      if (placeId) {
        try {
          setMarkerSelected(placeId);
          const placeData = await MapServices.getPlaceInfo(placeId);
          setPlace(placeData);
          const mediasFetched = await MapServices.getPlaceMedia(placeId);
          setMediasOfPlace(mediasFetched);
          setShowPlaceDetailExpanded(false);
          setForceUpdateMapCamera(true);
          setIsSuccess(true);

          navigation.navigate('MapScreen');
          cameraRef.current.setCamera({pitch: 60, animationDuration: 1000});
        } catch (error) {
          console.log(error);
          setIsError(true);
          setErrorMessage('Algo ha ido mal. Inténtalo de nuevo.');
        }
      } else {
        setIsError(true);
        setErrorMessage('QR no válido. Inténtalo de nuevo.');
      }
      setIsLoading(false);
    },
  });
  return (
    <View
      style={[
        styles.qrScreenContainer,
        {
          paddingBottom: useSafeAreaInsets().bottom + 100,
          paddingTop: useSafeAreaInsets().top + 50,
        },
      ]}>
      {isLoading && <LoadingSpinner />}
      {isSuccess && <Text>✅ QR procesado correctamente</Text>}
      {isError && (
        <View>
          <Text>❌ {errorMessage}</Text>
        </View>
      )}
      <View style={styles.qrIntroContainer}>
        <Text style={styles.qrIntroText}>
          {t('qrScannerScreen.scanQRText')}
        </Text>
        <View style={styles.qrSearchContainer}>
          <TextInput
            placeholder={t('qrScannerScreen.writeItManually')}
            placeholderTextColor="grey"
            style={styles.qrTextInput}
            value={manualCode}
            onChangeText={setManualCode}
            autoCapitalize="characters"
          />
          <TouchableOpacity
            style={styles.qrSearchButton}
            onPress={() => {
              console.log('Search pressed');
            }}>
            <Text style={styles.qrSearchButtonText}>
              {t('qrScannerScreen.search')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          width: '100%',
          position: 'relative',
        }}>
        <View
          style={{
            width: '100%',
            padding: 5,
            height: 350,
          }}>
          <Camera
            style={{
              width: '100%',
              height: '100%',
            }}
            device={device}
            isActive={true}
            codeScanner={codeScanner}
          />
        </View>
        <View style={[styles.corner, styles.topLeftCorner]} />
        <View style={[styles.corner, styles.topRightCorner]} />
        <View style={[styles.corner, styles.bottomLeftCorner]} />
        <View style={[styles.corner, styles.bottomRightCorner]} />
      </View>
      <TouchableOpacity
        style={styles.qrCancelButton}
        onPress={() => navigation.navigate('MapScreen')}>
        <Text style={styles.qrCancelButtonText}>
          {t('qrScannerScreen.cancel')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  qrScreenContainer: {
    flex: 1,
    paddingHorizontal: 20,
    width: '100%',
    height: '100%',
    backgroundColor: '#202533',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  qrIntroContainer: {width: '100%', alignItems: 'center'},
  qrIntroText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 24,
    color: 'white',
    marginBottom: 20,
  },
  qrSearchContainer: {
    flexDirection: 'row',
    height: 48,
    width: '100%',
    justifyContent: 'space-between',
  },
  qrTextInput: {
    width: '70%',
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#3F713B',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    fontFamily: 'Montserrat-SemiBold',
    alignItems: 'center',
    paddingHorizontal: 20,
    fontSize: 14,
    color: 'grey',
  },
  qrSearchButton: {
    width: '28%',
    backgroundColor: '#3F713B',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  qrSearchButtonText: {
    color: 'white',
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
  },
  qrCancelButton: {
    width: '100%',
    backgroundColor: '#BF1C39',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    height: 48,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  qrCancelButtonText: {
    color: 'white',
    fontFamily: 'Montserrat-Regular',
    fontSize: 18,
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: 'white',
  },
  topLeftCorner: {
    borderTopWidth: 5,
    borderLeftWidth: 5,
    left: 0,
    top: 0,
  },
  topRightCorner: {
    borderTopWidth: 5,
    borderRightWidth: 5,
    right: 0,
    top: 0,
  },
  bottomLeftCorner: {
    borderBottomWidth: 5,
    borderLeftWidth: 5,
    left: 0,
    bottom: 0,
  },
  bottomRightCorner: {
    borderBottomWidth: 5,
    borderRightWidth: 5,
    right: 0,
    bottom: 0,
  },
});
