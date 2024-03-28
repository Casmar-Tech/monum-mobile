/* eslint-disable react-hooks/exhaustive-deps */
import {Camera, MapView, setAccessToken} from '@rnmapbox/maps';
import {useEffect, useState} from 'react';
import {Dimensions, Platform, StyleSheet, View} from 'react-native';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';

import CenterCoordinatesButton from '../components/CenterCoordinatesButton';
import {MarkerComponent} from '../components/Marker';
import MapPlaceDetail from '../components/placeDetail/MapPlaceDetail';
import MapServices from '../services/MapServices';
import TextSearchMap from '../components/TextSearchMap';
import CurrentPositionMarker from '../components/CurrentPositionMarker';
import {useTabMapStore} from '../../../zustand/TabMapStore';
import {useMainStore} from '../../../zustand/MainStore';
import Geolocation from '@react-native-community/geolocation';
import {useUserStore} from '../../../zustand/UserStore';
setAccessToken(
  'pk.eyJ1IjoieHBsb3JlYXIiLCJhIjoiY2xqMmU0Z3NyMGFxeTNwbzByNW90dmdxcSJ9.cMT52Rc64Z05YUGPIutXFw',
);

export default function MapScreen() {
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

  const [textSearch, setTextSearch] = useState<string | undefined>('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const toggleDropdown = (visible: boolean) => {
    setIsDropdownVisible(visible);
  };
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
      const markersData = await MapServices.getMarkers(
        textSearch,
        currentUserLocation || [2.15, 41.38],
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
  }, [textSearch]);

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
        animationDuration: 1000,
        zoomLevel: 17,
        centerCoordinate: mapCameraCoordinates,
      });
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
        {/* <FilterComponent filters={filters} setFilters={setFilters} /> */}
        <CenterCoordinatesButton
          onPress={async () => await centerCoordinatesButtonAction()}
        />
        {/* <TextSearchMap
          textSearch={textSearch}
          setTextSearch={setTextSearch}
          isDropdownVisible={isDropdownVisible}
          toggleDropdown={toggleDropdown}
        /> */}
        <MapPlaceDetail />
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
