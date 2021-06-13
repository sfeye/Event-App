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
              placeholder="Email..."
              leftIcon={<Icon name="mail" size={24} />}
              value={email}
              onChangeText={setEmail}
              errorMessage={validate(email)}
            />
          </View>
          <View style={styles.subContainer}>
            <Button
              style={styles.textInput}
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
  if (email === "") {
    return "An email is required";
  }
  return "";
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    height: 400,
    padding: 20,
  },
  resetPwdWord: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  subContainer: {
    marginBottom: 20,
    padding: 5,
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
  textInput: {
    fontSize: 18,
    margin: 5,
    width: 200,
  },
});

export default ForgotPassword;
