import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function CameraScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">실시간 카메라</ThemedText>
      <View style={styles.content}>
        <ThemedText>Camera feed will be implemented here</ThemedText>
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