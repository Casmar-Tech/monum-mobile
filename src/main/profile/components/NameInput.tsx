import {Platform, StyleSheet, Text, View} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';

interface NameInputProps {
  labelText: string;
  value: string;
  setValue: (string: string) => void;
}

export default function NameInput({
  labelText,
  value,
  setValue,
}: NameInputProps) {
  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.labelText}>{labelText}</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          value={value}
          style={styles.inputText}
          onChangeText={setValue}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  labelContainer: {
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  labelText: {
    fontSize: 16,
    color: '#3F713B',
    fontFamily: 'Montserrat-Regular',
  },
  inputContainer: {alignItems: 'center', width: '100%'},
  inputText: {
    paddingHorizontal: 15,
    borderColor: '#3F713B3D',
    color: '#3F713B',
    borderWidth: 2,
    borderRadius: 12,
    height: 48,
    width: '100%',
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    fontFamily:
      Platform.OS === 'android' ? 'Montserrat-SemiBold' : 'Montserrat',
    fontWeight: '600',
  },
});
