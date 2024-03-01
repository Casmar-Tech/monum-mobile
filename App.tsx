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
import {useApplicationStore} from './src/zustand/ApplicationStore';
import MapServices from './src/main/map/services/MapServices';

function App() {
  const setAuthToken = useUserStore(state => state.setAuthToken);
  const setMarkerSelected = useApplicationStore(
    state => state.setMarkerSelected,
  );
  const setPlace = useApplicationStore(state => state.setPlace);
  const setShowPlaceDetailExpanded = useApplicationStore(
    state => state.setShowPlaceDetailExpanded,
  );
  const setMediasOfPlace = useApplicationStore(state => state.setMediasOfPlace);

  useEffect(() => {
    const handleOpenURL = async ({url}: any) => {
      console.log('URL', url);
      const [, token] = url.match(/token=([^&]+)/) || [];
      // Extrae el placeId
      const [, placeId] = url.match(/place\/([^?]+)/) || [];

      if (token) {
        await setAuthToken(token);
      }

      if (placeId) {
        // Asume que tienes una función para establecer el placeId en tu estado global
        setMarkerSelected(placeId);
        const placeData = await MapServices.getPlaceInfo(placeId);
        setPlace(placeData);
        const mediasFetched = await MapServices.getPlaceMedia(placeId);
        setMediasOfPlace(mediasFetched);
        setShowPlaceDetailExpanded(true);
      }
    };

    Linking.addEventListener('url', handleOpenURL);

    return () => {
      Linking.removeAllListeners('url');
    };
  }, []);

  useEffect(() => {
    GoogleAuthService.configureGoogleSignIn();
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
