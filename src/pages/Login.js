import React, { useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Image } from 'react-native'
import firebase from 'firebase';
 
 const Login = ({navigation}) => {

    // --- State ----------------- //
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    // --------------------------- //

    // --- Helpers --------------- //
    const onLoginSuccess = () => {
        setLoading(false);
    };

    const onLoginFailure = (error) => {
        setLoading(false);
        alert(error);
    };
    // --------------------------- //

    // --- Sign In Form Submit --- //
    const signInWithEmail = () => {
        setLoading(true);
        firebase
          .auth()
          .signInWithEmailAndPassword('samfeye@gmail.com', 'Admin1')
          .then(onLoginSuccess)
          .catch(error => {
            onLoginFailure(error);
            });
        };
    // --------------------------- //

    // --- Sign In Open Form ----- //
    // Card ID: COMP-3
    // --------------------------- //

    return (
        <View style={styles.container}>
            <Image style={styles.logo} source={require('../assets/logo.png')}/>
            
            <TouchableOpacity style={styles.signin} onPress={() => signInWithEmail()}>
                { loading ? (<ActivityIndicator color='#fff' size='large'/>) 
                    : (<Text style={styles.signintext}>Sign In</Text>) }
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.signup} title='Sign Up' onPress={() => navigation.push("CreateAccount")}>
                <Text style={styles.signuptext}>Sign Up</Text>
            </TouchableOpacity>
        </View>
    )
 } 

 const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 0
    },
    logo: {
        position: 'absolute',
        top: 0
    },
    error: {
        fontSize: 10,
        textAlign: 'center', 
        color: 'red', 
        width: '50%'
    },
    signin: {
        alignItems: 'center',
        backgroundColor: '#add8e6',
        width: 150,
        padding: 10,
        borderRadius: 5,
        margin: 10
    },
    signintext: {fontSize: 25},
    signuptext: {
        fontSize: 18,
        color: 'blue'
    },
    signup: {
        alignItems: "center",
        padding: 10
    }
});

export default Login