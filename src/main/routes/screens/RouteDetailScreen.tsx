/* eslint-disable react-hooks/exhaustive-deps */
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {RouteDetailScreenProps} from '../navigator/RoutesNavigator';
import {Camera, MapView} from '@rnmapbox/maps';
import React, {createRef, useEffect, useRef, useState} from 'react';
import media_bubble_back from '../../../assets/images/icons/media_bubble_back.png';
import {useQuery} from '@apollo/client';
import {GET_ROUTE_DETAIL} from '../../../graphql/queries/routeQueries';
import {MarkerComponent} from '../components/Marker';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import RatingPill from '../components/RatingPill';
import TextSearch from '../components/TextSearch';
import PlaceFromRoutePill, {
  PlaceFromRoutePillRef,
} from '../components/placeFromRoutePill/PlaceFromRoutePill';
import IStop from '../../../shared/interfaces/IStop';
import CenterCoordinatesButton from '../components/CenterCoordinatesButton';
import CurrentPositionMarker from '../../map/components/CurrentPositionMarker';
import LinearGradient from 'react-native-linear-gradient';
import {useTabRouteStore, TabRouteState} from '../../../zustand/TabRouteStore';
import {useMainStore} from '../../../zustand/MainStore';
import {PERMISSIONS, RESULTS, check, request} from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import CenterStopsButton from '../components/CenterStopsButton';
import {CameraRef} from '@rnmapbox/maps/lib/typescript/src/components/Camera';
import {IMarker} from '../../../shared/interfaces/IMarker';
import {useUserStore} from '../../../zustand/UserStore';

