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
          <View
            style={{
              marginRight: 5,
              width: 30,
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image source={routes_text_search} style={styles.image} />
          </View>
          <View
            style={{
              width: '100%',
              height: '100%',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: '#3F713B',
                marginRight: 50,
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                fontFamily: 'Montserrat-Regular',
              }}
              numberOfLines={1}>
              {textSearch || t('routes.search') || 'Search'}
            </Text>
          </View>
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
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    height: 42,
    width: '100%',
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  image: {width: 20, height: 20},
  textInput: {
    color: '#3F713B',
    paddingRight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
  },
});
