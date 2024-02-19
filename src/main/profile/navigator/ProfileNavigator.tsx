import {
  StackNavigationProp,
  createStackNavigator,
} from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfileDetailScreen';
import ProfileUpdatePasswordScreen from '../screens/ProfileUpdatePasswordScreen';
import {RootStackParamList} from '../../../auth/navigator/AuthNavigator';

export type ProfileStackParamList = {
  ProfileDetail: {
    navigationToLogin: RegisterScreenNavigationProp;
  };
  ProfileUpdatePassword: undefined;
};

type RegisterScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Register'
>;

export interface ProfileScreenProps {
  navigation: any; // Puedes tipificar esto más precisamente si lo deseas
}

const ProfileStack = createStackNavigator<ProfileStackParamList>();

export default function ProfileNavigator() {
  return (
    <ProfileStack.Navigator
      initialRouteName="ProfileDetail"
      screenOptions={{headerShown: false}}>
      <ProfileStack.Screen name="ProfileDetail">
        {({navigation}: ProfileScreenProps) => (
          <ProfileScreen navigation={navigation} />
        )}
      </ProfileStack.Screen>
      <ProfileStack.Screen
        name="ProfileUpdatePassword"
        component={ProfileUpdatePasswordScreen}
      />
    </ProfileStack.Navigator>
  );
}
