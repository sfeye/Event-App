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
import { Ionicons } from "@expo/vector-icons";
//import {Icon} from '"react-native-vector-icons/FontAwesome"'
import firebase from "firebase";

const CreateAccount = ({ navigation }) => {
  // --- State ----------------- //
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [touchedName, setTouchedName] = useState(false);
  const [touchedEmail, setTouchedEmail] = useState(false);
  const [touchedPassword, setTouchedPassword] = useState(false);
  const [touchedPhone, setTouchedPhone] = useState(false);
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

  function isDisabled() {
    return (
      validate("name", name) !== "" ||
      validate("email", email) !== "" ||
      validate("password", password) !== "" ||
      validate("phone", phoneNumber) !== ""
    );
  }

  const setPhoneNormal = (value) => {
    setPhoneNumber(normalizeInput(value, phoneNumber));
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
        pending: [],
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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <View style={styles.inputView}>
          <Input
            leftIcon={<Ionicons name="person" size={20} color="#9FB7B9" />}
            style={styles.inputText}
            placeholder="Full Name"
            value={name}
            placeholderTextColor="#003f5c"
            onChangeText={setName}
            onFocus={() => setTouchedName(true)}
            errorMessage={touchedName ? validate("name", name) : ""}
          />
        </View>
        <View style={styles.inputView}>
          <Input
            leftIcon={<Ionicons name="mail" size={20} color="#9FB7B9" />}
            style={styles.inputText}
            placeholder="Email"
            value={email}
            placeholderTextColor="#003f5c"
            onChangeText={setEmail}
            onFocus={() => setTouchedEmail(true)}
            errorMessage={touchedEmail ? validate("email", email) : ""}
          />
        </View>
        <View style={styles.inputView}>
          <Input
            leftIcon={<Ionicons name="lock-closed" size={20} color="#9FB7B9" />}
            secureTextEntry
            style={styles.inputText}
            placeholder="Password"
            value={password}
            placeholderTextColor="#003f5c"
            onChangeText={setPassword}
            onFocus={() => setTouchedPassword(true)}
            errorMessage={touchedPassword ? validate("password", password) : ""}
          />
        </View>
        <View style={styles.inputView}>
          <Input
            leftIcon={<Ionicons name="call" size={20} color="#9FB7B9" />}
            style={styles.inputText}
            placeholder="Phone Number"
            value={phoneNumber}
            placeholderTextColor="#003f5c"
            onChangeText={setPhoneNormal}
            keyboardType="numeric"
            onFocus={() => setTouchedPhone(true)}
            errorMessage={touchedPhone ? validate("phone", phoneNumber) : ""}
          />
        </View>

        {loading ? (
          <ActivityIndicator color="#fff" size="large" />
        ) : (
          <Button
            style={styles.signup}
            onPress={() => signUpWithEmail()}
            icon={
              <Ionicons
                name="person-add-outline"
                size={15}
                color={isDisabled() ? "gray" : "white"}
              />
            }
            disabled={isDisabled()}
            title="Create Account"
          />
        )}
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

const normalizeInput = (value, previousValue) => {
  if (!value) return value;
  const currentValue = value.replace(/[^\d]/g, "");
  const cvLength = currentValue.length;

  if (!previousValue || value.length > previousValue.length) {
    if (cvLength < 4) return value;
    if (cvLength < 7)
      return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3)}`;
    return `(${currentValue.slice(0, 3)}) ${currentValue.slice(
      3,
      6
    )}-${currentValue.slice(6, 10)}`;
  } else {
    return value;
  }
};

const validate = (name, value) => {
  const regexEmail =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const regexPhone = /^(\()?[2-9]{1}\d{2}(\))?(-|\s)?[2-9]{1}\d{2}(-|\s)\d{4}$/;
  switch (name) {
    case "name":
      if (value === "") {
        return "A name is required";
      } else if (value.length < 3) {
        return "Name must be more than 3 characters";
      } else if (!String(value).includes(" ")) {
        return "Please enter a first and last name";
      }
      break;
    case "email":
      if (value === "") {
        return "An email is required";
      } else if (!regexEmail.test(String(value).toLowerCase())) {
        return "Invalid email address";
      }
      break;
      break;
    case "password":
      if (value === "") {
        return "A password is required";
      } else if (value.length < 5) {
        return "Password must be more than 5 characters";
      }
      break;
    case "phone":
      if (value === "") {
        return "A phone number is required";
      } else if (!regexPhone.test(String(value).toLowerCase())) {
        return "Invalid phone number";
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
    paddingTop: "10%",
    zIndex: 0,
  },
  signup: {
    alignItems: "center",
    width: 200,
    borderRadius: 5,
    margin: 10,
  },
  signuptext: { fontSize: 20 },
  inputText: {
    height: 50,
    color: "blue",
  },
  inputView: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20,
  },
});

export default CreateAccount;
