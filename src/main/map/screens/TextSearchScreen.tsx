import {View} from 'react-native';
import TextSearchActive from '../components/TextSearchActive';
import {useTabMapStore} from '../../../zustand/TabMapStore';
import {useEffect} from 'react';
import {useMainStore} from '../../../zustand/MainStore';
import MapServices from '../services/MapServices';
import {ScrollView} from 'react-native-gesture-handler';
import TextSearchResultPill from '../components/TextSearchResultPill';
import LinearGradient from 'react-native-linear-gradient';

export default function TextSearchScreen({navigation}: any) {
  const textSearch = useTabMapStore(state => state.tabMap.textSearch);
  const currentUserLocation = useMainStore(
    state => state.main.currentUserLocation,
  );
  const setSearcherResults = useTabMapStore(state => state.setSearcherResults);
  const searcherResults = useTabMapStore(state => state.tabMap.searcherResults);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const suggestionsData = await MapServices.getMapSearcherResults(
          {
            lat: currentUserLocation ? currentUserLocation[1] : 0,
            lng: currentUserLocation ? currentUserLocation[0] : 0,
          },
          textSearch,
        );
        setSearcherResults(suggestionsData || []);
      } catch (error) {
        console.log('error', error);
      }
    };
    fetchSuggestions();
  }, [textSearch]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        paddingBottom: 30,
      }}>
      <LinearGradient
        start={{x: 0, y: 1}}
        end={{x: 0, y: 0}}
        colors={['#0002', '#0000']}
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          backgroundColor: 'white',
          height: 100,
        }}
      />
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
