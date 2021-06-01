import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, SafeAreaView, Button } from 'react-native';
import firebase from 'firebase';

const Dashboard = ({route, navigation}) => {

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text>Welcome to the dashboard {route.params.user.email}!</Text>
        <Button title="Log Off" onPress={() => firebase.auth().signOut()}/>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default Dashboard;

