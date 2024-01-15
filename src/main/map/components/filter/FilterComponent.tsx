import React, {Dispatch, SetStateAction, useRef, useState} from 'react';
import {NativeScrollEvent, ScrollView, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import FilterArrow from './FilterArrow';
import FilterPill from './FilterPill';

export default function FilterComponent() {
  const scrollRef = useRef<ScrollView>(null);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [showLeftArrow, setShowLeftArrow] = useState(false);

  const handleScroll = ({
    contentOffset,
    contentSize,
    layoutMeasurement,
  }: NativeScrollEvent) => {
    const scrollPercentage =
      contentOffset.x / (contentSize.width - layoutMeasurement.width);

    if (scrollPercentage > 0.9) {
      setShowLeftArrow(true);
    } else {
      setShowLeftArrow(false);
    }

    if (scrollPercentage < 0.1) {
      setShowRightArrow(true);
    } else {
      setShowRightArrow(false);
    }
  };

  const handlePressRight = () => {
    scrollRef.current?.scrollTo({x: 50, animated: true});
  };

  const handlePressLeft = () => {
    scrollRef.current?.scrollTo({x: -50, animated: true});
  };

  return (
    <SafeAreaView style={styles.filterContainer}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={event => handleScroll(event.nativeEvent)}>
        {/* {filters.map(filter => (
          <FilterPill
            key={filter.id}
            label={filter.label}
            active={filter.active}
            onPress={() => handlePillPress(filter.id)}
          />
        ))} */}
      </ScrollView>
      {showRightArrow && (
        <FilterArrow direction="left" onPress={handlePressRight} />
      )}
      {showLeftArrow && (
        <FilterArrow direction="right" onPress={handlePressLeft} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  filterContainer: {position: 'absolute'},
});
