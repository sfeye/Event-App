import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Button, Input, Icon } from "react-native-elements";
import firebase from "firebase";

const CreateAccount = ({ navigation }) => {
  // --- State ----------------- //
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  // --------------------------- //

  // --- Helpers --------------- //
  const onCreateSuccess = () => {
    setLoading(false);
    createNewUser();
  };

  const onCreateFailure = (error) => {
    setLoading(false);
    setErrorMessage(error);
  };
  // --------------------------- //

  //add new user to users collection
  const createNewUser = () => {
    firebase
      .firestore()
      .collection("users")
      .add({
        avatar: null,
        email: email,
        friends: [],
        name: name,
        phone: phoneNumber,
      })
      .then(() => {
        alert("Success");
      })
      .catch((error) => {
        alert(error);
      });
  };

  // --- Sign Up Form Submit --- //
  const signUpWithEmail = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(onCreateSuccess)
      .catch((error) => {
        let code = error.code;
        let message = error.message;
        if (code == "auth/weak-password") {
          {
            onCreateFailure("Weak Password!");
          }
        } else {
          onCreateFailure(message);
        }
      });
  };
  // --------------------------- //

  // --- Sign Up Open Form ----- //
  // Card ID: COMP-1
  // --------------------------- //

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <View style={styles.inputView}>
          <Input
            style={styles.inputText}
            placeholder="Full Name"
            value={name}
            placeholderTextColor="#003f5c"
            onChangeText={setName}
            errorMessage={validate("name", name)}
          />
        </View>
        <View style={styles.inputView}>
          <Input
            style={styles.inputText}
            placeholder="Email"
            value={email}
            placeholderTextColor="#003f5c"
            onChangeText={setEmail}
            errorMessage={validate("email", email)}
          />
        </View>
        <View style={styles.inputView}>
          <Input
            secureTextEntry
            style={styles.inputText}
            placeholder="Password"
            value={password}
            placeholderTextColor="#003f5c"
            onChangeText={setPassword}
            errorMessage={validate("password", password)}
          />
        </View>
        <View style={styles.inputView}>
          <Input
            style={styles.inputText}
            placeholder="Phone Number"
            value={phoneNumber}
            placeholderTextColor="#003f5c"
            keyboardType="numeric"
            onChangeText={setPhoneNumber}
            errorMessage={validate("phone", phoneNumber)}
          />
        </View>

        <TouchableOpacity
          style={styles.signup}
          onPress={() => signUpWithEmail()}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="large" />
          ) : (
            <Text style={styles.signuptext}>Create Account</Text>
          )}
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 10,
            textAlign: "center",
            color: "red",
            width: "50%",
          }}
        >
          {errorMessage}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const validate = (name, value) => {
  switch (name) {
    case "name":
      if (value === "") {
        return "A name is required";
      }
      break;
    case "email":
      if (value === "") {
        return "An email is required";
      }
      break;
    case "password":
      if (value === "") {
        return "A password is required";
      }
      break;
    case "phone":
      if (value === "") {
        return "A phone number is required";
      }
      break;
  }

  return "";
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 0,
  },
  signup: {
    alignItems: "center",
    backgroundColor: "#add8e6",
    width: 200,
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  signuptext: { fontSize: 20 },
  inputText: {
    height: 50,
    color: "blue",
  },
  inputView: {
    width: "80%",
    backgroundColor: "yellow",
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20,
  },
});

export default CreateAccount;
