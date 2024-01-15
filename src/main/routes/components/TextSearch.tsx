import {
  View,
  Image,
  TextInput,
  StyleSheet,
  ViewStyle,
  Platform,
} from 'react-native';
import routes_text_search from '../../../assets/images/icons/routes_text_search.png';
import {t} from 'i18next';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface TextSearchProps {
  textSearch: string | undefined;
  setTextSearch: (string: string | undefined) => void;
}

export default function TextSearch({
  textSearch,
  setTextSearch,
  style,
}: TextSearchProps & {style?: ViewStyle}) {
  return (
    <View
      style={[
        style,
        {
          width: '100%',
        },
      ]}>
      <View style={styles.container}>
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 0, y: 0.3}}
          colors={['#3C6AF62E', '#3F713B14']}
          style={styles.linearGradient}
        />
        <Image
          source={routes_text_search}
          style={
            Platform.OS === 'android' ? styles.imageAndroid : styles.imageIOS
          }
        />
        <TextInput
          placeholder={t('routes.search') || 'Search'}
          placeholderTextColor="#3F713B"
          value={textSearch}
          onChangeText={setTextSearch}
          style={styles.textInput}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F4FFF4',
    borderRadius: 12,
    justifyContent: Platform.OS === 'android' ? 'center' : undefined,
    alignItems: Platform.OS === 'android' ? undefined : 'center',
    flexDirection: Platform.OS === 'android' ? undefined : 'row',
    paddingHorizontal: 15,
    height: 42,
    width: '100%',
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  linearGradient: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 12,
  },
  imageIOS: {width: 22, height: 22, marginRight: 10},
  imageAndroid: {
    width: 22,
    height: 22,
    marginRight: 10,
    position: 'absolute',
    left: 15,
  },
  textInput: {
    color: '#3F713B',
    paddingRight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    marginLeft: Platform.OS === 'android' ? 30 : undefined,
  },
});
