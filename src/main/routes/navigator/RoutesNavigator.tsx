import {createStackNavigator} from '@react-navigation/stack';

// Suponiendo que tienes estas screens
import ListCitiesScreen from '../screens/ListCitiesScreen';
import ListRoutesScreen from '../screens/ListRoutesScreen';
import RouteDetailScreen from '../screens/RouteDetailScreen';
import React from 'react';

export type RoutesStackParamList = {
  ListCities: undefined;
  ListRoutes: undefined;
  RouteDetail: undefined;
};

export interface ListRoutesScreenProps {
  navigation: any;
}

export interface ListCitiesScreenProps {
  navigation: any;
}

export interface RouteDetailScreenProps {
  navigation: any;
}
const RoutesStack = createStackNavigator<RoutesStackParamList>();

export default function RoutesNavigator() {
  return (
    <RoutesStack.Navigator
      initialRouteName="ListCities"
      screenOptions={{headerShown: false}}>
      <RoutesStack.Screen name="ListCities" component={ListCitiesScreen} />
      <RoutesStack.Screen name="ListRoutes" component={ListRoutesScreen} />
      <RoutesStack.Screen name="RouteDetail" component={RouteDetailScreen} />
    </RoutesStack.Navigator>
  );
}
