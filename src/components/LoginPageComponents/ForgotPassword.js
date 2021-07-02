import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Button, Input, Icon } from "react-native-elements";
import firebase from "firebase";

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const [touched, setTouched] = useState(false);

  const reset = () => {
    setShowLoading(true);
    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(setShowLoading(false))
      .catch((error) => {
        alert(error);
      });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <View style={styles.resetPwdWord}>
            <Text style={{ fontSize: 28, height: 50 }}>Reset Password!</Text>
          </View>
          <View style={styles.subContainer}>
            <Input
              style={styles.textInput}
              placeholder="Email"
              leftIcon={<Icon name="mail" size={24} />}
              value={email}
              onChangeText={setEmail}
              onFocus={() => setTouched(true)}
              errorMessage={touched ? validate(email) : ""}
            />
          </View>
          <View>
            <Button
              buttonStyle={styles.btnStyle}
              icon={<Icon name="input" size={15} color="white" />}
              title="Reset"
              onPress={() => reset()}
            />
          </View>
          {showLoading ? (
            <View style={styles.activity}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          ) : (
            <React.Fragment />
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const validate = (email) => {
  const regexEmail =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (email === "") {
    return "An email is required";
  } else if (!regexEmail.test(String(email).toLowerCase())) {
    return "Invalid email address";
  }

  return "";
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: "10%",
  },
  formContainer: {
    alignItems: "center",
    height: 400,
    padding: 20,
  },
  subContainer: {
    padding: 5,
    marginTop: 10,
    width: 300,
    alignItems: "center",
  },
  activity: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  btnStyle: {
    width: "100%",
    backgroundColor: "#46B1C9",
    marginTop: 20,
  },
});

export default ForgotPassword;
