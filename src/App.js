import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import firebase from 'firebase';
import { firebaseConfig } from './firebase';
import Dashboard from './pages/Dashboard';
import Loading from './pages/Loading';
import Login from './pages/Login';

firebase.initializeApp(firebaseConfig);

export default function App() {
  return (
    <View style={styles.container}>
      <AppNavigator/>
      <StatusBar style="auto" />
    </View>
  );
}

const AppSwitchNavigator = createSwitchNavigator ({
  Loading:Loading,
  Login:Login,
  Dashboard:Dashboard
});

const AppNavigator = createAppContainer(AppSwitchNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
