import {View} from 'react-native';
import TextSearchActive from '../components/TextSearchActive';
import {useTabMapStore} from '../../../zustand/TabMapStore';
import {useEffect} from 'react';
import {useMainStore} from '../../../zustand/MainStore';
import MapServices from '../services/MapServices';
import {ScrollView} from 'react-native-gesture-handler';
import TextSearchResultPill from '../components/TextSearchResultPill';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export default function TextSearchScreen({navigation}: any) {
  const textSearch = useTabMapStore(state => state.tabMap.textSearch);
  const setTextSearch = useTabMapStore(state => state.setTextSearch);
  const currentUserLocation = useMainStore(
    state => state.main.currentUserLocation,
  );
  const setSearcherResults = useTabMapStore(state => state.setSearcherResults);
  const searcherResults = useTabMapStore(state => state.tabMap.searcherResults);

  useEffect(() => {
    const fetchSuggestions = async () => {
      const suggestionsData = await MapServices.getMapSearcherResults(
        {
          lat: currentUserLocation ? currentUserLocation[1] : 0,
          lng: currentUserLocation ? currentUserLocation[0] : 0,
        },
        textSearch,
      );
      setSearcherResults(suggestionsData || []);
    };
    fetchSuggestions();
  }, [textSearch]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        paddingBottom: useSafeAreaInsets().bottom,
      }}>
      <TextSearchActive onPress={() => navigation.navigate('MapScreen')} />
      <ScrollView style={{paddingHorizontal: 10}}>
        {searcherResults.map((searcherResult, index) => (
          <TextSearchResultPill
            key={index}
            searcherResult={searcherResult}
            navigation={navigation}
          />
        ))}
      </ScrollView>
    </View>
  );
}
