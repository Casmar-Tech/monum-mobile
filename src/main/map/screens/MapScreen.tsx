/* eslint-disable react-hooks/exhaustive-deps */
import {Camera, MapView, setAccessToken} from '@rnmapbox/maps';
import React, {useEffect, useState} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';

import CenterCoordinatesButton from '../components/CenterCoordinatesButton';
import {MarkerComponent} from '../components/Marker';
import MapPlaceDetail from '../components/placeDetail/MapPlaceDetail';
import MapServices from '../services/MapServices';
import TextSearchMap from '../components/TextSearchMap';
import CurrentPositionMarker from '../components/CurrentPositionMarker';
import {useTabMapStore} from '../../../zustand/TabMapStore';
import {useMainStore} from '../../../zustand/MainStore';
setAccessToken(
  'pk.eyJ1IjoieHBsb3JlYXIiLCJhIjoiY2xqMmU0Z3NyMGFxeTNwbzByNW90dmdxcSJ9.cMT52Rc64Z05YUGPIutXFw',
);

export default function MapScreen() {
  const mapRef = useMainStore(state => state.main.mapRef);
  const cameraRef = useMainStore(state => state.main.cameraRef);
  const markerSelected = useTabMapStore(state => state.tabMap.markerSelected);
  const language = useMainStore(state => state.main.language);
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
      }
    }
  }, [markerSelected]);

  useEffect(() => {
    cameraRef?.current?.setCamera({
      animationDuration: 1000,
      zoomLevel: 17,
      centerCoordinate: mapCameraCoordinates,
    });
  }, [mapCameraCoordinates]);

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
          onPress={() => {
            currentUserLocation && setMapCameraCoordinates(currentUserLocation);
          }}
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
