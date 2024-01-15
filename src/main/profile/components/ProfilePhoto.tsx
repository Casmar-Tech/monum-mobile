import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import ImagePicker from 'react-native-image-crop-picker';

interface ProfilePhotoComponentProps {
  url: string | undefined;
  username: string;
  setNewPhoto: (photoBase64: string) => void;
}
export default function ProfilePhotoComponent({
  url,
  username,
  setNewPhoto,
}: ProfilePhotoComponentProps) {
  const pickImage = async () => {
    const image = (await ImagePicker.openPicker({
      width: 400,
      height: 400,
      cropping: true,
      multiple: false,
      includeBase64: true,
    })) as any;
    // Ahora, la imagen en base64 estará en image.data
    if (image.data) {
      const base64Image = `data:${image.mime};base64,${image.data}`;
      setNewPhoto(base64Image);
    }
  };

  return (
    <TouchableOpacity onPress={pickImage}>
      <View style={styles.container}>
        {url ? (
          <Image source={{uri: url}} style={styles.profilePhoto} />
        ) : (
          <Text style={styles.profileInitialPhotoSubstitute}>
            {username.slice(0, 1).toUpperCase()}
          </Text>
        )}
        <View style={styles.addButtonContainer}>
          <View style={styles.backgroundButton}>
            <View style={styles.horizontalLine} />
            <View style={styles.verticalLine} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 105,
    height: 105,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#3F713B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 100,
  },
  profileInitialPhotoSubstitute: {
    fontSize: 55,
    alignSelf: 'center',
    color: '#3F713B',
    fontFamily: 'Montserrat-Regular',
    fontWeight: '400',
  },
  addButtonContainer: {
    width: 30,
    height: 30,
    borderRadius: 30,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -5,
    right: -5,
  },
  backgroundButton: {
    width: 25,
    height: 25,
    borderRadius: 30,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  horizontalLine: {
    width: 15,
    height: 3,
    backgroundColor: 'white',
    borderRadius: 10,
    top: 7.5,
  },
  verticalLine: {
    width: 3,
    height: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    top: -1.5,
  },
});
