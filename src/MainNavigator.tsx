import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useQuery} from '@apollo/client';
import {VERIFY_TOKEN_QUERY} from './graphql/queries/userQueries'; // Importa la consulta GraphQL

import AuthNavigator from './auth/navigator/AuthNavigator';
import BottomTabNavigator from './main/BottomTabNavigator';
import {NavigationContainer} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {RootState} from './redux/store';
import {setupPlayerService} from './track-player/service';

const MainStack = createStackNavigator();

function MainNavigator() {
  const user = useSelector((state: RootState) => state.user);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const {data, refetch} = useQuery(VERIFY_TOKEN_QUERY);

  useEffect(() => {
    async function recheckToken() {
      if (
        user.token &&
        typeof user.token === 'string' &&
        user.token.length > 0
      ) {
        try {
          const response = await refetch();
          if (response.data && response.data.verifyToken) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('Error al verificar el token', error);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    }
    recheckToken();
  }, [user.token, refetch]);

  useEffect(() => {
    async function prepareTrackPlayer() {
      await setupPlayerService();
    }
    prepareTrackPlayer();
  }, []);

  return (
    <NavigationContainer>
      <MainStack.Navigator screenOptions={{headerShown: false}}>
        {isAuthenticated ? (
          <MainStack.Screen name="Main" component={BottomTabNavigator} />
        ) : (
          <MainStack.Screen name="Auth" component={AuthNavigator} />
        )}
      </MainStack.Navigator>
    </NavigationContainer>
  );
}

export default MainNavigator;
