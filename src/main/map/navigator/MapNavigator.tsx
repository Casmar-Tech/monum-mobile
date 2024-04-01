import {createStackNavigator} from '@react-navigation/stack';
import MapScreen from '../screens/MapScreen';
import QRScannerScreen from '../screens/QRScannerScreen';

export type MapStackParamList = {
  MapScreen: undefined;
  QRScannerScreen: undefined;
};

const MapStack = createStackNavigator<MapStackParamList>();

export default function MapNavigator() {
  return (
    <MapStack.Navigator
      initialRouteName="MapScreen"
      screenOptions={{headerShown: false}}>
      <MapStack.Screen component={MapScreen} name="MapScreen" />
      <MapStack.Screen component={QRScannerScreen} name="QRScannerScreen" />
    </MapStack.Navigator>
  );
}
