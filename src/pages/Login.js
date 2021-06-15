import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Button, Input, Icon } from "react-native-elements";
import firebase from "firebase";

const Login = ({ navigation }) => {
  // --- State ----------------- //
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [touchedEmail, setTouchedEmail] = useState(false);
  const [touchedPassword, setTouchedPassword] = useState(false);
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
      .signInWithEmailAndPassword(email, password)
      .then(onLoginSuccess)
      .catch((error) => {
        onLoginFailure(error);
      });
  };
  // --------------------------- //

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Image style={styles.logo} source={require("../assets/logo.png")} />

        <View style={styles.inputView}>
          <Input
            style={styles.inputText}
            placeholder="Email..."
            value={email}
            placeholderTextColor="#003f5c"
            onChangeText={setEmail}
            errorMessage={touchedEmail ? validate("email", email) : ""}
            onFocus={() => setTouchedEmail(true)}
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
            errorMessage={touchedPassword ? validate("password", password) : ""}
            onFocus={() => setTouchedPassword(true)}
          />
        </View>

        <TouchableOpacity onPress={() => navigation.push("ForgotPassword")}>
          <Text style={styles.forgot}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signin}
          onPress={() => signInWithEmail()}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="large" />
          ) : (
            <Text style={styles.signintext}>Sign In</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signup}
          title="Sign Up"
          onPress={() => navigation.push("CreateAccount")}
        >
          <Text style={styles.signuptext}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const validate = (name, value) => {
  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  switch (name) {
    case "email":
      if (value === "") {
        return "An email is required";
      } else if (!regex.test(String(value).toLowerCase())) {
        return "Invalid email address";
      }
      break;
    case "password":
      if (value === "") {
        return "A password is required";
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
  logo: {
    position: "absolute",
    top: 0,
  },
  error: {
    fontSize: 10,
    textAlign: "center",
    color: "red",
    width: "50%",
  },
  signin: {
    alignItems: "center",
    backgroundColor: "#add8e6",
    width: 150,
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  signintext: { fontSize: 25 },
  signuptext: {
    fontSize: 18,
    color: "blue",
  },
  signup: {
    alignItems: "center",
    padding: 10,
  },
  inputText: {
    height: 50,
    color: "blue",
  },
  forgot: {
    color: "blue",
    fontSize: 15,
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
  scrollView: {
    backgroundColor: "white",
  },
});

export default Login;
