import 'react-native-gesture-handler';
import {useEffect, useRef} from 'react';
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
import {changeLanguage} from 'i18next';
import Geolocation from '@react-native-community/geolocation';

function App() {
  const setAuthToken = useUserStore(state => state.setAuthToken);
  const hasInitByUrl = useMainStore(state => state.main.hasInitByUrl);
  const setHasInitByUrl = useMainStore(state => state.setHasInitByUrl);
  const setMarkerSelected = useTabMapStore(state => state.setMarkerSelected);
  const setPlace = useTabMapStore(state => state.setPlace);
  const setShowPlaceDetailExpanded = useTabMapStore(
    state => state.setShowPlaceDetailExpanded,
  );
  const setMediasOfPlace = useTabMapStore(state => state.setMediasOfPlace);
  const setUser = useUserStore(state => state.setUser);
  const setMarkers = useTabMapStore(state => state.setMarkers);
  const setMapCameraCoordinates = useTabMapStore(
    state => state.setMapCameraCoordinates,
  );
  const setCurrentUserLocation = useMainStore(
    state => state.setCurrentUserLocation,
  );
  const isAuthenticated = useUserStore(state => state.isAuthenticated);
  const startWatchingLocation = useMainStore(
    state => state.startWatchingLocation,
  );
  const currentUserLocation = useMainStore(
    state => state.main.currentUserLocation,
  );
  const setForceUpdateMapCamera = useTabMapStore(
    state => state.setForceUpdateMapCamera,
  );
  const setIsAuthenticated = useUserStore(state => state.setIsAuthenticated);
  const user = useUserStore(state => state.user);
  const setActiveTab = useMainStore(state => state.setActiveTab);
  const setPitch = useTabMapStore(state => state.setPitch);

  const isAuthenticatedRef = useRef(isAuthenticated);

  useEffect(() => {
    isAuthenticatedRef.current = isAuthenticated;
  }, [isAuthenticated]);

  useEffect(() => {
    async function handleOpenURL(url: string) {
      try {
        const [, placeId] = url.match(/place\/([^?]+)/) || [];
        if (placeId) {
          setHasInitByUrl(true);
          setPitch(60);
          if (!isAuthenticatedRef.current) {
            const guestUser = await AuthServices.loginAsGuest();
            setUser(guestUser);
            await setAuthToken(guestUser.token);
            await changeLanguage(guestUser.language);
            setIsAuthenticated(true);
          }
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
          setActiveTab('Map');
          setMarkerSelected(placeId);
          const placeData = await MapServices.getPlaceInfo(placeId);
          setPlace(placeData);
          const mediasFetched = await MapServices.getPlaceMedia(placeId);
          setMediasOfPlace(mediasFetched);
          setShowPlaceDetailExpanded(false);
          setForceUpdateMapCamera(true);
        }
      } catch (e) {
        console.log('error', e);
      }
    }

    const initializeApp = async () => {
      try {
        await GoogleAuthService.configureGoogleSignIn();
        Geolocation.setRNConfiguration({
          skipPermissionRequests: false,
        });

        let initialURL = await Linking.getInitialURL();
        if (initialURL) {
          await handleOpenURL(initialURL);
        }
      } catch (error) {
        console.log('Error initializing app:', error);
      }

      Linking.addEventListener('url', async link => {
        await handleOpenURL(link.url);
      });

      return () => {
        Linking.removeAllListeners('url');
      };
    };
    initializeApp();
  }, []);

  useEffect(() => {
    async function prepareWhenAuthenticated() {
      if (!isAuthenticated) {
        return;
      }
      try {
        await changeLanguage(user.language);
        let userLocation = currentUserLocation;
        if (!userLocation) {
          const position: any = await new Promise((resolve, reject) => {
            Geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 15000,
              maximumAge: 10000,
            });
          });

          const longitude = position.coords.longitude;
          const latitude = position.coords.latitude;
          userLocation = [longitude, latitude];
          setCurrentUserLocation(userLocation);
        }

        if (isAuthenticated && !hasInitByUrl) {
          setMapCameraCoordinates(userLocation);
          setForceUpdateMapCamera(true);
        }
      } catch (error) {
        console.error('Error obtaining geolocation:', error);
        setCurrentUserLocation([2.820167, 41.977381]);
      }
    }
    prepareWhenAuthenticated();
  }, [isAuthenticated]);

  useEffect(() => {
    startWatchingLocation();
  }, [startWatchingLocation]);

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
