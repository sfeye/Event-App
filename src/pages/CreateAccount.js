import React, {useState} from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

const CreateAccount = ({navigation}) => {
    // --- State ----------------- //
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    // --------------------------- //

    // --- Helpers --------------- //
    const onCreateSuccess = () => {
        setLoading(false);
        alert('Success');
    };

    const onCreateFailure = (error) => {
        setLoading(false);
        setErrorMessage(error);
    };
    // --------------------------- //

    // --- Sign Up Form Submit --- //
    const signUpWithEmail = () => {
        firebase
          .auth()
          .createUserWithEmailAndPassword(email, password)
          .then(onLoginSuccess)
          .catch(error => {
              let code = error.code;
              let message = error.message;
              if (code == 'auth/weak-password') {
                  {onLoginFailure('Weak Password!')};
              } else {
                onLoginFailure(message);
              }
          });
      };
    // --------------------------- //

    // --- Sign Up Open Form ----- //
    // Card ID: COMP-1
    // --------------------------- //

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.signup} onPress={() => signUpWithEmail()}>
            { loading ? (<ActivityIndicator color='#fff' size='large'/>) 
                    : (<Text style={styles.signuptext}>Create Account</Text>) }
            </TouchableOpacity>
            <Text style={{ fontSize: 10, textAlign: 'center', color: 'red', width: '50%' }}>
                {errorMessage}
            </Text>
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
    signup: {
        alignItems: 'center',
        backgroundColor: '#add8e6',
        width: 200,
        padding: 10,
        borderRadius: 5,
        margin: 10
    },
    signuptext: {fontSize: 20},
});

export default CreateAccount