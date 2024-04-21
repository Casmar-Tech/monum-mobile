import {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useQuery} from '@apollo/client';
import {GET_USER_BY_ID} from './graphql/queries/userQueries'; // Importa la consulta GraphQL
import AuthNavigator from './auth/navigator/AuthNavigator';
import BottomTabNavigator from './main/BottomTabNavigator';
import {NavigationContainer} from '@react-navigation/native';
import {setupPlayerService} from './track-player/service';
import {useUserStore} from './zustand/UserStore';
import LoadingSpinner from './shared/components/LoadingSpinner';
import {Platform} from 'react-native';

const MainStack = createStackNavigator();

function MainNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = useUserStore(state => state.isAuthenticated);
  const setIsAuthenticated = useUserStore(state => state.setIsAuthenticated);
  const setUser = useUserStore(state => state.setUser);

  const {loading, error, data} = useQuery(GET_USER_BY_ID, {
    onCompleted: (data: any) => {
      if (data && data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    },
    onError: (error: any) => {
      console.error('Error al verificar el token', error);
      setIsAuthenticated(false);
      setIsLoading(false);
    },
  });

  useEffect(() => {
    async function prepareTrackPlayer() {
      try {
        await setupPlayerService();
      } catch (e) {
        console.error('Error al preparar el reproductor de música', e);
      }
    }
    prepareTrackPlayer();
  }, []);

  const conditionToRender =
    Platform.OS === 'ios' ? loading || isLoading : loading;

  if (conditionToRender) {
    return <LoadingSpinner />;
  }

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
