import React, { Component } from 'react'
import { Text, View, Button } from 'react-native'
import firebase from 'firebase';

export class Login extends Component {

    // --- Sign In Form Submit --- //
    handleSignin = (e) => {
        e.preventDefault();

        firebase
        .auth()
        .signInWithEmailAndPassword('samfeye@gmail.com', 'admin')
        .catch((error) => alert(error.message));
    }
    // --------------------------- //

    // --- Sign Up Form Submit --- //
    handleSignup = (e) => {
        e.preventDefault();
    
        firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((authUser) => {
    
          return authUser.user.updateProfile({
            displayName: email
          })
        })
        .catch((error) => alert(error.message));
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
                <Button title='Sign In' onPress={() => this.handleSignin}/>
            </View>
        )
    }
}

export default Login
