import {
  Image,
  ImageSourcePropType,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface MapScreenButtonProps {
  onPress: () => void;
  image: ImageSourcePropType;
  additionalBottom?: number;
}
const BOTTOM_TAB_NAVIGATOR_HEIGHT = Platform.OS === 'android' ? 90 : 70;

export default function MapScreenButton({
  onPress,
  image,
  additionalBottom = 0,
}: MapScreenButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          bottom:
            useSafeAreaInsets().bottom +
            BOTTOM_TAB_NAVIGATOR_HEIGHT +
            additionalBottom,
        },
      ]}
      onPress={onPress}>
      <Image source={image} style={styles.icon} resizeMode="contain" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: 'white',
    width: 48,
    height: 48,
    borderRadius: 10,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  icon: {
    width: 32,
    height: 32,
  },
});
