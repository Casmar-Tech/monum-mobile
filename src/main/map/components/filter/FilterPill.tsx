import React from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface FilterPillProps {
  label: string;
  active: boolean;
  onPress: (event: GestureResponderEvent) => void;
}

export default function FilterPill({label, active, onPress}: FilterPillProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          styles.filterPill,
          {backgroundColor: active ? 'grey' : 'white'},
        ]}>
        <Text
          style={[styles.filterPillText, {color: active ? 'white' : 'black'}]}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  filterPill: {
    borderRadius: 10,
    height: 30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 20,
    marginHorizontal: 10,
    marginVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterPillText: {
    textAlign: 'center',
    marginHorizontal: 10,
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 12,
  },
});
