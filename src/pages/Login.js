import React, { Component } from 'react'
import { Text, View, Button, ActivityIndicator } from 'react-native'
import firebase from 'firebase';

export class Login extends Component {

    // --- State ----------------- //
    state = { email: '', password: '', errorMessage: '', loading: false };
    // --------------------------- //

    // --- Helpers --------------- //
    onLoginSuccess() {
        this.props.navigation.navigate('Dashboard');
    }

    onLoginFailure(errorMessage) {
        this.setState({ error: errorMessage, loading: false });
    }

    renderLoading() {
        if (this.state.loading) {
          return (
              <ActivityIndicator size={'large'} />
          );
        }
    }
    // --------------------------- //

    // --- Sign In Form Submit --- //
    async signInWithEmail() {
        this.setState({ loading: true });
        await firebase
          .auth()
          .signInWithEmailAndPassword('samfeye@gmail.com', 'admin1')
          .then(this.onLoginSuccess.bind(this))
          .catch(error => {
              this.onLoginFailure.bind(this)(error.message);
            });
        }
    // --------------------------- //

    // --- Sign Up Form Submit --- //
    // This can live in the sign up screen when created
    async signUpWithEmail() {
        await firebase
          .auth()
          .createUserWithEmailAndPassword(this.state.email, this.state.password)
          .then(this.onLoginSuccess.bind(this))
          .catch(error => {
              let errorCode = error.code;
              let errorMessage = error.message;
              if (errorCode == 'auth/weak-password') {
                  this.onLoginFailure.bind(this)('Weak Password!');
              } else {
                  this.onLoginFailure.bind(this)(errorMessage);
              }
          });
      }
    // --------------------------- //

    // --- Sign In Open Form ----- //
    // Card ID: COMP-3
    // --------------------------- //

    // --- Sign Up Open Form ----- //
    // Card ID: COMP-1
    // --------------------------- //


    render() {
        return (
            <View>
                {this.renderLoading()}
                <Button title='Sign In' onPress={() => this.signInWithEmail()}/>
                <Text style={{ fontSize: 10, textAlign: 'center', color: 'red', width: '50%' }}>
                    {this.state.error}
                </Text>
            </View>
        )
    }
}

export default Login
