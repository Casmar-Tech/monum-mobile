/* eslint-disable react-hooks/exhaustive-deps */
import {
  View,
  Image,
  TextInput,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import text_search_delete from '../../../assets/images/icons/text_search_delete.png';
import text_search_back from '../../../assets/images/icons/text_search_back.png';
import {t} from 'i18next';
import LinearGradient from 'react-native-linear-gradient';
import {Platform} from 'react-native';
import {useTabMapStore} from '../../../zustand/TabMapStore';

interface TextSearchMapProps {
  onPress: () => void;
}

export default function TextSearchMap({onPress}: TextSearchMapProps) {
  const textSearch = useTabMapStore(state => state.tabMap.textSearch);
  const setTextSearch = useTabMapStore(state => state.setTextSearch);

  return (
    <View
      style={{
        width: '100%',
        marginTop: 60,
        paddingHorizontal: 15,
        alignSelf: 'center',
      }}>
      <View style={[styles.container]}>
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 0, y: 0.3}}
          colors={['#3C6AF62E', '#3F713B14']}
          style={styles.linearGradient}
        />
        <View style={{marginRight: 5, width: 30}}>
          <TouchableOpacity onPress={onPress}>
            <Image
              source={text_search_back}
              style={
                Platform.OS === 'android'
                  ? styles.imageAndroid
                  : styles.imageIOS
              }
            />
          </TouchableOpacity>
        </View>
        <TextInput
          ref={input => input && input.focus()}
          placeholder={t('routes.search') || 'Search'}
          placeholderTextColor="#3F713B"
          value={textSearch}
          onChangeText={setTextSearch}
          style={styles.textInput}
          numberOfLines={1}
        />
        {textSearch && textSearch.length > 0 && (
          <View
            style={{
              position: 'absolute',
              right: 5,
              width: 30,
              height: 40,
            }}>
            <Pressable
              onPress={() => setTextSearch('')}
              style={{
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={text_search_delete}
                style={{width: 10, height: 10}}
                resizeMode="contain"
              />
            </Pressable>
          </View>
        )}
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
    opacity: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 10,
    zIndex: 2,
    width: '100%',
  },
  linearGradient: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 12,
  },
  imageIOS: {width: 16, height: 16, marginRight: 10},
  imageAndroid: {
    width: 16,
    height: 16,
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
