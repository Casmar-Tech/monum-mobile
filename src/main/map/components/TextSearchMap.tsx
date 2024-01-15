import {
  View,
  Image,
  TextInput,
  StyleSheet,
  Text,
  ScrollView,
} from 'react-native';
import routes_text_search from '../../../assets/images/icons/routes_text_search.png';
import {t} from 'i18next';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useEffect, useState} from 'react';
import MapServices from '../services/MapServices';
import {TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Platform} from 'react-native';

interface TextSearchMapProps {
  textSearch: string | undefined;
  setTextSearch: (string: string | undefined) => void;
  onSubmitEditing: () => void;
  isDropdownVisible: boolean;
  toggleDropdown: (visible: boolean) => void;
}

export default function TextSearchMap({
  textSearch,
  setTextSearch,
  onSubmitEditing,
  isDropdownVisible,
  toggleDropdown,
}: TextSearchMapProps) {
  useEffect(() => {
    toggleDropdown(isDropdownVisible); // Llama a toggleDropdown cuando isDropdownVisible cambie
  }, [isDropdownVisible]);

  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      const suggestionsData =
        textSearch &&
        (await MapServices.getPlaceSearcherSuggestions(textSearch));
      setSuggestions(suggestionsData);
    };
    textSearch && fetchSuggestions();
  }, [textSearch]);

  return (
    <View
      style={{
        width: '100%',
        top: 60,
        paddingHorizontal: 15,
        position: 'absolute',
        alignSelf: 'center',
      }}>
      <View style={[styles.container]}>
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
          onSubmitEditing={onSubmitEditing}
          onFocus={() => toggleDropdown(true)} // Mostrar el desplegable cuando el TextInput está enfocado
          onBlur={() => toggleDropdown(false)} // Ocultar el desplegable cuando el TextInput pierde el foco
        />
      </View>
      <View
        style={{
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 10,
          zIndex: -1,
        }}>
        <ScrollView
          style={{
            backgroundColor: 'rgb(255,255,255)',
            maxHeight: isDropdownVisible ? 210 : 0,
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
            marginTop: -10,
          }}>
          {suggestions.map((suggestion, i) => (
            <TouchableOpacity
              onPress={() => {
                setTextSearch(suggestion);
                onSubmitEditing();
                toggleDropdown(false);
              }}>
              <View
                key={i}
                style={{
                  paddingTop: i === 0 ? 10 : 0,
                  borderTopColor: i === 0 ? 'white' : 'rgba(0,0,0,0.2)',
                  borderBottomColor: 'rgba(0,0,0,0.2)',
                  borderWidth: i === 0 ? 0 : 0.3,
                  marginHorizontal: -10,
                  height: i === 0 ? 50 : 40,
                }}>
                <Text
                  style={{
                    fontFamily: 'Montserrat-Regular',
                    fontSize: 14,
                    paddingHorizontal: 30,
                    paddingVertical: 10,
                  }}>
                  {suggestion}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
