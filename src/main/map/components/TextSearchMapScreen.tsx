import {
  View,
  Image,
  TextInput,
  StyleSheet,
  ViewStyle,
  Platform,
  Pressable,
  Text,
  ActivityIndicator,
} from 'react-native';
import routes_text_search from '../../../assets/images/icons/routes_text_search.png';
import {t} from 'i18next';
import LinearGradient from 'react-native-linear-gradient';
import {useTabMapStore} from '../../../zustand/TabMapStore';

interface TextSearchMapDisabledProps {
  onPress: () => void;
}

export default function TextSearchMapDisabled({
  onPress,
}: TextSearchMapDisabledProps & {style?: ViewStyle}) {
  const textSearch = useTabMapStore(state => state.tabMap.textSearch);
  const textSearchIsLoading = useTabMapStore(
    state => state.tabMap.textSearchIsLoading,
  );
  return (
    <View
      style={{
        width: '100%',
        top: 60,
        paddingHorizontal: 15,
        position: 'absolute',
        alignSelf: 'center',
      }}>
      <Pressable onPress={onPress} style={{flex: 1}}>
        <View style={styles.container}>
          <View style={{marginRight: 5, width: 30}}>
            <Image
              source={routes_text_search}
              style={
                Platform.OS === 'android'
                  ? styles.imageAndroid
                  : styles.imageIOS
              }
            />
          </View>
          <Text
            style={{
              color: '#3F713B',
              paddingRight: 50,
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              fontFamily: 'Montserrat-Regular',
            }}
            numberOfLines={1}>
            {textSearch || t('routes.search') || 'Search'}
          </Text>
          {textSearchIsLoading && (
            <View
              style={{
                position: 'absolute',
                right: 15,
                width: 20,
                height: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator size="small" color="#3F713B" />
            </View>
          )}
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
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
