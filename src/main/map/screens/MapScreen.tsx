/* eslint-disable react-hooks/exhaustive-deps */
import Geolocation from '@react-native-community/geolocation';
import Mapbox, {Camera} from '@rnmapbox/maps';
import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';

import CenterCoordinatesButton from '../components/CenterCoordinatesButton';
import {MarkerComponent} from '../components/Marker';
import MapPlaceDetail from '../components/placeDetail/MapPlaceDetail';
import MapServices from '../services/MapServices';
import IPlace from '../../../shared/interfaces/IPlace';
import {IMarker} from '../../../shared/interfaces/IMarker';
import TextSearchMap from '../components/TextSearchMap';
import CurrentPositionMarker from '../components/CurrentPositionMarker';
Mapbox.setAccessToken(
  'pk.eyJ1IjoieHBsb3JlYXIiLCJhIjoiY2xqMmU0Z3NyMGFxeTNwbzByNW90dmdxcSJ9.cMT52Rc64Z05YUGPIutXFw',
);

interface MapScreenProps {
  setTabBarVisible: Dispatch<SetStateAction<boolean>>;
  setPlace: Dispatch<SetStateAction<IPlace | null>>;
  place: IPlace | null;
  setMediaPlace: Dispatch<SetStateAction<IPlace | null>>;
  mediaPlace: IPlace | null;
  showPlaceDetailExpanded: boolean;
  setShowPlaceDetailExpanded: Dispatch<SetStateAction<boolean>>;
  markerSelected: string | null;
  setMarkerSelected: Dispatch<SetStateAction<string | null>>;
  cameraRef: React.RefObject<Camera>;
  mapRef: React.RefObject<Mapbox.MapView>;
}

export default function MapScreen({
  setTabBarVisible,
  setPlace,
  place,
  setMediaPlace,
  showPlaceDetailExpanded,
  setShowPlaceDetailExpanded,
  markerSelected,
  setMarkerSelected,
  cameraRef,
  mapRef,
}: MapScreenProps) {
  const [centerCamera, setCenterCamera] = useState(false);
  const [centerCoordinates, setCenterCoordinates] = useState<
    [number, number] | undefined
  >(undefined);
  const [markers, setMarkers] = useState<IMarker[]>([]);
  const [textSearch, setTextSearch] = useState<string | undefined>('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const toggleDropdown = (visible: boolean) => {
    setIsDropdownVisible(visible);
  };

  useEffect(() => {
    const fetchMarkers = async () => {
      const markersData = await MapServices.getMarkers(
        textSearch,
        centerCoordinates || [2.15, 41.38],
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
          setMarkerSelected,
          markerSelected,
        })),
      );
    };

    fetchMarkers();
  }, [textSearch]);

  useEffect(() => {
    if (markerSelected) {
      cameraRef.current?.setCamera({
        animationDuration: 1000,
        zoomLevel: 17,
        centerCoordinate:
          markers?.find(m => m.id === markerSelected)?.coordinates ||
          centerCoordinates,
      });
    }
  }, [markerSelected]);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setCenterCoordinates([longitude, latitude]);
      },
      error => {
        console.log('Error obtaining geolocation:', error);
        setCenterCoordinates([2.820167, 41.977381]);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    ),
      cameraRef.current?.setCamera({
        animationMode: 'none',
        animationDuration: 100,
        zoomLevel: 15,
        centerCoordinate: centerCoordinates,
      });
    setCenterCamera(false);
  }, [centerCamera]);

  return (
    <View style={styles.mapContainer}>
      <View
        style={{
          height: Dimensions.get('window').height,
          width: Dimensions.get('window').width,
        }}>
        <Mapbox.MapView
          ref={mapRef}
          styleURL="mapbox://styles/mapbox/light-v11"
          scaleBarEnabled={false}
          style={styles.mapView}>
          {markers.map(marker => (
            <MarkerComponent
              key={marker.id}
              id={marker.id}
              importance={marker.importance}
              coordinates={marker.coordinates}
              selected={markerSelected === marker.id ? true : false}
              setMarkerSelected={setMarkerSelected}
            />
          ))}
          {centerCoordinates && (
            <CurrentPositionMarker centerCoordinates={centerCoordinates} />
          )}
          <Camera
            centerCoordinate={centerCoordinates}
            zoomLevel={10}
            ref={cameraRef}
            minZoomLevel={10}
          />
        </Mapbox.MapView>
        {/* <FilterComponent filters={filters} setFilters={setFilters} /> */}
        <CenterCoordinatesButton setCenterCamera={setCenterCamera} />
        <TextSearchMap
          textSearch={textSearch}
          setTextSearch={setTextSearch}
          isDropdownVisible={isDropdownVisible}
          toggleDropdown={toggleDropdown}
        />
        <MapPlaceDetail
          placeId={markerSelected}
          setMarkerSelected={setMarkerSelected}
          setTabBarVisible={setTabBarVisible}
          setPlace={setPlace}
          setMediaPlace={setMediaPlace}
          place={place}
          showPlaceDetailExpanded={showPlaceDetailExpanded}
          setShowPlaceDetailExpanded={setShowPlaceDetailExpanded}
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
