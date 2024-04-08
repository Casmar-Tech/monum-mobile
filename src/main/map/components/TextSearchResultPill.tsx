import {Platform, Text, TouchableOpacity, View} from 'react-native';
import {ISearchResult} from '../../../shared/interfaces/ISearchResult';
import place_pre_detail_importance_1 from '../../../assets/images/icons/placeImportance/place_pre_detail_importance_1.png';
import place_pre_detail_importance_2 from '../../../assets/images/icons/placeImportance/place_pre_detail_importance_2.png';
import place_pre_detail_importance_3 from '../../../assets/images/icons/placeImportance/place_pre_detail_importance_3.png';
import search_result_city_has_monums from '../../../assets/images/icons/search_result_city_has_monums.png';
import search_result_city_not_has_monums from '../../../assets/images/icons/search_result_city_not_has_monums.png';
import {Image} from 'react-native';
import {useTabMapStore} from '../../../zustand/TabMapStore';
import {useMainStore} from '../../../zustand/MainStore';
import MapServices from '../services/MapServices';

interface TextSearchMapResultPillProps {
  searcherResult: ISearchResult;
  navigation: any;
}

export default function TextSearchMapResultPill({
  searcherResult,
  navigation,
}: TextSearchMapResultPillProps) {
  const cameraRef = useMainStore(state => state.main.cameraRef);
  const setPlace = useTabMapStore(state => state.setPlace);
  const setShowPlaceDetailExpanded = useTabMapStore(
    state => state.setShowPlaceDetailExpanded,
  );
  const setZoomLevel = useTabMapStore(state => state.setZoomLevel);
  const setAnimationDuration = useTabMapStore(
    state => state.setAnimationDuration,
  );
  const setTextSearch = useTabMapStore(state => state.setTextSearch);
  const setMarkerSelected = useTabMapStore(state => state.setMarkerSelected);
  const setMediasOfPlace = useTabMapStore(state => state.setMediasOfPlace);
  const setTextSearchIsLoading = useTabMapStore(
    state => state.setTextSearchIsLoading,
  );
  const setMapCameraCoordinates = useTabMapStore(
    state => state.setMapCameraCoordinates,
  );
  const setForceUpdateMapCamera = useTabMapStore(
    state => state.setForceUpdateMapCamera,
  );

  const importanceIcon = () => {
    switch (searcherResult?.importance) {
      case 1:
        return place_pre_detail_importance_1;
      case 2:
        return place_pre_detail_importance_2;
      case 3:
        return place_pre_detail_importance_3;
      default:
        return place_pre_detail_importance_1;
    }
  };
  const distanceToText = () => {
    if (searcherResult.distance < 1000) {
      return `${searcherResult.distance.toFixed(1).replace('.', ',')} m`;
    }
    const distanceKm = searcherResult.distance / 1000;
    let distanceKmString =
      distanceKm > 100 ? distanceKm.toFixed(0) : distanceKm.toFixed(1);
    distanceKmString = distanceKmString.replace('.', ',');
    return `${distanceKmString} km`;
  };
  return (
    <TouchableOpacity
      style={{flex: 1}}
      onPress={async () => {
        setTextSearch(searcherResult?.name);
        navigation.navigate('MapScreen');
        if (searcherResult.type === 'place') {
          setTextSearchIsLoading(true);
          const placeData = await MapServices.getPlaceInfo(searcherResult.id);
          const mediasFetched = await MapServices.getPlaceMedia(
            searcherResult.id,
          );
          setTextSearchIsLoading(false);
          setPlace(placeData);
          setMarkerSelected(searcherResult.id);
          setMediasOfPlace(mediasFetched);
          setShowPlaceDetailExpanded(false);
        } else {
          if (Platform.OS === 'ios') {
            setZoomLevel(12);
            setAnimationDuration(2000);
            setMapCameraCoordinates([
              searcherResult.coordinates.lng,
              searcherResult.coordinates.lat,
            ]);
            setForceUpdateMapCamera(true);
          } else {
            cameraRef?.current?.setCamera({
              animationDuration: 2000,
              zoomLevel: 10,
              centerCoordinate: [
                searcherResult.coordinates.lng,
                searcherResult.coordinates.lat,
              ],
            });
          }
        }
      }}>
      <View
        style={{
          borderColor: 'rgba(0,0,0,0.2)',
          height: 80,
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 5,
          paddingHorizontal: 15,
          paddingBottom: 5,
          borderBottomWidth: 1,
        }}>
        <View
          style={{
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            width: 25,
          }}>
          <Image
            source={
              searcherResult.type === 'place'
                ? importanceIcon()
                : searcherResult.hasMonums
                  ? search_result_city_has_monums
                  : search_result_city_not_has_monums
            }
            style={{
              width: 24,
              height: 24,
            }}
            resizeMode="contain"
          />
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 3,
            }}>
            <Text
              style={{
                fontFamily: 'Montserrat-Regular',
                fontSize: 6,
                color: '#032000',
              }}>
              {distanceToText()}
            </Text>
          </View>
        </View>
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            height: '100%',
            paddingHorizontal: 10,
          }}>
          <Text
            style={{
              fontFamily: 'Montserrat-Regular',
              fontSize: 16,
              color: '#032000',
            }}
            numberOfLines={1}>
            {searcherResult?.name}
          </Text>
          <Text
            style={{
              fontFamily: 'Montserrat-Regular',
              fontSize: 14,
              color: '#3F713B',
            }}
            numberOfLines={1}>
            {searcherResult.type === 'place'
              ? `${searcherResult?.city}, ${searcherResult?.country}`
              : `${searcherResult?.region}, ${searcherResult?.country}`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
