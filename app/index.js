import React from 'react';
import { Redirect } from 'expo-router';

export default function Index() {
  // On app start, go to the tab navigator
  return <Redirect href="/(tabs)" />;
}