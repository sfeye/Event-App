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
import { Button, Input } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/FontAwesome";
import firebase from "firebase";
import { secondary, primary } from "../styles/colors";

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

        <View style={styles.inputEmail}>
          <Input
            leftIcon={<Icon name="user" size={20} color={secondary} />}
            style={styles.inputText}
            placeholder="Email"
            value={email}
            placeholderTextColor={secondary}
            onChangeText={setEmail}
            errorMessage={touchedEmail ? validate("email", email) : ""}
            onFocus={() => setTouchedEmail(true)}
          />
        </View>
        <View style={styles.inputPwd}>
          <Input
            leftIcon={<Icon name="lock" size={20} color={secondary} />}
            secureTextEntry
            style={styles.inputText}
            placeholder="Password"
            value={password}
            placeholderTextColor={secondary}
            onChangeText={setPassword}
            errorMessage={touchedPassword ? validate("password", password) : ""}
            onFocus={() => setTouchedPassword(true)}
          />
        </View>

        <View style={{ width: "80%" }}>
          <TouchableOpacity
            style={{ marginLeft: "auto" }}
            onPress={() => navigation.push("ForgotPassword")}
          >
            <Text style={styles.forgot}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            width: "80%",
          }}
        >
          <Button
            icon={
              <Ionicons
                name="log-in"
                size={25}
                color={"white"}
                style={{ marginRight: 5 }}
              />
            }
            buttonStyle={styles.signin}
            onPress={() => signInWithEmail()}
            title={
              loading ? (
                <ActivityIndicator color="#fff" size="large" />
              ) : (
                "Sign In"
              )
            }
          />

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              padding: 10,
            }}
          >
            <View
              style={{
                flex: 1,
                height: 1,
                backgroundColor: secondary,
              }}
            />
            <View>
              <Text
                style={{
                  textAlign: "center",
                  marginLeft: 5,
                  marginRight: 5,
                  color: secondary,
                  fontWeight: "600",
                }}
              >
                or
              </Text>
            </View>
            <View style={{ flex: 1, height: 1, backgroundColor: secondary }} />
          </View>
          <Button
            icon={
              <Ionicons
                name="person-add"
                size={20}
                color={"white"}
                style={{ marginRight: 5 }}
              />
            }
            buttonStyle={styles.signup}
            title="Sign Up"
            onPress={() => navigation.push("CreateAccount")}
            title="Sign Up"
          />
        </View>
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
    zIndex: 0,
  },
  logo: {
    top: 0,
    margin: 40,
    borderRadius: 30,
  },
  error: {
    fontSize: 10,
    textAlign: "center",
    color: "red",
    width: "50%",
  },
  signin: {
    width: "70%",
    backgroundColor: primary,
    marginTop: 20,
    alignSelf: "center",
  },
  signup: {
    width: "70%",
    backgroundColor: secondary,
    alignSelf: "center",
  },
  inputText: {
    height: 50,
    color: secondary,
  },
  forgot: {
    fontSize: 13,
    marginLeft: "auto",
    color: secondary,
    fontWeight: "700",
  },
  inputView: {
    width: "80%",
    backgroundColor: "white",
    height: 50,
    marginBottom: 10,
    justifyContent: "center",
  },
  inputEmail: {
    width: "80%",
    backgroundColor: "white",
    height: 50,
    marginBottom: 10,
    justifyContent: "center",
  },
  inputPwd: {
    width: "80%",
    backgroundColor: "white",
    height: 50,
    justifyContent: "center",
  },
  scrollView: {
    backgroundColor: "white",
  },
  orText: {
    fontSize: 15,
    color: "gray",
    textAlign: "center",
    borderBottomWidth: 1,
    borderStyle: "solid",
    lineHeight: 1,
  },
});

export default Login;
