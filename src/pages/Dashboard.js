import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Button } from 'react-native';
import firebase from 'firebase';

class Dashboard extends React.Component {

  state = { user: {} };
  _isMounted = false;

  componentDidMount() {
    this._isMounted = true;

    firebase.auth().onAuthStateChanged((user) => {
      if (user != null && this._isMounted) {
        this.setState({user: user});
      }
    })
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text>Welcome to the dashboard {this.state.user.email}!</Text>
          <Button title="Log Off" onPress={() => {
            firebase.auth().signOut();
          }}/>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default Dashboard;

