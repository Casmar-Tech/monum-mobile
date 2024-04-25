/* eslint-disable react-hooks/exhaustive-deps */
import {Camera, MapView, setAccessToken} from '@rnmapbox/maps';
import {useEffect, useRef} from 'react';
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
import TextSearchMapScreen from '../components/TextSearchMapDisabled';

setAccessToken(
  'pk.eyJ1IjoieHBsb3JlYXIiLCJhIjoiY2xqMmU0Z3NyMGFxeTNwbzByNW90dmdxcSJ9.cMT52Rc64Z05YUGPIutXFw',
);

export default function MapScreen({navigation}: {navigation: any}) {
  const cameraRef = useRef<Camera>(null);
  const setCamera = useTabMapStore(state => state.setCamera);
  const camera = useTabMapStore(state => state.tabMap.camera);
  const markerSelected = useTabMapStore(state => state.tabMap.markerSelected);
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

  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        const markersData = await MapServices.getAllMarkers(
          'importance',
          'asc',
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
      } catch (error) {
        console.error(error);
      }
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
    cameraRef.current?.setCamera({
      zoomLevel: camera.zoomLevel,
      pitch: camera.pitch,
      centerCoordinate: camera.centerCoordinate,
      animationDuration: camera.animationDuration,
    });
  }, [camera]);

  useEffect(() => {
    if (forceUpdateMapCamera) {
      setCamera({
        zoomLevel: 17,
        pitch: 0,
        centerCoordinate: mapCameraCoordinates,
        animationDuration: 2000,
      });
      setForceUpdateMapCamera(false);
    }
  }, [mapCameraCoordinates, forceUpdateMapCamera]);

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
    } catch (error) {
      console.error(error);
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
              centerCoordinate: camera.centerCoordinate || [0, 0],
              zoomLevel: camera.zoomLevel || 12,
              pitch: camera.pitch || 0,
              animationDuration: camera.animationDuration || 2000,
            }}
            zoomLevel={camera.zoomLevel || 12}
            pitch={camera.pitch || 0}
            centerCoordinate={camera.centerCoordinate || [0, 0]}
            animationDuration={camera.animationDuration || 2000}
            ref={cameraRef}
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
