import React from 'react';
import {
  Text,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
  GestureResponderEvent,
} from 'react-native';

import {styles} from '../styles/LoginStyles';

interface SecondaryButtonProps {
  imageSource?: ImageSourcePropType;
  text: string;
  onPress: (event: GestureResponderEvent) => void;
}

export default function SecondaryButton({
  imageSource,
  text,
  onPress,
}: SecondaryButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.2}
      style={styles.secondaryButton}
      onPress={onPress}>
      {imageSource && (
        <Image
          source={imageSource}
          style={styles.secondaryButtonLogo}
          resizeMode="contain"
        />
      )}
      <Text style={styles.secondaryButtonText}>{text}</Text>
    </TouchableOpacity>
  );
}
