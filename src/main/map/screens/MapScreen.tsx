/* eslint-disable react-hooks/exhaustive-deps */
import {Camera, MapView, setAccessToken} from '@rnmapbox/maps';
import {useEffect, useState} from 'react';
import {Dimensions, Platform, StyleSheet, View} from 'react-native';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import map_qr_scanner from '../../../assets/images/icons/map_qr_scanner.png';
import map_center_coordinates from '../../../assets/images/icons/map_center_coordinates.png';
import MapScreenButton from '../components/MapScreenButton';
import {MarkerComponent} from '../components/Marker';
import MapPlaceDetail from '../components/placeDetail/MapPlaceDetail';
import MapServices from '../services/MapServices';
import CurrentPositionMarker from '../components/CurrentPositionMarker';
import {useTabMapStore} from '../../../zustand/TabMapStore';
import {useMainStore} from '../../../zustand/MainStore';
import Geolocation from '@react-native-community/geolocation';
import {useUserStore} from '../../../zustand/UserStore';
import TextSearchMapScreen from '../components/TextSearchMapScreen';

setAccessToken(
  'pk.eyJ1IjoieHBsb3JlYXIiLCJhIjoiY2xqMmU0Z3NyMGFxeTNwbzByNW90dmdxcSJ9.cMT52Rc64Z05YUGPIutXFw',
);

export default function MapScreen({navigation}: {navigation: any}) {
  const mapRef = useMainStore(state => state.main.mapRef);
  const cameraRef = useMainStore(state => state.main.cameraRef);
  const markerSelected = useTabMapStore(state => state.tabMap.markerSelected);
  const language = useUserStore(state => state.user.language);
  const currentUserLocation = useMainStore(
    state => state.main.currentUserLocation,
  );
  const markers = useTabMapStore(state => state.tabMap.markers);
  const setMarkers = useTabMapStore(state => state.setMarkers);
  const mapCameraCoordinates = useTabMapStore(
    state => state.tabMap.mapCameraCoordinates,
  );
  const setMapCameraCoordinates = useTabMapStore(
    state => state.setMapCameraCoordinates,
  );
  const hasInitByUrl = useMainStore(state => state.main.hasInitByUrl);

  const setCurrentUserLocation = useMainStore(
    state => state.setCurrentUserLocation,
  );
  const forceUpdateMapCamera = useTabMapStore(
    state => state.tabMap.forceUpdateMapCamera,
  );
  const setForceUpdateMapCamera = useTabMapStore(
    state => state.setForceUpdateMapCamera,
  );
  const zoomLevel = useTabMapStore(state => state.tabMap.zoomLevel);
  const setZoomLevel = useTabMapStore(state => state.setZoomLevel);
  const animationDuration = useTabMapStore(
    state => state.tabMap.animationDuration,
  );
  const setAnimationDuration = useTabMapStore(
    state => state.setAnimationDuration,
  );

  useEffect(() => {
    const fetchMarkers = async () => {
      const markersData = await MapServices.getAllMarkers(
        'importance',
        'asc',
        language,
      );
      setMarkers(
        markersData.map(marker => ({
          id: marker.id,
          coordinates: [
            marker.address.coordinates.lng,
            marker.address.coordinates.lat,
          ] as [number, number],
          importance: marker.importance,
          selected: marker.id === markerSelected,
        })),
      );
    };
    fetchMarkers();
  }, []);

  useEffect(() => {
    if (markerSelected && markers.length > 0) {
      const coordinatesToSet =
        markers?.find(m => m.id === markerSelected)?.coordinates ||
        currentUserLocation;
      if (coordinatesToSet) {
        setMapCameraCoordinates(coordinatesToSet);
        setForceUpdateMapCamera(true);
      }
    }
  }, [markerSelected]);

  useEffect(() => {
    if (forceUpdateMapCamera) {
      cameraRef?.current?.setCamera({
        animationDuration: animationDuration || 1000,
        zoomLevel: zoomLevel || 17,
        centerCoordinate: mapCameraCoordinates,
      });
      setAnimationDuration(1000);
      setZoomLevel(17);
      setForceUpdateMapCamera(false);
    }
  }, [mapCameraCoordinates, forceUpdateMapCamera]);

  const centerCoordinatesButtonAction = async () => {
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
        setMapCameraCoordinates(currentUserLocation);
        setForceUpdateMapCamera(true);
      } else {
        Geolocation.getCurrentPosition(
          (position: any) => {
            const {longitude, latitude} = position.coords;
            setCurrentUserLocation([longitude, latitude]);
            setMapCameraCoordinates([longitude, latitude]);
            setForceUpdateMapCamera(true);
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
  };

  return (
    <View style={styles.mapContainer}>
      <View
        style={{
          height: Dimensions.get('window').height,
          width: Dimensions.get('window').width,
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
              centerCoordinate: mapCameraCoordinates || currentUserLocation,
              zoomLevel: 10,
              pitch: hasInitByUrl ? 60 : 0,
            }}
            zoomLevel={17}
            pitch={hasInitByUrl ? 60 : 0}
            ref={cameraRef}
            centerCoordinate={mapCameraCoordinates || currentUserLocation}
            animationDuration={1000}
          />
        </MapView>
        <MapScreenButton
          onPress={() => navigation.navigate('QRScannerScreen')}
          image={map_qr_scanner}
          additionalBottom={60}
        />
        <MapScreenButton
          onPress={async () => await centerCoordinatesButtonAction()}
          image={map_center_coordinates}
        />
        <MapPlaceDetail />
        <TextSearchMapScreen
          onPress={() => {
            navigation.navigate('TextSearchScreen');
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    height: Dimensions.get('screen').height,
    width: Dimensions.get('screen').width,
    marginBottom: -24,
  },
  mapView: {flex: 1, color: 'white'},
});
