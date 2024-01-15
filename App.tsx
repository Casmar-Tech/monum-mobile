import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
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
