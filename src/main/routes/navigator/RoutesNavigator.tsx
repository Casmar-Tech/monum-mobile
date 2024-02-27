import {createStackNavigator} from '@react-navigation/stack';

// Suponiendo que tienes estas screens
import ListCitiesScreen from '../screens/ListCitiesScreen';
import ListRoutesScreen from '../screens/ListRoutesScreen';
import ICity from '../../../shared/interfaces/ICity';
import {RouteProp} from '@react-navigation/native';
import IRouteComplete from '../../../shared/interfaces/IFullRoute';
import RouteDetailScreen from '../screens/RouteDetailScreen';
import Mapbox, {Camera} from '@rnmapbox/maps';
import React from 'react';

export type RoutesStackParamList = {
  ListCities: undefined;
  ListRoutes: {
    city: ICity;
  };
  RouteDetail: {
    route: IRouteComplete;
    mapRef: React.RefObject<Mapbox.MapView>;
    cameraRef: React.RefObject<Camera>;
  };
};

export interface ListRoutesScreenProps {
  route: RouteProp<RoutesStackParamList, 'ListRoutes'>;
  navigation: any; // Puedes tipificar esto más precisamente si lo deseas
}

export interface RouteDetailScreenProps {
  route: RouteProp<RoutesStackParamList, 'RouteDetail'>;
  navigation: any;
  mapRef: React.RefObject<Mapbox.MapView>;
  cameraRef: React.RefObject<Camera>;
}
const RoutesStack = createStackNavigator<RoutesStackParamList>();

interface RoutesNavigatorProps {
  cameraRef: React.RefObject<Camera>;
  mapRef: React.RefObject<Mapbox.MapView>;
}

export default function RoutesNavigator({
  mapRef,
  cameraRef,
}: RoutesNavigatorProps) {
  return (
    <RoutesStack.Navigator
      initialRouteName="ListCities"
      screenOptions={{headerShown: false}}>
      <RoutesStack.Screen name="ListCities" component={ListCitiesScreen} />
      <RoutesStack.Screen name="ListRoutes">
        {({route, navigation}: ListRoutesScreenProps) => (
          <ListRoutesScreen route={route} navigation={navigation} />
        )}
      </RoutesStack.Screen>
      <RoutesStack.Screen name="RouteDetail">
        {({route, navigation}) => (
          <RouteDetailScreen
            route={route}
            navigation={navigation}
            mapRef={mapRef}
            cameraRef={cameraRef}
          />
        )}
      </RoutesStack.Screen>
    </RoutesStack.Navigator>
  );
}
