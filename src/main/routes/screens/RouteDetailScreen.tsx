/* eslint-disable react-hooks/exhaustive-deps */
import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import {RouteDetailScreenProps} from '../navigator/RoutesNavigator';
import {Camera, MapView} from '@rnmapbox/maps';
import React, {useEffect, useRef, useState} from 'react';
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
import {useTabRouteStore} from '../../../zustand/TabRouteStore';
import {useMainStore} from '../../../zustand/MainStore';

export default function RouteDetailScreen({
  navigation,
}: RouteDetailScreenProps) {
  const mapRef = useMainStore(state => state.main.mapRef);
  const cameraRef = useMainStore(state => state.main.cameraRef);
  const routeOfCity = useTabRouteStore(state => state.routeOfCity);
  const scrollViewRef = useRef<ScrollView>(null);
  const currentUserLocation = useMainStore(
    state => state.main.currentUserLocation,
  );
  const [originalData, setOriginalData] = useState<any | null>(null);
  const [placesFromRoute, setPlacesFromRoute] = useState<IStop[]>();
  const [centerCoordinates, setCenterCoordinates] = useState<[number, number]>([
    0, 0,
  ]);
  const markerSelected = useTabRouteStore(state => state.markerSelected);
  const markers = useTabRouteStore(state => state.markers);
  const setMarkers = useTabRouteStore(state => state.setMarkers);
  const [textSearch, setTextSearch] = useState<string | undefined>(undefined);

  const routeCameraCoordinates = useTabRouteStore(
    state => state.routeCameraCoordinates,
  );
  const setRouteCameraCoordinates = useTabRouteStore(
    state => state.setRouteCameraCoordinates,
  );

  const {loading, error, data, refetch} = useQuery(GET_ROUTE_DETAIL, {
    variables: {
      routeId: routeOfCity.id,
    },
  });

  useEffect(() => {
    if (data) {
      setOriginalData(data);
    }
  }, [data]);

  useEffect(() => {
    if (Array.isArray(markers) && markers.length > 0) {
      // Calculate the center of the markers
      const centerLat =
        markers.reduce((acc, marker) => acc + marker.coordinates[1], 0) /
        markers.length;
      const centerLng =
        markers.reduce((acc, marker) => acc + marker.coordinates[0], 0) /
        markers.length;
      setCenterCoordinates([centerLng, centerLat]);

      // Find the limits of the markers
      let minLng = markers[0]?.coordinates[0];
      let maxLng = markers[0]?.coordinates[0];
      let minLat = markers[0]?.coordinates[1];
      let maxLat = markers[0]?.coordinates[1];

      markers.forEach(marker => {
        if (marker.coordinates[0] < minLng) minLng = marker.coordinates[0];
        if (marker.coordinates[0] > maxLng) maxLng = marker.coordinates[0];
        if (marker.coordinates[1] < minLat) minLat = marker.coordinates[1];
        if (marker.coordinates[1] > maxLat) maxLat = marker.coordinates[1];
      });

      const southWest = [minLng, minLat];
      const northEast = [maxLng, maxLat];
      cameraRef?.current?.fitBounds(southWest, northEast, 100, 0);
    }
  }, [markers]);

  useEffect(() => {
    if (originalData) {
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
    // Inicializamos las referencias para los elementos de placesFromRoute solo si aún no existen
    placesFromRoute?.forEach(placeFromRoute => {
      const placeId = placeFromRoute.place.id;
      if (!pillRefs.get(placeId)) {
        pillRefs.set(placeId, React.createRef());
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
        scrollViewRef.current?.scrollTo({y: height, animated: true});
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
      }
    }
  }, [markerSelected]);

  useEffect(() => {
    cameraRef?.current?.setCamera({
      animationDuration: 1000,
      zoomLevel: 17,
      centerCoordinate: routeCameraCoordinates,
    });
  }, [routeCameraCoordinates]);

  const pillRefs = useRef<Map<string, React.RefObject<PlaceFromRoutePillRef>>>(
    new Map(),
  ).current;

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <View
        style={{
          height: Dimensions.get('window').height * 0.4,
          width: Dimensions.get('window').width,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.5,
          shadowRadius: 4,
        }}>
        <MapView
          ref={mapRef}
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
              centerCoordinate: routeCameraCoordinates || currentUserLocation,
              zoomLevel: 10,
              pitch: 0,
            }}
            zoomLevel={10}
            ref={cameraRef}
          />
        </MapView>
        <CenterCoordinatesButton
          onPress={() => {
            currentUserLocation &&
              setRouteCameraCoordinates(currentUserLocation);
          }}
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
              onPress={() => navigation.goBack()}>
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
            marginBottom: useSafeAreaInsets().bottom,
            marginTop: 10,
            paddingHorizontal: 12,
            backgroundColor: 'white',
            flex: 1,
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
