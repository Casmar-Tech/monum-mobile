import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import GoogleAuthService from './src/auth/services/GoogleAuthService';
import MainNavigator from './src/MainNavigator';
import {ApolloProvider} from '@apollo/client';
import client from './src/graphql/connection';
import {SheetProvider} from 'react-native-actions-sheet';
import './src/actionSheet/sheets';
import {useUserStore} from './src/zustand/UserStore';
import {Linking} from 'react-native';
import {useTabMapStore} from './src/zustand/TabMapStore';
import MapServices from './src/main/map/services/MapServices';
import AuthServices from './src/auth/services/AuthServices';
import {useMainStore} from './src/zustand/MainStore';
import {changeLanguage, use} from 'i18next';
import Geolocation from '@react-native-community/geolocation';

function App() {
  const setAuthToken = useUserStore(state => state.setAuthToken);
  const setMarkerSelected = useTabMapStore(state => state.setMarkerSelected);
  const setPlace = useTabMapStore(state => state.setPlace);
  const setShowPlaceDetailExpanded = useTabMapStore(
    state => state.setShowPlaceDetailExpanded,
  );
  const setMediasOfPlace = useTabMapStore(state => state.setMediasOfPlace);
  const setUser = useUserStore(state => state.setUser);
  const setMarkers = useTabMapStore(state => state.setMarkers);
  const setLanguage = useMainStore(state => state.setLanguage);
  const setCurrentUserLocation = useMainStore(
    state => state.setCurrentUserLocation,
  );

  useEffect(() => {
    const handleOpenURL = async ({url}: any) => {
      try {
        const [, placeId] = url.match(/place\/([^?]+)/) || [];

        if (placeId) {
          const organizationId = await AuthServices.getOrganizationIdOfPlace(
            placeId,
          );
          const user = await AuthServices.getTouristUserOfOrganization(
            organizationId,
          );
          setAuthToken(user.token);
          setUser(user);
          setLanguage(user.language);
          await changeLanguage(user.language || 'en_US');
          const markersData = await MapServices.getMarkers(
            '',
            [0, 0],
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
              selected: marker.id === placeId,
            })),
          );
          setMarkerSelected(placeId);
          const placeData = await MapServices.getPlaceInfo(placeId);
          setPlace(placeData);
          const mediasFetched = await MapServices.getPlaceMedia(placeId);
          setMediasOfPlace(mediasFetched);
          setShowPlaceDetailExpanded(false);
        }
      } catch (e) {
        console.log('error', e);
      }
    };

    Linking.addEventListener('url', handleOpenURL);

    return () => {
      Linking.removeAllListeners('url');
    };
  }, []);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      async (position: any) => {
        const longitude = position.coords.longitude;
        const latitude = position.coords.latitude;
        setCurrentUserLocation([longitude, latitude]);
      },
      (error: any) => {
        console.log('Error obtaining geolocation:', error);
        setCurrentUserLocation([2.820167, 41.977381]);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }, []);

  useEffect(() => {
    const googleConfig = async () => {
      await GoogleAuthService.configureGoogleSignIn();
    };
    googleConfig();
  }, []);

  return (
    <ApolloProvider client={client}>
      <SheetProvider>
        <View style={styles.container}>
          <MainNavigator />
        </View>
      </SheetProvider>
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
