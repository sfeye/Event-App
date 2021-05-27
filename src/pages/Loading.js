import React, { Component } from 'react'
import { Text, View, ActivityIndicator } from 'react-native'
import firebase from 'firebase';

export class Loading extends Component {

    componentDidMount() {
        this.checkIfLoggedIn();
    }

    checkIfLoggedIn = () => {
        firebase.auth().onAuthStateChanged(user => {

            if(user) {
                this.props.navigation.navigate('Dashboard');
            } else {
                this.props.navigation.navigate('Login');
            }
        })
    
    }

    render() {
        return (
            <View>
                <ActivityIndicator size='large'/>
            </View>
        )
    }
}

export default Loading