export default function RouteDetailScreen({
  navigation,
}: RouteDetailScreenProps) {
  const tabRouteCameraRef = useRef<CameraRef>(null);
  const setTabRouteCameraRef = useTabRouteStore(state => state.setCameraRef);
  const bounds = useTabRouteStore(state => state.bounds);
  const setBounds = useTabRouteStore(state => state.setBounds);
  const routeOfCity = useTabRouteStore(state => state.routeOfCity);
  const setRouteOfCity = useTabRouteStore(state => state.setRouteOfCity);
  const scrollViewRef = useRef<ScrollView>(null);
  const currentUserLocation = useMainStore(
    state => state.main.currentUserLocation,
  );
  const [originalData, setOriginalData] = useState<any | null>(null);
  const [placesFromRoute, setPlacesFromRoute] = useState<IStop[]>();
  const markerSelected = useTabRouteStore(state => state.markerSelected);
  const markers = useTabRouteStore(state => state.markers);
  const setMarkers = useTabRouteStore(state => state.setMarkers);
  const setMarkerSelected = useTabRouteStore(state => state.setMarkerSelected);
  const language = useUserStore(state => state.user.language);
  const [textSearch, setTextSearch] = useState<string | undefined>(undefined);

  const routeCameraCoordinates = useTabRouteStore(
    state => state.routeCameraCoordinates,
  );
  const setRouteCameraCoordinates = useTabRouteStore(
    state => state.setRouteCameraCoordinates,
  );
  const setCurrentUserLocation = useMainStore(
    state => state.setCurrentUserLocation,
  );
  const forceUpdateRouteCamera = useTabRouteStore(
    state => state.forceUpdateRouteCamera,
  );
  const setForceUpdateRouteCamera = useTabRouteStore(
    state => state.setForceUpdateRouteCamera,
  );

  const {loading, error, data, refetch} = useQuery(GET_ROUTE_DETAIL, {
    variables: {
      routeId: routeOfCity.id,
    },
  });

  const calculateBounds = (markers: IMarker[]): TabRouteState['bounds'] => {
    let minLng = currentUserLocation
      ? currentUserLocation[0]
      : markers[0]?.coordinates[0];
    let maxLng = currentUserLocation
      ? currentUserLocation[0]
      : markers[0]?.coordinates[0];
    let minLat = currentUserLocation
      ? currentUserLocation[1]
      : markers[0]?.coordinates[1];
    let maxLat = currentUserLocation
      ? currentUserLocation[1]
      : markers[0]?.coordinates[1];

    markers.forEach(marker => {
      if (marker.coordinates[0] < minLng) minLng = marker.coordinates[0];
      if (marker.coordinates[0] > maxLng) maxLng = marker.coordinates[0];
      if (marker.coordinates[1] < minLat) minLat = marker.coordinates[1];
      if (marker.coordinates[1] > maxLat) maxLat = marker.coordinates[1];
    });

    return {
      sw: [minLng, minLat],
      ne: [maxLng, maxLat],
      padding: 60,
    };
  };

  const centerStopsCamera = async () => {
    if (!tabRouteCameraRef.current) {
      console.log('Camera not ready');
      return;
    }
    const {sw, ne, padding} = calculateBounds(markers);
    tabRouteCameraRef?.current?.fitBounds(sw, ne, padding, 500);
  };

  useEffect(() => {
    setTabRouteCameraRef(tabRouteCameraRef);
    return () => setTabRouteCameraRef(null);
  }, []);

  useEffect(() => {
    if (markers.length > 0) {
      const calculatedBounds = calculateBounds(markers);
      setBounds(calculatedBounds);
    }
  }, [markers]);

  useEffect(() => {
    async function fetchStops() {
      try {
        const response = await refetch();
        if (response && response.data) {
          setOriginalData(response.data || []);
        }
      } catch (error) {
        console.error('Error trying to get stops:', error);
      }
    }
    fetchStops();
  }, [textSearch, refetch, language]);

  useEffect(() => {
    if (originalData) {
      setRouteOfCity(originalData.route);
      const stops = originalData?.route?.stops;
      const filteredStops = textSearch
        ? stops.filter(
            (marker: IStop) =>
              marker?.place?.name
                .toLowerCase()
                .includes(textSearch.toLowerCase()) ||
              marker?.place?.description
                .toLowerCase()
                .includes(textSearch.toLowerCase()),
          )
        : stops;

      const markers = filteredStops.map((marker: any) => ({
        id: marker.place.id,
        coordinates: [
          marker.place.address.coordinates.lng,
          marker.place.address.coordinates.lat,
        ],
        importance: marker.place.importance,
      }));
      setMarkers(markers);

      setPlacesFromRoute(filteredStops);
    }
  }, [textSearch, originalData]);

  useEffect(() => {
    placesFromRoute?.forEach(placeFromRoute => {
      const placeId = placeFromRoute.place.id;
      if (!pillRefs.get(placeId)) {
        pillRefs.set(placeId, createRef());
      }
    });
  }, [placesFromRoute]);

  useEffect(() => {
    async function scrollMarkers() {
      if (markerSelected) {
        let height = 0;
        for (const marker of markers) {
          if (marker.id === markerSelected) break;
          const pillRef = pillRefs.get(marker.id)?.current;
          height += pillRef?.isExpanded ? 230 : 80;
        }
        pillRefs.get(markerSelected)?.current?.expandPill();
        pillRefs.get(markerSelected)?.current?.highlightPill();
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({y: height, animated: true});
        }, 300);
      }
    }
    scrollMarkers();
  }, [markerSelected]);

  useEffect(() => {
    if (markerSelected && markers.length > 0) {
      const coordinatesToSet =
        markers?.find(m => m.id === markerSelected)?.coordinates ||
        currentUserLocation;
      if (coordinatesToSet) {
        setRouteCameraCoordinates(coordinatesToSet);
        setForceUpdateRouteCamera(true);
      }
    }
  }, [markerSelected]);

  useEffect(() => {
    if (forceUpdateRouteCamera) {
      tabRouteCameraRef?.current?.setCamera({
        animationDuration: 2000,
        zoomLevel: 17,
        centerCoordinate: routeCameraCoordinates,
      });
      setForceUpdateRouteCamera(false);
    }
  }, [routeCameraCoordinates, forceUpdateRouteCamera]);

  const centerCoordinatesButtonAction = async () => {
    try {
      let permissionCheck;
      if (Platform.OS === 'ios') {
        permissionCheck = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
      } else {
        permissionCheck = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
      }

      let permissionResult = await check(permissionCheck);

      if (permissionResult === RESULTS.DENIED) {
        permissionResult = await request(permissionCheck);
      }

      if (permissionResult === RESULTS.GRANTED) {
        if (currentUserLocation) {
          setRouteCameraCoordinates(currentUserLocation);
          setForceUpdateRouteCamera(true);
        } else {
          Geolocation.getCurrentPosition(
            (position: any) => {
              const {longitude, latitude} = position.coords;
              setCurrentUserLocation([longitude, latitude]);
              setRouteCameraCoordinates([longitude, latitude]);
              setForceUpdateRouteCamera(true);
            },
            (error: any) => {
              console.log(error);
            },
            {
              enableHighAccuracy: true,
              timeout: 15000,
              maximumAge: 10000,
            },
          );
        }
      } else {
        console.log('Permission not granted or not requestable.');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const pillRefs = useRef<Map<string, React.RefObject<PlaceFromRoutePillRef>>>(
    new Map(),
  ).current;

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          height: Dimensions.get('window').height * 0.4,
          width: Dimensions.get('window').width,
          elevation: 5,
          backgroundColor: 'white',
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.5,
          shadowRadius: 4,
        }}>
        <MapView
          styleURL="mapbox://styles/mapbox/standard"
          scaleBarEnabled={false}
          style={styles.mapView}>
          {markers.map(marker => (
            <MarkerComponent
              key={marker.id}
              id={marker.id}
              importance={marker.importance}
              coordinates={marker.coordinates}
            />
          ))}
          {currentUserLocation && <CurrentPositionMarker />}
          <Camera
            defaultSettings={{
              centerCoordinate: currentUserLocation,
              animationDuration: 1000,
              pitch: 0,
              bounds: {
                sw: bounds.sw,
                ne: bounds.ne,
                paddingBottom: bounds.padding,
                paddingLeft: bounds.padding,
                paddingRight: bounds.padding,
                paddingTop: bounds.padding,
              },
            }}
            animationDuration={1000}
            pitch={0}
            bounds={{
              sw: bounds.sw,
              ne: bounds.ne,
              paddingBottom: bounds.padding,
              paddingLeft: bounds.padding,
              paddingRight: bounds.padding,
              paddingTop: bounds.padding,
            }}
            ref={tabRouteCameraRef}
          />
        </MapView>
        <CenterStopsButton onPress={async () => await centerStopsCamera()} />
        <CenterCoordinatesButton
          onPress={async () => await centerCoordinatesButtonAction()}
        />
      </View>
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <View
          style={{
            flexDirection: 'row',
            paddingTop: 10,
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            marginBottom: 5,
            paddingHorizontal: 15,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              style={{padding: 10}}
              onPress={() => {
                navigation.goBack();
                setMarkerSelected(null);
              }}>
              <Image
                source={media_bubble_back}
                style={{height: 14, width: 8}}
              />
            </TouchableOpacity>
            <Text
              style={{
                color: '#032000',
                fontFamily: 'Montserrat-Regular',
                fontSize: 18,
              }}>
              {routeOfCity.title}
            </Text>
          </View>
          <RatingPill number={routeOfCity.rating || 0} />
        </View>
        <TextSearch
          style={{paddingHorizontal: 15}}
          setTextSearch={setTextSearch}
          textSearch={textSearch}
        />
        <ScrollView
          key={0}
          style={{
            paddingTop: 5,
            width: '100%',
            marginBottom: 20,
            marginTop: 10,
            paddingHorizontal: 12,
            backgroundColor: 'white',
            height: '100%',
          }}
          showsVerticalScrollIndicator={false}
          ref={scrollViewRef}>
          {placesFromRoute?.map((placeFromRoute, index) => (
            <PlaceFromRoutePill
              ref={pillRefs.get(placeFromRoute.place.id)}
              key={placeFromRoute.place.id}
              style={
                index === 0
                  ? {}
                  : index === placesFromRoute.length - 1
                    ? {paddingBottom: 40}
                    : {}
              }
              {...placeFromRoute}
            />
          ))}
        </ScrollView>
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          colors={['rgba(0,0,0,0.2)', 'transparent']}
          style={{
            position: 'absolute',
            height: 10,
            left: 0,
            right: 0,
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mapView: {color: 'white', flex: 1},
  contentContainer: {
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  mediaPillRatingContainer: {
    position: 'absolute',
    top: 0,
    left: 10,
    height: 20,
    width: 30,
    backgroundColor: '#3F713B',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
  },
  mediaPillRatingText: {
    fontSize: 8,
    color: 'white',
    fontFamily: 'Montserrat-Regular',
  },
  mediaPillRatingImage: {width: 8, height: 8},
});
