import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function ScheduleScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">급식 스케줄</ThemedText>
      <View style={styles.content}>
        <ThemedText>Schedule management will be implemented here</ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});