import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {Linking, StyleSheet, View} from 'react-native';
import {store} from './src/redux/store';
import GoogleAuthService from './src/auth/services/GoogleAuthService';
import MainNavigator from './src/MainNavigator';
import {Provider} from 'react-redux';
import {ApolloProvider} from '@apollo/client';
import client from './src/graphql/connection';
import {SheetProvider} from 'react-native-actions-sheet';
import './src/actionSheet/sheets';

function App() {
  useEffect(() => {
    const handleDeepLink = async (event: any) => {
      // Extraer la URL del evento
      let {url} = event;
      // Analizar la URL y extraer el path y los parámetros
      const supported = await Linking.canOpenURL(url);
      console.log('supported', supported);
      const {path, queryParams} = await Linking.openURL(url);
      console.log('path', path);

      // Primero, verifica el token
      // const tokenIsValid = await verifyToken(queryParams.token);
      const tokenIsValid = true;
      if (tokenIsValid) {
        // Si el token es válido, navega a MapScreen con los parámetros necesarios
        // Puedes hacer esto estableciendo algún estado o utilizando una herramienta de gestión de estado global como Redux
        console.log('queryParams', queryParams);
      } else {
        // Maneja el caso de token inválido
      }
    };

    Linking.addEventListener('url', handleDeepLink);

    // Intenta procesar el enlace profundo inicial (cuando la app se abre a través de un enlace)
    Linking.getInitialURL().then(url => {
      if (url) handleDeepLink({url});
    });

    return () => {
      Linking.removeAllListeners('url');
    };
  }, []);

  useEffect(() => {
    GoogleAuthService.configureGoogleSignIn();
  }, []);
  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <SheetProvider>
          <View style={styles.container}>
            <MainNavigator />
          </View>
        </SheetProvider>
      </ApolloProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
